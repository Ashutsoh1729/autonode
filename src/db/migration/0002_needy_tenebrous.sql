
ALTER TABLE "connections" DROP CONSTRAINT "connections_from_node_id_nodes_id_fk";--> statement-breakpoint
ALTER TABLE "connections" DROP CONSTRAINT "connections_to_node_id_nodes_id_fk";--> statement-breakpoint
ALTER TABLE "connections" DROP CONSTRAINT "nodes_relation";--> statement-breakpoint
ALTER TABLE "nodes" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "nodes" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "connections" RENAME COLUMN "from_input" TO "to_input";--> statement-breakpoint
ALTER TABLE "connections" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "connections" ALTER COLUMN "from_node_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "connections" ALTER COLUMN "to_node_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "nodes_relation" UNIQUE("from_node_id","to_node_id","to_input","from_output");--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_from_node_id_nodes_id_fk" FOREIGN KEY ("from_node_id") REFERENCES "nodes"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_to_node_id_nodes_id_fk" FOREIGN KEY ("to_node_id") REFERENCES "nodes"("id") ON DELETE CASCADE;


