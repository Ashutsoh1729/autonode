import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "../../../trpc/server";

type Input = inferInput<typeof trpc.executions.getAll>;

export const prefetchExecutions = (params: Input) => {
  return prefetch(trpc.executions.getAll.queryOptions(params));
};