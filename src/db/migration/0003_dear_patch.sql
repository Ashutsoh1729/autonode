CREATE TYPE "public"."execution_status" AS ENUM('PENDING', 'RUNNING', 'SUCCESS', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."trigger_type" AS ENUM('MANUAL', 'CRON', 'WEBHOOK');--> statement-breakpoint
CREATE TABLE "executions" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" integer NOT NULL,
	"status" "execution_status" DEFAULT 'PENDING' NOT NULL,
	"triggered_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"trigger_type" "trigger_type" DEFAULT 'MANUAL' NOT NULL,
	"input" jsonb DEFAULT '{}'::jsonb,
	"output" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
ALTER TABLE "executions" ADD CONSTRAINT "executions_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE cascade ON UPDATE no action;