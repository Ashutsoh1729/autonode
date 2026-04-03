import { integer, jsonb, pgEnum, pgTable, serial, timestamp, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { workflows } from "./workflows";

export const executionStatus = pgEnum("execution_status", [
  "PENDING",
  "RUNNING",
  "SUCCESS",
  "FAILED",
]);

export const triggerType = pgEnum("trigger_type", [
  "MANUAL",
  "CRON",
  "WEBHOOK",
]);

export const nodeExecutionStatus = pgEnum("node_execution_status", [
  "PENDING",
  "RUNNING",
  "SUCCESS",
  "FAILED",
  "SKIPPED",
]);

export const executions = pgTable("executions", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id")
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  status: executionStatus("status").notNull().default("PENDING"),
  triggeredAt: timestamp("triggered_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  triggerType: triggerType("trigger_type").notNull().default("MANUAL"),
  input: jsonb("input").default({}),
  output: jsonb("output").default({}),
});

export const executionNodes = pgTable("execution_nodes", {
  id: serial("id").primaryKey(),
  executionId: integer("execution_id")
    .notNull()
    .references(() => executions.id, { onDelete: "cascade" }),
  nodeId: text("node_id").notNull(),
  status: nodeExecutionStatus("status").notNull().default("PENDING"),
  input: jsonb("input").default({}),
  output: jsonb("output").default({}),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  error: text("error"),
});

export const executionsRelations = relations(executions, ({ one, many }) => ({
  workflow: one(workflows, {
    fields: [executions.workflowId],
    references: [workflows.id],
  }),
  nodes: many(executionNodes),
}));

export const executionNodesRelations = relations(executionNodes, ({ one }) => ({
  execution: one(executions, {
    fields: [executionNodes.executionId],
    references: [executions.id],
  }),
}));

export type ExecutionStatusEnum = (typeof executionStatus.enumValues)[number];
export type TriggerTypeEnum = (typeof triggerType.enumValues)[number];
export type NodeExecutionStatusEnum = (typeof nodeExecutionStatus.enumValues)[number];
export type ExecutionType = typeof executions.$inferSelect;
export type ExecutionNodeType = typeof executionNodes.$inferSelect;