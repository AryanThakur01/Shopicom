import PaymentForm from "@/components/checkout/PaymentForm";
import CartCheckout from "@/components/checkout/cartCheckout/CartCheckout";
import ProductCheckout from "@/components/checkout/productCheckout/ProductCheckout";
import { getServerSession } from "@/utils/serverActions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import TestData from "@/components/checkout/TestData";

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
    const cookie = cookies().get("Session_Token")?.value;
    if (!cookie) redirect("/");
    const session = await getServerSession(cookie);
    if (!["seller", "customer", "admin"].includes(session.role))
      redirect("/dashboard");
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
    return <ProductCheckout searchParams={searchParams} />;
  } else {
    redirect("/");
  }
};

export default page;
