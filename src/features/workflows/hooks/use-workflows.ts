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
import { useWorkflowsParams } from "./use-workflows-params";

export const useSuspenceWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.workflow[0].name} Created `);
        // as we are just invalidating the query
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));

        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.workflow[0].id }),
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

export const useUpdateWorkflowName = () => {
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
};

/*
 * Hook to remove workflow
 */

export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data[0].name} deleted successfully.`);
        // as we are just invalidating the query
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to remove workflow: ${error.message}`);
        console.log(error);
      },
    }),
  );
};

/*
 * Hook to get one workflow
 */

export const useSuspenceWorkflow = (id: number) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};

/*
 * Hook to update editor state
 */
export const useUpdateEditorState = () => {
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
};
