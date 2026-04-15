"use server";

import { httpRequestChannel } from "@/inngest/channels/http-request";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { cronTriggerChannel } from "@/inngest/channels/cron-trigger";
import { aiRequestChannel } from "@/inngest/channels/ai-request";
import { emailRequestChannel } from "./email-channel";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type HttpRequestToken = Realtime.Token<
  typeof httpRequestChannel,
  ["status"]
>;

export type ManualTriggerToken = Realtime.Token<
  typeof manualTriggerChannel,
  ["status"]
>;

export type CronTriggerToken = Realtime.Token<
  typeof cronTriggerChannel,
  ["status"]
>;

export type AiRequestToken = Realtime.Token<
  typeof aiRequestChannel,
  ["status"]
>;

export type EmailRequestToken = Realtime.Token<
  typeof emailRequestChannel,
  ["status"]
>;

// For getting the status data in realtime
export async function fetchHttpRequestRealTime(): Promise<HttpRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: httpRequestChannel(),
    topics: ["status"],
  });
  return token;
}

export async function fetchManualTriggerRealTime(): Promise<ManualTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: manualTriggerChannel(),
    topics: ["status"],
  });
  return token;
}

export async function fetchCronTriggerRealTime(): Promise<CronTriggerToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: cronTriggerChannel(),
    topics: ["status"],
  });
  return token;
}

export async function fetchAiRequestRealTime(): Promise<AiRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: aiRequestChannel(),
    topics: ["status"],
  });
  return token;
}

export async function fetchEmailRequestRealTime(): Promise<EmailRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: emailRequestChannel(),
    topics: ["status"],
  });
  return token;
}
