import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { users } from "./users";

// Product Table Definition and relations
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  sellerId: integer("seller_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});
export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  properties: many(properties),
  variants: many(variants),
}));

// Product-Properties Table Definition and relations
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  key: text("key"),
  value: text("value"),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
});
export const propertiesRelations = relations(properties, ({ one }) => ({
  product: one(products, {
    fields: [properties.productId],
    references: [products.id],
  }),
}));

// Product-Variants Table Definition and relations
export const variants = pgTable("variants", {
  id: serial("id").primaryKey(),
  color: text("color"),
  price: integer("price"),
  discountedPrice: integer("discountedPrice"),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
});
export const variantRelations = relations(variants, ({ one, many }) => ({
  images: many(images),
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
}));

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  value: text("value"),
  variantId: integer("variant_id")
    .references(() => variants.id, { onDelete: "cascade" })
    .notNull(),
});
export const imagesRelations = relations(images, ({ one }) => ({
  variant: one(variants, {
    fields: [images.variantId],
    references: [variants.id],
  }),
}));

export type product = typeof products.$inferSelect;
export type newProduct = typeof products.$inferInsert;
export type property = typeof properties.$inferSelect;
export type newProperty = typeof properties.$inferInsert;
export type variant = typeof variants.$inferSelect;
export type newVariant = typeof variants.$inferInsert;
export type image = typeof images.$inferInsert;
export type newImage = typeof images.$inferSelect;
