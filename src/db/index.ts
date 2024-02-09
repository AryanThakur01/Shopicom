import * as users from "./schema/users";
import * as products from "./schema/products";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// for migrations
const migrationClient = postgres(process.env.POSTGRES_URL || "", { max: 1 });
export const dbDriver = drizzle(migrationClient, {
  schema: { ...users, ...products },
});
migrate(dbDriver, { migrationsFolder: "src/db/migrations" });

// for query purposes
export const queryClient = postgres(process.env.POSTGRES_URL || "");
export const db = drizzle(queryClient);
