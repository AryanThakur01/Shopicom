ALTER TABLE "categories" DROP CONSTRAINT "categories_product_id_tag_unique";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_tag_unique" UNIQUE("tag");