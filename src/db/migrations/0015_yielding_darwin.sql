ALTER TABLE "categories" DROP CONSTRAINT "categories_product_id_tag_pk";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_tag_product_id_unique" UNIQUE("tag","product_id");