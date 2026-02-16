"use client";
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useCreateWorkflow } from "@/hooks/use-workflows";

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
    <EntityContainer header={<WorkflowHeader />}>{children}</EntityContainer>
  );
};
