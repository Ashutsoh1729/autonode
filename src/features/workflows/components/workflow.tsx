"use client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { formatDistanceToNow } from "date-fns";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenceWorkflows,
} from "@/features/workflows/hooks/use-workflows";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { workflows } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { WorkflowIcon } from "lucide-react";

export const WorkflowSearch = () => {
  const [params, setParams] = useWorkflowsParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params: params,
    setParam: setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Workflows"
    />
  );
};

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow();

  const { modal, handleError } = useUpgradeModal();

  const handleOnNew = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        // TODO: redirect to the workflow id
      },
      onError: (err) => {
        handleError(err);
      },
    });
  };
  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="create and manage your workflows"
        onNew={handleOnNew}
        newButtonLable="New Workflow"
        disabled={disabled}
        isCreating={false}
      />
    </>
  );
};

export const WorkflowPagination = () => {
  const workflows = useSuspenceWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

type WorkflowItemType = InferSelectModel<typeof workflows>;

export const WorkflowListItem = ({ item }: { item: WorkflowItemType }) => {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemove = async () => {
    removeWorkflow.mutate({ id: item.id });
  };

  return (
    <EntityItem
      title={item.name}
      href={`/workflows/${item.id}`}
      subtitle={
        <>
          Updated {formatDistanceToNow(item.updatedAt, { addSuffix: true })}{" "}
          &bull; Created
          {formatDistanceToNow(item.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="flex items-center justify-center size-8">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  );
};

export const WorkflowLists = () => {
  const workflows = useSuspenceWorkflows();

  return (
    <EntityList
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => {
        return <WorkflowListItem item={workflow} />;
      }}
      emptyView={<WorkflowEmpty />}
    />
  );
};

export const WorkflowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowHeader />}
      search={<WorkflowSearch />}
      pagination={<WorkflowPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const WorkflowLoading = () => {
  return <LoadingView message="Workflow is loading..." />;
};

export const WorkflowError = () => {
  return <ErrorView message="Workflow is loading..." />;
};

export const WorkflowEmpty = () => {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  function handleCreate() {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        toast.success(`Workflow ${data.workflow[0].id} is created`);
        router.push(`/workflows/${data.workflow[0].id}`);
      },

      onError: (error) => {
        handleError(error);
      },
    });
  }

  return (
    <>
      {modal}
      <EmptyView
        onNew={handleCreate}
        message="You haven't created any workflows yet. Get started by creating your workflow"
      />
    </>
  );
};
