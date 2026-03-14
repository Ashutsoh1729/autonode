/*
Hook to fetch all workflows using suspence
*/

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
  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

/*
 * Hook to get one workflow
 */

export const useSuspenceCredential = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
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

/*
 * Hook to updage workflow name
 */

/* export const useUpdateWorkflowName = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data[0].name} created`);
        // as we are just invalidating the query
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data[0].id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error.message}`);
      },
    }),
  );
}; */

/*
 * Hook to remove workflow
 */

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

/*
 * Hook to execute the workflow
 */

/* export const useExecuteWorkflow = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.execute.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} Executed Successfully`);
      },
      onError: (error) => {
        toast.error(`Failed to execute workflow: ${error.message}`);
      },
    }),
  );
}; */

/*
 * Hook to update editor state
 */

/* export const useUpdateEditorState = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Editor Saved Successfully`);
        // as we are just invalidating the query
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error.message}`);
      },
    }),
  );
}; */
