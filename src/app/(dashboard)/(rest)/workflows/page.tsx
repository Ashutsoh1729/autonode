import {
  WorkflowContainer,
  WorkflowError,
  WorkflowLists,
  WorkflowLoading,
} from "@/features/workflows/components/workflow";
import { auth } from "@/lib/auth";
import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs/server";
import { workflowParamsLoader } from "@/features/workflows/server/params-loader";

type props = {
  searchParams: Promise<SearchParams>;
};

export default async function WorkflowPage({ searchParams }: props) {
  await requireAuth();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const params = await workflowParamsLoader(searchParams);

  if (!session) {
    redirect("/sign-in");
  }

  await prefetchWorkflows(params);

  // void queryClient.prefetchQuery();

  return (
    <>
      <WorkflowContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<WorkflowError />}>
            <Suspense fallback={<WorkflowLoading />}>
              {/* <DashboardSections userName={session.user.name} /> */}
              <WorkflowLists />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </WorkflowContainer>
    </>
  );
}
