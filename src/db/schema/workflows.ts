import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  // createdAt: timestamp("created_at").notNull(),
  // updatedAt: timestamp("updated_at").notNull(),
});
