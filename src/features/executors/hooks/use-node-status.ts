import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { Realtime } from "@inngest/realtime";
import { useMemo } from "react";

interface UseNodeStatusOptions {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
  enabled?: boolean;
}

export function useNodeStatus({
  nodeId,
  channel,
  topic,
  refreshToken,
  enabled = false,
}: UseNodeStatusOptions) {
  const { data } = useInngestSubscription({
    refreshToken,
    enabled,
  });

  const status = useMemo<NodeStatus>(() => {
    if (!data.length) return "initial";

    const latestMessage = data
      .filter(
        (msg) =>
          msg.kind === "data" &&
          msg.channel === channel &&
          msg.topic === topic &&
          msg.data.nodeId === nodeId,
      )
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];

    if (latestMessage?.kind === "data") {
      return latestMessage.data.status as NodeStatus;
    }

    return "initial";
  }, [data, nodeId, channel, topic]);

  return status;
}
