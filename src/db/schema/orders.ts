import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { variants } from "./products";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey().notNull(),

  // ================== customer Details
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  customerId: integer("customer_id").references(() => users.id, {
    onDelete: "cascade",
  }),

  // =================== payment Related
  paymentIntentId: text("payment_intent"),
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
  paymentAmount: integer("payment_amount").notNull(),

  // =================== order Details
  productVariantId: integer("product_variant_id")
    .references(() => variants.id, { onDelete: "cascade" })
    .notNull(),
  sellerId: integer("seller_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  qty: integer("qty").notNull().default(1),
  isLocked: boolean("is_locked").default(false),
  deliveryStatus: text("delivery_status", {
    enum: ["ordered", "dispatched", "received"],
  }).default("ordered"),
});
export const orderRelations = relations(orders, ({ many, one }) => ({
  // orderedProducts: many(orderedProducts),
  product: one(variants, {
    fields: [orders.productVariantId],
    references: [variants.id],
  }),
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
    relationName: "customer_rel",
  }),
  seller: one(users, {
    fields: [orders.sellerId],
    references: [users.id],
    relationName: "seller_rel",
  }),
}));

export type order = typeof orders.$inferSelect;
export type newOrder = typeof orders.$inferInsert;
