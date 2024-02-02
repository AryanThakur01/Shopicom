import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { products } from "./products";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  password: text("password"),
  role: text("role", { enum: ["seller", "customer", "admin"] })
    .notNull()
    .default("customer"),
});
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
}));

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
