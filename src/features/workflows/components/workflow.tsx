"use client";
import {
  EntityContainer,
  EntityHeader,
  EntitySearch,
} from "@/components/entity-components";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useCreateWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

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

export const WorkflowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer header={<WorkflowHeader />} search={<WorkflowSearch />}>
      {children}
    </EntityContainer>
  );
};
