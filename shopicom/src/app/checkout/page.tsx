import PaymentForm from "@/components/checkout/PaymentForm";
import { db, dbDriver } from "@/db";
import { products, variants } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import React from "react";

interface ICheckout {
  searchParams: {
    cart?: string;
    productId?: string;
    variantId?: string;
    qty?: string;
  };
}
const page: React.FC<ICheckout> = async ({ searchParams }) => {
  if (searchParams.cart) {
  }
  if (!searchParams.cart) {
    if (
      !searchParams.productId ||
      !searchParams.qty ||
      !searchParams.variantId
    ) {
      return (
        <section className="container mx-auto flex items-center justify-center min-h-[70vh]">
          Internal Server Error (productId, qty and variantId are required)
        </section>
      );
    }

    const product = await dbDriver.query.products.findFirst({
      where: eq(products.id, Number(searchParams.productId)),
      with: {
        variants: {
          where: eq(variants.id, Number(searchParams.variantId)),
          with: {
            images: true,
          },
        },
      },
    });
    return (
      <section className="container grid grid-cols-2">
        <PaymentForm />
        <div>Order Summary</div>
      </section>
    );
  }
};

export default page;
