import { drizzle } from "drizzle-orm/node-postgres";
// biome-ignore lint/performance/noNamespaceImport: Drizzle requires the entire schema object
import * as schema from "./schemas/auth";

export const db = drizzle(process.env.DATABASE_URL || "", { schema });
