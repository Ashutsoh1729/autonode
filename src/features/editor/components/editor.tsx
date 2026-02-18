"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenceWorkflow } from "@/features/workflows/hooks/use-workflows";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error in loading editor" />;
};

const Editor = ({ workflowId }: { workflowId: number }) => {
  const response = useSuspenceWorkflow(workflowId);
  return <div>{JSON.stringify(response.data)}</div>;
};

export default Editor;
