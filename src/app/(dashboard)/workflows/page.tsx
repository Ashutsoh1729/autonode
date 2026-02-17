import DashboardSections from "@/components/dashboard/dashboard.sections";
import { WorkflowContainer } from "@/features/workflows/components/workflow";
import { auth } from "@/lib/auth";
import { requreAuth } from "@/lib/auth-utils";
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
  await requreAuth();

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
          <ErrorBoundary fallback={<p>Error</p>}>
            <Suspense fallback={<p>Loading...</p>}>
              <DashboardSections userName={session.user.name} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </WorkflowContainer>
    </>
  );
}
