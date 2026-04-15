import { channel, topic } from "@inngest/realtime";

export const emailRequestChannel = channel("email-request").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);