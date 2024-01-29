import * as user from "./schema/users";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// for migrations
const migrationClient = postgres(process.env.POSTGRES_URL || "", { max: 1 });
const dbDriver = drizzle(migrationClient);
migrate(dbDriver, { migrationsFolder: "src/db/migrations" });

// for query purposes
const queryClient = postgres(process.env.POSTGRES_URL || "");
export const db = drizzle(queryClient);
