import ProductCatelogueForm from "@/components/dashboard/products/create/ProductCatelogueForm";
import { db } from "@/db";
import { images, products, variants } from "@/db/schema/products";
import { jwtDecoder } from "@/utils/api/helpers";
import { productJoinMerger } from "@/utils/products";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import React from "react";

interface IPage {
  params: { id: string };
}
const page: React.FC<IPage> = async ({ params }) => {
  const token = cookies().get("Session_Token")?.value;
  if (!token) redirect("/login");
  const payload = jwtDecoder(token);

  // const dbRes = await db
  //   .select()
  //   .from(products)
  //   .where(and(eq(products.id, params.id), eq(products.sellerId, payload.id)))
  //   .innerJoin(variants, eq(products.id, variants.productId))
  //   .innerJoin(images, eq(variants.id, images.variantId));
  // const product = productJoinMerger(dbRes, payload.id);
  return (
    <div>
      {/* <p>{JSON.stringify(product[0].description)}</p> */}
      <div>{/* <ProductCatelogueForm /> */}</div>
    </div>
  );
};

export default page;
