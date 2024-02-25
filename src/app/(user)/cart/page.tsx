"use client";
import CartItems from "@/components/cart/CartItems";
import React from "react";

const page = () => {
  return (
    <section className="container">
      <h1 className="my-8 text-3xl">My Cart</h1>
      <CartItems />
    </section>
  );
};

export default page;
