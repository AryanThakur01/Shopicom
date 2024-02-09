import { dbDriver } from "@/db";
import { getServerSession } from "@/utils/serverActions/session";
import { drizzle } from "drizzle-orm/postgres-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const cookie = cookies().get("Session_Token")?.value;
  if (!cookie) redirect("/");
  const session = await getServerSession(cookie);
  if (session.role === "customer") redirect("/dashboard");

  const product = await dbDriver.query.products.findMany({
    with: {
      // variants: true,
      properties: true,
    },
  });
  return <div>{console.log(product)}</div>;
};

export default page;
