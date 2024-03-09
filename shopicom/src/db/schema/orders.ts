import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { products } from "./products";
import { relations } from "drizzle-orm";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey().notNull(),

  // ================== customer Details
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),

  // =================== payment Related
  paymentIntentId: text("payment_intent").unique(),
  paymentStatus: text("payment_status", {
    enum: [
      "requires_payment_method",
      "requires_confirmation",
      "requires_action",
      "processing",
      "requires_capture",
      "canceled",
      "succeeded",
    ],
  }).notNull(),
  paymentAmount: text("payment_amount").notNull(),
});
export const orderRelations = relations(orders, ({ one, many }) => ({
  orderedProducts: many(orderedProducts),
}));

export const orderedProducts = pgTable("ordered_products", {
  id: serial("id").unique().primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
});
export const orderedProductsRelations = relations(
  orderedProducts,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderedProducts.orderId],
      references: [orders.id],
    }),
    product: one(products, {
      fields: [orderedProducts.productId],
      references: [products.id],
    }),
  }),
);

export type order = typeof orders.$inferSelect;
export type newOrder = typeof orders.$inferInsert;

export type orderedProduct = typeof orderedProducts.$inferSelect;
export type newOrderedProduct = typeof orderedProducts.$inferInsert;
