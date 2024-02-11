import ProductCatelogueForm from "@/components/dashboard/products/create/ProductCatelogueForm";
import withAuth from "@/components/withAuth";
import { dbDriver } from "@/db";
import { products } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import React from "react";

interface IPage {
  params: {
    id: string;
  };
}
const page: React.FC<IPage> = async ({ params }) => {
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

export default withAuth(page, ["admin", "seller"]);
