/*
Hook to fetch all workflows using suspence
*/

import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";

export const useSuspenceCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();
  const { data: session } = authClient.useSession();

  return useSuspenseQuery(
    trpc.credentials.getMany.queryOptions(params, { enabled: !!session }),
  );
};

/*
 * Hook to get one workflow
 */

export const useSuspenceCredential = (id: string) => {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();

  return useSuspenseQuery(
    trpc.credentials.getOne.queryOptions({ id }, { enabled: !!session }),
  );
};

export const useCreateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential ${data[0].name} Created `);
        // as we are just invalidating the query
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );

        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data[0].id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to update workflow: ${error.message}`);
      },
    }),
  );
};
export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential ${data[0].name} deleted successfully.`);
        // as we are just invalidating the query
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove workflow: ${error.message}`);
        console.log(error);
      },
    }),
  );
};

// TODO: Write the full code for it
export const useUpdateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(
          `Credential ${data && data[0].name} deleted successfully.`,
        );
        // as we are just invalidating the query
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove workflow: ${error.message}`);
        console.log(error);
      },
    }),
  );
};
