import { boolean, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { products, variants } from "./products";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  isSeen: boolean("isSeen").notNull().default(false),
  itemId: integer("itemId")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  userId: integer("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  variantId: integer("variantId")
    .references(() => variants.id, { onDelete: "cascade" })
    .notNull(),
});

export const cartsRelations = relations(carts, ({ one }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  item: one(products, {
    fields: [carts.itemId],
    references: [products.id],
  }),
  variant: one(variants, {
    fields: [carts.variantId],
    references: [variants.id],
  }),
}));

export type cart = typeof carts.$inferSelect;
export type newCart = typeof carts.$inferInsert;
