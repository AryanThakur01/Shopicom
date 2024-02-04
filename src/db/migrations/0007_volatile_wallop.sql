ALTER TABLE "variants" ADD COLUMN "stock" integer;--> statement-breakpoint
ALTER TABLE "variants" ADD COLUMN "orders" integer DEFAULT 0;