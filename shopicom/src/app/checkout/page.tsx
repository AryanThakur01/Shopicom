import CartItems from "@/components/cart/CartItems";
import PaymentForm from "@/components/checkout/PaymentForm";
import { ProductCard } from "@/components/checkout/ProductCard";
import CartCheckout from "@/components/checkout/cartCheckout/CartCheckout";
import withAuth from "@/components/withAuth";
import { dbDriver } from "@/db";
import { products, variants } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { redirect } from "next/navigation";
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
    return (
      <>
        <TestData />
        <main className="container grid md:grid-cols-2 gap-12 py-6 transition-all">
          {searchParams.cart && (
            <div>
              <PaymentForm cart />
            </div>
          )}
          <section>
            <h1 className="text-3xl font-bold my-4">Order Summary</h1>
            <CartCheckout />
          </section>
        </main>
      </>
    );
  }
  if (!searchParams.cart) {
    if (!searchParams.qty || !searchParams.variantId) {
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
            {product && (
              <ProductCard
                name={product.name}
                color={product.variants[0].color}
                description={product.description}
                image={product.variants[0].images[0].value}
                price={product.variants[0].discountedPrice}
                qty={Number(searchParams.qty)}
              />
            )}
          </section>
        </main>
      </>
    );
  } else {
    redirect("/");
  }
};

const TestData = () => (
  <div className="bg-card py-4 text-center">
    <h2 className="text-muted-foreground font-bold text-xl">Test Data</h2>
    <p>
      <b>India:</b> <i>4000 0035 6000 0008</i>
    </p>
    <p className="flex gap-12 justify-center">
      <span>
        <b>Exp:</b> <i>12/44</i>
      </span>
      <span>
        <b>CVV:</b> <i>444</i>
      </span>
    </p>
  </div>
);

export default withAuth(page, ["admin", "seller", "customer"]);
