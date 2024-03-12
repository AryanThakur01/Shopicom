import { relations } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { products } from "./products";
import { orders } from "./orders";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  // ----- credentials ------
  email: text("email").unique(),
  password: text("password"),
  role: text("role", { enum: ["seller", "customer", "admin"] })
    .notNull()
    .default("customer"),
  // ------------------------

  // ----- google auth ------
  accessToken: text("access_token"),
  expiresIn: text("expires_in"),
  scope: text("scope"),
  tokenType: text("token_type"),
  idToken: text("id_token"),
  // ------------------------

  // ----- personal ---------
  firstName: text("first_name"),
  lastName: text("last_name"),
  profilePic: text("profile_picture"),
  // ------------------------
});
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  orders: many(orders),
}));

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
