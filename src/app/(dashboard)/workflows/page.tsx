import DashboardSections from "@/components/dashboard/dashboard.sections";
import { WorkflowContainer } from "@/features/workflows/components/workflow";
import { auth } from "@/lib/auth";
import { requreAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/trpc/prefetch";
import { HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function WorkflowPage() {
  await requreAuth();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  prefetchWorkflows();

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
