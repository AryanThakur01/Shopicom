ALTER TABLE "images" ALTER COLUMN "value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "key" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "color" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "discountedPrice" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "stock" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "orders" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "orders" SET NOT NULL;