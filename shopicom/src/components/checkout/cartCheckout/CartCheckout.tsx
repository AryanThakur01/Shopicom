"use client";
import CartItems from "@/components/cart/CartItems";
import { useSelector } from "@/lib/redux";
import React from "react";
import { ProductCard } from "../ProductCard";

const CartCheckout = () => {
  const cart = useSelector((state) => state.cart.value);
  return (
    <div className="flex flex-col gap-4">
      {cart.map((item) => (
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
