import PaymentForm from "@/components/checkout/PaymentForm";
import { dbDriver } from "@/db";
import { products, variants } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import Image from "next/image";
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
      <main className="container grid grid-cols-2 gap-12 py-12">
        {product && searchParams.qty && (
          <PaymentForm
            qty={Number(searchParams.qty)}
            variantId={product.variants[0].id}
          />
        )}
        <section>
          <h2 className="text-3xl font-bold my-4">Order Summary</h2>
          <div>
            <div className="h-32 w-32 rounded-xl overflow-hidden">
              <Image
                src={product?.variants[0].images[0].value || ""}
                alt={product?.name || ""}
                width={500}
                height={500}
                className="h-full w-full"
              />
            </div>
          </div>
        </section>
      </main>
    );
  }
};

export default page;
