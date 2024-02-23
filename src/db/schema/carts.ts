import { boolean, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { products } from "./products";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  itemId: integer("itemId")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  isSeen: boolean("isSeen").notNull().default(false),
  userId: integer("productId")
    .references(() => users.id, {
      onDelete: "cascade",
    })
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
}));

export type cart = typeof carts.$inferSelect;
export type newCart = typeof carts.$inferInsert;
