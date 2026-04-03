import { auth } from "@/lib/auth";
import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/db";
import { executions, executionNodes } from "@/db/schema";
import { HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { and, eq } from "drizzle-orm";
import { ExecutionDetailView } from "@/features/executions/components/execution-detail";

type Props = {
  params: Promise<{ executionId: string }>;
};

export default async function ExecutionDetailPage({ params }: Props) {
  await requireAuth();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { executionId } = await params;
  const id = parseInt(executionId, 10);

  if (isNaN(id)) {
    redirect("/executions");
  }

  const execution = await db.query.executions.findFirst({
    where: and(
      eq(executions.id, id),
    ),
    with: {
      workflow: true,
      nodes: {
        orderBy: [executionNodes.id],
      },
    },
  });

  if (!execution || execution.workflow.userId !== session.user.id) {
    redirect("/executions");
  }

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={<div className="p-4">Failed to load execution details</div>}
      >
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <ExecutionDetailView execution={execution} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
