import { NonRetriableError } from "inngest";
import { NodeExecutor } from "./types";
import { channel, topic } from "@inngest/realtime";
import { db } from "@/db";
import { credentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/security";

export type EmailNodeData = {
  variableName?: string;
  provider: "resend";
  fromEmail: string;
  fromName?: string;
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
  credentialId?: string;
  [key: string]: unknown;
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

  if (!data.fromEmail) {
    await publish(emailRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("No sender email configured");
  }

  const result = await step.run("send-email", async () => {
    const to = resolveTemplate(data.to, context);
    const subject = resolveTemplate(data.subject, context);
    const body = resolveTemplate(data.body, context);
    const apiKey = await getResendApiKey(data.credentialId);

    if (!apiKey) {
      throw new NonRetriableError("No Resend API key configured. Add RESEND_API_KEY env var or select a credential.");
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

export { emailRequestChannel };