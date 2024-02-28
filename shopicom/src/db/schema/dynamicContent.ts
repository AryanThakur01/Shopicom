import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const contents = pgTable("content", {
  id: serial("id").primaryKey(),

  // ----- tag for filtration ------
  tag: text("tag").notNull(),
  // -------------------------------

  // ----- google auth ------
  image: text("image"),
  title: text("title"),
  content: text("content"),
  link: text("link"),
  // ------------------------
});

export type Content = typeof contents.$inferSelect; // return type when queried
export type NewContent = typeof contents.$inferInsert; // insert type
