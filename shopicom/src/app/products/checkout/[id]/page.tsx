import { db, dbDriver } from "@/db";
import { products, variants } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import React from "react";

interface ICheckout {
  params: { id: string };
  searchParams: {
    variantId?: string;
    isCart?: string;
  };
}
const page: React.FC<ICheckout> = async ({ params, searchParams }) => {
  if (!searchParams.isCart) {
    if (!searchParams.variantId)
      return <section>Please pass in the variantId</section>;

    const product = await dbDriver.query.products.findFirst({
      where: eq(products.id, Number(params.id)),
      with: {
        variants: {
          where: eq(variants.id, Number(searchParams.variantId)),
          with: {
            images: true,
          },
        },
      },
    });

    return <section className="container"></section>;
  } else {
    return <section className="container">User Ordered Cart</section>;
  }
};

export default page;
