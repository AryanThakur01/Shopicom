import * as users from "./schema/users";
import * as products from "./schema/products";
import * as dynamicContent from "./schema/dynamicContent";
import * as carts from "./schema/carts";
import * as orders from "./schema/orders";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
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
export const queryClient = postgres(process.env.POSTGRES_URL || "");
export const dbDriver = drizzle(queryClient, { schema });

migrate(dbDriver, { migrationsFolder: "src/db/migrations" });

// for query purposes
export const db = drizzle(queryClient);
