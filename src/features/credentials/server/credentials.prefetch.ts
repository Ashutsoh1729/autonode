import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "../../../trpc/server";

type Input = inferInput<typeof trpc.credentials.getMany>;

// Prefetching the credentials lists from the server side
export const prefetchCredentials = (params: Input) => {
  return prefetch(trpc.credentials.getMany.queryOptions(params));
};

// now we will prefetch the indivisual credentials
export const prefetchSingleCredential = (id: string) => {
  return prefetch(trpc.credentials.getOne.queryOptions({ id }));
};
