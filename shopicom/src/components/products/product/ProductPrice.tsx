"use client";
import { useSelector } from "@/lib/redux";
import React from "react";

const ProductPrice = () => {
  const variantDetails = useSelector(
    (state) => state.product.initialProduct.value.variant,
  );
  return (
    <>
      <div className="bg-success w-20 text-center rounded-full p-1 my-2">
        {(
          ((variantDetails.price - variantDetails.discountedPrice) /
            variantDetails.price) *
          100
        ).toFixed(1)}
        %
      </div>
      <div className="flex gap-2 items-end">
        <p className="line-through text-muted-foreground text-sm">
          ₹{variantDetails.price.toLocaleString()}
        </p>
        <p className="text-success text-3xl">
          ₹{variantDetails.discountedPrice.toLocaleString()}
        </p>
      </div>
    </>
  );
};

export default ProductPrice;
