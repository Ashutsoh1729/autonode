import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import * as relations from "./relations";
import { config } from "@/lib/config";

const pg = new Pool({ connectionString: config.neonDatabaseUrl });
export const db = drizzle({ client: pg, schema: { ...schema, ...relations } });
