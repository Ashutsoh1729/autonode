import Editor, {
  EditorError,
  EditorLoading,
} from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { prefetchSingleWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

const WorkflowIndivisualPage = async ({ params }: PageProps) => {
  await requireAuth();
  const { workflowId } = await params;

  await prefetchSingleWorkflow(Number(workflowId));

  return (
    <>
      <HydrateClient>
        <ErrorBoundary fallback={<EditorError />}>
          <Suspense fallback={<EditorLoading />}>
            <EditorHeader workflowId={Number(workflowId)} />
            <Editor workflowId={Number(workflowId)} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </>
  );
};

export default WorkflowIndivisualPage;
