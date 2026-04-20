import { credentialsRouter } from "@/features/credentials/server/credentials.router";
import { createTRPCRouter } from "../init";
import { workflowsRouter } from "@/features/workflows/server/routers";
import { executionsRouter } from "@/features/executions/server/executions.router";
import { workflowGeneratorRouter } from "@/features/workflow-generator/server/workflow-generator.router";
export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionsRouter,
  workflowGenerator: workflowGeneratorRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
