import {
  WorkflowError,
  WorkflowLoading,
} from "@/features/workflows/components/workflow";
import { auth } from "@/lib/auth";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs/server";
import {
  CredentialsContainer,
  CredentialsLists,
} from "@/features/credentials/component/credentials.component";
import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredentials } from "@/features/credentials/server/credentials.prefetch";

type props = {
  searchParams: Promise<SearchParams>;
};

export default async function CredentialsPage({ searchParams }: props) {
  await requireAuth();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const params = await credentialsParamsLoader(searchParams);

  if (!session) {
    redirect("/sign-in");
  }

  // FIX: Error In this page, resolve it
  await prefetchCredentials(params);

  // void queryClient.prefetchQuery();

  // NOTE: Two main components here are:
  // 1. WorkflowContainer
  // 2. WorkflowLists

  return (
    <>
      <CredentialsContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<WorkflowError />}>
            <Suspense fallback={<WorkflowLoading />}>
              {/* <DashboardSections userName={session.user.name} /> */}
              <CredentialsLists />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </CredentialsContainer>
    </>
  );
}
