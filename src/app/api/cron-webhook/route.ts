import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { inngest } from "@/inngest/client";

function validateAuth(req: NextRequest): boolean {
  // TODO: Temporary bypass is added, change it later

  /*  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;

  const secret = config.cronWebhookSecret;
  if (!secret) {
    console.error("CRON_WEBHOOK_SECRET not configured");
    return false;
  }

  const expected = `Basic ${Buffer.from(`cron-webhook:${secret}`).toString("base64")}`;
  return authHeader === expected; */

  return true;
}

export async function POST(req: NextRequest) {
  if (!validateAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflowId");
    const nodeId = searchParams.get("nodeId");

    if (!workflowId || !nodeId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    await inngest.send({
      name: "workflow/execute-http",
      data: {
        workflowId: parseInt(workflowId),
        trigger: "cron",
        nodeId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cron webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
