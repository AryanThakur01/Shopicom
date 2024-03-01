CREATE TABLE IF NOT EXISTS "privileges"(
   "id" serial PRIMARY KEY NOT NULL,
   "cur_privilege" text NOT NULL,
   "req_privilege" text NOT NULL,
   "doc_status" text NOT NULL
);
