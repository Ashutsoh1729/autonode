import { auth } from "@/lib/auth";
import { requireAuth } from "@/lib/auth-utils";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs/server";
import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import {
  ExecutionContainer,
  ExecutionError,
  ExecutionLists,
  ExecutionLoading,
} from "@/features/executions/components/execution-list";

type props = {
  searchParams: Promise<SearchParams>;
};

export default async function ExecutionsPage({ searchParams }: props) {
  await requireAuth();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const params = await executionsParamsLoader(searchParams);

  if (!session) {
    redirect("/sign-in");
  }

  await prefetchExecutions(params);

  return (
    <>
      <ExecutionContainer>
        <HydrateClient>
          <ErrorBoundary fallback={<ExecutionError />}>
            <Suspense fallback={<ExecutionLoading />}>
              <ExecutionLists />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </ExecutionContainer>
    </>
  );
}