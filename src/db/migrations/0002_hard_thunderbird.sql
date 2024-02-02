CREATE TABLE IF NOT EXISTS "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text,
	"value" text,
	"product_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"color" text,
	"price" integer,
	"discountedPrice" integer,
	"product_id" integer
);
