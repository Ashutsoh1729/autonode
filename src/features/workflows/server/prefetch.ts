import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "../../../trpc/server";

type Input = inferInput<typeof trpc.workflows.getMany>;

// Prefetching the workflows lists from the server side
export const prefetchWorkflows = (params: Input) => {
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};

// now we will prefetch the indivisual workflows
export const prefetchSingleWorkflow = (id: number) => {
  return prefetch(trpc.workflows.getOne.queryOptions({ id }));
};
