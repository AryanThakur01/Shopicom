import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { variants } from "./products";
import { relations } from "drizzle-orm";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey().notNull(),

  // ================== customer Details
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),

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
  qty: integer("qty").notNull().default(1),
  isLocked: boolean("is_locked").default(false),
});
export const orderRelations = relations(orders, ({ many, one }) => ({
  // orderedProducts: many(orderedProducts),
  product: one(variants, {
    fields: [orders.productVariantId],
    references: [variants.id],
  }),
}));

export type order = typeof orders.$inferSelect;
export type newOrder = typeof orders.$inferInsert;
