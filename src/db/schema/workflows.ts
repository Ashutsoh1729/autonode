import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// relations for query
//

export const credentialType = pgEnum("credentials_type", [
  "OPENAI",
  "ANTHROPIC",
  "GEMINI",
  "RESEND",
  "OPENROUTER",
  "SMTP",
]);

// credentials
export const credentials = pgTable("credentials", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  value: text("value").notNull(),
  provider: credentialType("provider").default("GEMINI"),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// node tables

export const nodeType = pgEnum("node_types", [
  "INITIAL",
  "MANUAL_TRIGGER",
  "CRON_TRIGGER",
  "HTTP_REQUEST",
  "AI",
  "EMAIL",
]);

export const nodes = pgTable("nodes", {
  id: text("id").primaryKey(),
  workflowId: integer("workflow_id")
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  credentialsId: text("credential_id").references(() => credentials.id),

  name: text("name"),
  type: nodeType("type").notNull().default("INITIAL"),
  position: jsonb("position"),
  data: jsonb("data").default({}),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const connections = pgTable(
  "connections",
  {
    id: serial("id").primaryKey(),
    workflowId: integer("workflow_id")
      .notNull()
      .references(() => workflows.id, { onDelete: "cascade" }),

    name: text("name"),

    fromNodeId: text("from_node_id")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade" }),

    toNodeId: text("to_node_id")
      .notNull()
      .references(() => nodes.id, { onDelete: "cascade" }),

    // we will check whether they will get useful or not
    fromOutput: text("from_output").default("main"),
    toInput: text("to_input").default("main"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    unique("nodes_relation").on(
      t.fromNodeId,
      t.toNodeId,
      t.toInput,
      t.fromOutput,
    ),
  ],
);

export type CredentialsEnumType = (typeof credentialType.enumValues)[number];
export type NodeEnumType = (typeof nodeType.enumValues)[number];

export type NodeType = typeof nodes.$inferSelect;
export type ConnectionType = typeof connections.$inferSelect;
export type WorkflowType = typeof workflows.$inferSelect;
