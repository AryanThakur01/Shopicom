import { db } from "@/db";
import { products, variants } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import React from "react";
import TestData from "../TestData";
import PaymentForm from "../PaymentForm";
import { ProductCard } from "../ProductCard";

interface IProductCheckout {
  searchParams: {
    cart?: string;
    productId?: string;
    variantId?: string;
    qty?: string;
  };
}
const ProductCheckout: React.FC<IProductCheckout> = async ({
  searchParams,
}) => {
  const product = await db.query.products.findFirst({
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
  const curVariant = product?.variants[0];
  return (
    <>
      <TestData />
      <main className="container grid md:grid-cols-2 gap-12 py-6 transition-all">
        {product && searchParams.qty && (
          <div>
            <PaymentForm
              qty={Number(searchParams.qty)}
              variantId={product.variants[0].id}
            />
          </div>
        )}
        <section>
          <h1 className="text-3xl font-bold my-4">Order Summary</h1>
          {product && curVariant && (
            <ProductCard
              name={product.name}
              color={curVariant.color}
              description={product.description}
              image={curVariant.images[0].value}
              price={curVariant.discountedPrice}
              qty={Number(searchParams.qty)}
            />
          )}
          <div className="my-8 flex flex-col gap-4">
            <div className="px-4 flex justify-between text-muted-foreground text-lg">
              <h2 className="font-light">
                Subtotal ( {searchParams.qty} item )
              </h2>
              <p>
                ₹{" "}
                {curVariant &&
                  (
                    Number(curVariant.price) * Number(searchParams.qty)
                  ).toLocaleString()}
              </p>
            </div>
            <div className="px-4 flex justify-between text-2xl text-success">
              <h2 className="font-light">Discount</h2>
              <p>
                ₹{" "}
                {curVariant &&
                  (
                    (Number(curVariant.price) - curVariant.discountedPrice) *
                    Number(searchParams.qty)
                  ).toLocaleString()}
              </p>
            </div>
            <hr className="border-border" />
            <div className="px-4 flex justify-between text-muted-foreground text-lg">
              <h2 className="font-semibold">
                Order Total ( {searchParams.qty} item )
              </h2>
              <p>
                ₹{" "}
                {curVariant &&
                  (
                    curVariant.discountedPrice * Number(searchParams.qty)
                  ).toLocaleString()}
              </p>
            </div>
            <hr className="border-border" />
          </div>
        </section>
      </main>
    </>
  );
};

export default ProductCheckout;
