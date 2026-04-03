import { integer, jsonb, pgEnum, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
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

export const executionsRelations = relations(executions, ({ one }) => ({
  workflow: one(workflows, {
    fields: [executions.workflowId],
    references: [workflows.id],
  }),
}));

export type ExecutionStatusEnum = (typeof executionStatus.enumValues)[number];
export type TriggerTypeEnum = (typeof triggerType.enumValues)[number];
export type ExecutionType = typeof executions.$inferSelect;