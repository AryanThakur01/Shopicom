import * as users from "./schema/users";
import * as products from "./schema/products";
import * as dynamicContent from "./schema/dynamicContent";
import * as carts from "./schema/carts";
import * as orders from "./schema/orders";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const schema = {
  ...users,
  ...products,
  ...dynamicContent,
  ...carts,
  ...orders,
};

// for migrations
const migrationClient = postgres(process.env.POSTGRES_URL || "");
migrate(drizzle(migrationClient, { schema }), {
  migrationsFolder: "src/db/migrations",
});

// for query purposes
export const dbDriver = drizzle(migrationClient, { schema });
export const db = drizzle(migrationClient, { schema });
