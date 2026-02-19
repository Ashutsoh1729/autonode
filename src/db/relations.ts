import { relations } from "drizzle-orm";
import { connections, nodes, workflows } from "./schema";

export const workflowsRelations = relations(workflows, ({ many }) => ({
    nodes: many(nodes),
    connections: many(connections),
}));

export const nodesRelations = relations(nodes, ({ one }) => ({
    workflow: one(workflows, {
        fields: [nodes.workflowId],
        references: [workflows.id],
    }),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
    workflow: one(workflows, {
        fields: [connections.workflowId],
        references: [workflows.id],
    }),
}));
