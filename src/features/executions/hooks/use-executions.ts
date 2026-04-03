import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();

  return useSuspenseQuery(
    trpc.executions.getAll.queryOptions({}, { enabled: !!session }),
  );
};

export const useSuspenseExecution = (id: number) => {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();

  return useSuspenseQuery(
    trpc.executions.getById.queryOptions({ id }, { enabled: !!session }),
  );
};