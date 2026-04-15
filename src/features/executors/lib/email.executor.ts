import { NonRetriableError } from "inngest";
import { NodeExecutor } from "./types";
import { channel, topic } from "@inngest/realtime";
import { db } from "@/db";
import { credentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/security";

export type EmailNodeData = {
  variableName?: string;
  provider: "resend" | "smtp";
  fromEmail?: string;
  fromName?: string;
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
  credentialId?: string;
  smtpCredentialId?: string;
  [key: string]: unknown;
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
};

const emailRequestChannel = channel("email-request").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);

async function getResendApiKey(credentialId?: string): Promise<string | undefined> {
  if (credentialId && credentialId !== "none") {
    const credential = await db.query.credentials.findFirst({
      where: eq(credentials.id, credentialId),
    });
    if (credential) {
      return decrypt(credential.value);
    }
  }
  return process.env.RESEND_API_KEY;
}

async function getSmtpConfig(credentialId?: string): Promise<SmtpConfig | undefined> {
  if (credentialId && credentialId !== "none") {
    const credential = await db.query.credentials.findFirst({
      where: eq(credentials.id, credentialId),
    });
    if (credential && credential.provider === "SMTP") {
      const decrypted = decrypt(credential.value);
      return JSON.parse(decrypted) as SmtpConfig;
    }
  }

  // Fallback to environment variables
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      username: process.env.SMTP_USER,
      password: process.env.SMTP_PASS,
      fromEmail: process.env.SMTP_FROM || "",
    };
  }

  return undefined;
}

export const emailNodeExecutor: NodeExecutor<EmailNodeData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(emailRequestChannel().status({ nodeId, status: "loading" }));

  if (!data.to) {
    await publish(emailRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("No recipient email configured");
  }

  const result = await step.run("send-email", async () => {
    const to = resolveTemplate(data.to, context);
    const subject = resolveTemplate(data.subject, context);
    const body = resolveTemplate(data.body, context);

    if (data.provider === "smtp") {
      const smtpConfig = await getSmtpConfig(data.smtpCredentialId);
      if (!smtpConfig) {
        throw new NonRetriableError("No SMTP credentials configured. Add SMTP credentials or set env variables.");
      }

      const sendResult = await sendViaSmtp({
        from: smtpConfig.fromEmail,
        fromName: data.fromName,
        to,
        subject,
        html: body,
        replyTo: data.replyTo,
        config: smtpConfig,
      });

      return {
        ...context,
        emailSent: {
          success: true,
          messageId: sendResult.messageId,
          to,
          subject,
          provider: "smtp",
        },
      };
    }

    // Default to Resend
    const apiKey = await getResendApiKey(data.credentialId);
    if (!apiKey) {
      throw new NonRetriableError("No Resend API key configured. Add RESEND_API_KEY env var or select a credential.");
    }

    if (!data.fromEmail) {
      throw new NonRetriableError("No sender email configured");
    }

    const sendResult = await sendViaResend({
      from: data.fromName
        ? `${data.fromName} <${data.fromEmail}>`
        : data.fromEmail,
      to,
      subject,
      html: body,
      replyTo: data.replyTo,
      apiKey,
    });

    return {
      ...context,
      emailSent: {
        success: true,
        messageId: sendResult.messageId,
        to,
        subject,
        provider: "resend",
      },
    };
  });

  await publish(emailRequestChannel().status({ nodeId, status: "success" }));

  return result;
};

function resolveTemplate(
  template: string,
  context: Record<string, unknown>,
): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const value = key
      .trim()
      .split(".")
      .reduce((obj: unknown, k: string) => {
        if (obj && typeof obj === "object") {
          return (obj as Record<string, unknown>)[k];
        }
        return undefined;
      }, context);
    return String(value ?? "");
  });
}

async function sendViaResend(params: {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  apiKey?: string;
}) {
  const { Resend } = await import("resend");
  const resend = new Resend(params.apiKey || process.env.RESEND_API_KEY);

  const result = await resend.emails.send({
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    ...(params.replyTo && { reply_to: params.replyTo }),
  });

  if (result.error) {
    throw new NonRetriableError(`Resend error: ${result.error.message}`);
  }

  return { messageId: result.data?.id };
}

async function sendViaSmtp(params: {
  from: string;
  fromName?: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  config: SmtpConfig;
}) {
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    host: params.config.host,
    port: params.config.port,
    secure: params.config.secure,
    auth: {
      user: params.config.username,
      pass: params.config.password,
    },
  });

  const fromAddress = params.fromName
    ? `${params.fromName} <${params.from}>`
    : params.from;

  const result = await transporter.sendMail({
    from: fromAddress,
    to: params.to,
    subject: params.subject,
    html: params.html,
    ...(params.replyTo && { replyTo: params.replyTo }),
  });

  if (result.rejected.length > 0) {
    throw new NonRetriableError(`SMTP error: ${result.rejected.join(", ")}`);
  }

  return { messageId: result.messageId };
}