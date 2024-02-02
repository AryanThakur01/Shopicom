CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"password" text,
	"role" text DEFAULT 'customer' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);