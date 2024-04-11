"use client";
import { useSelector } from "@/lib/redux";
import React from "react";
import { ProductCard } from "../ProductCard";
import { useGetCartQuery } from "@/lib/redux/services/cart";

const CartCheckout = () => {
  const cart = useGetCartQuery().data;
  return (
    <div className="flex flex-col gap-4">
      {cart?.map((item) => (
        <ProductCard
          name={item.item.name}
          description={item.item.description}
          price={item.variant.discountedPrice}
          image={item.variant.images[0].value}
          color={item.variant.color}
          key={item.id}
          qty={1}
        />
      ))}
    </div>
  );
};

export default CartCheckout;
