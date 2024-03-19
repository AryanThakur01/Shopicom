import ProductCatelogueForm from "@/components/dashboard/products/create/ProductCatelogueForm";
import withAuth from "@/components/withAuth";
import { db } from "@/db";
import { products } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import React from "react";

interface IPage {
  params: {
    id: string;
  };
}
const page: React.FC<IPage> = async ({ params }) => {
  const product = await db.query.products.findMany({
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
      <h1 className="text-3xl font-bold">Update The Product Details</h1>
      <ProductCatelogueForm product={{ ...product[0] }} id={params.id} />
    </>
  );
};

export default withAuth(page, ["admin", "seller"]);
