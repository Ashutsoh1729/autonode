import { IndivisualCredentialPageContainter } from "@/features/credentials/component/credentials.component";
import { prefetchSingleCredential } from "@/features/credentials/server/credentials.prefetch";
import {
  EditorError,
  EditorLoading,
} from "@/features/editor/components/editor";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const IndivisualCredentialPage = async ({ params }: PageProps) => {
  const { credentialId } = await params;
  await prefetchSingleCredential(credentialId);
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <IndivisualCredentialPageContainter id={credentialId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default IndivisualCredentialPage;
