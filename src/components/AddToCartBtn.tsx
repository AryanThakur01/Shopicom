"use client";
import React from "react";
import { twMerge } from "tailwind-merge";

interface IAddToCartBtn {
  productId: number;
  className?: string;
}
const AddToCartBtn: React.FC<IAddToCartBtn> = ({ productId, className }) => {
  const addToCart = () => {
    console.log("Add To Cart");
  };
  return (
    <button
      className={twMerge(
        "bg-primary p-2 md:px-6 px-4 rounded text-foreground min-w-[50%] md:text-xl text-xl font-bold",
        className,
      )}
      onClick={addToCart}
    >
      Add to cart
    </button>
  );
};

export default AddToCartBtn;
