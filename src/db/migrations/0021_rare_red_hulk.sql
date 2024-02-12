ALTER TABLE "categories" DROP CONSTRAINT "categories_tag_unique";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_product_id_unique";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_product_id_tag_unique";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_product_id_tag_unique" UNIQUE("product_id","tag");