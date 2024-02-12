import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Product Table Definition and relations
export const products = pgTable("products", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
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
  categories: many(categories),
}));

// Product-categorization Table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  tag: text("tag", {
    enum: ["sponsored", "best seller"],
  }).notNull(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
});
export const categoriesRelations = relations(categories, ({ one }) => ({
  product: one(products, {
    fields: [categories.productId],
    references: [products.id],
  }),
}));

// Product-Properties Table Definition and relations
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  value: text("value").notNull(),
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
  color: text("color").notNull(),
  price: integer("price").notNull(),
  discountedPrice: integer("discountedPrice").notNull(),
  stock: integer("stock").notNull(),
  orders: integer("orders").notNull(),
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
  value: text("value").notNull(),
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

export type image = typeof images.$inferSelect;
export type newImage = typeof images.$inferInsert;

export type category = typeof categories.$inferSelect;
export type newCategory = typeof categories.$inferInsert;
