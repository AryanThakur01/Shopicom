import ProductCatelogueForm from "@/components/dashboard/products/create/ProductCatelogueForm";
import { dbDriver } from "@/db";
import { products } from "@/db/schema/products";
import { getServerSession } from "@/utils/serverActions/session";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

interface IPage {
  params: {
    id: string;
  };
}
const page: React.FC<IPage> = async ({ params }) => {
  const cookie = cookies().get("Session_Token")?.value;
  if (!cookie) redirect("/");
  const session = await getServerSession(cookie);
  if (session.role === "customer" || !params.id) redirect("/dashboard");

  const product = await dbDriver.query.products.findMany({
    with: {
      variants: {
        with: { images: true },
      },
      properties: true,
    },
    where: eq(products.id, Number(params.id)),
  });
  return (
    <>
      <ProductCatelogueForm product={{ ...product[0] }} id={params.id} />
    </>
  );
};

export default page;
