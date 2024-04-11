import CartItems from "@/components/cart/CartItems";
import withAuth from "@/components/withAuth";
import React from "react";

const page = async () => {
  return (
    <section className="container">
      <h1 className="my-8 text-3xl">My Cart</h1>
      <CartItems />
    </section>
  );
};

export default withAuth(page, ["seller", "admin", "customer"]);
