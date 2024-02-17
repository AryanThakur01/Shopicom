"use client";
import { useSelector } from "@/lib/redux";
import React from "react";
import { LuShoppingCart, LuWallet2 } from "react-icons/lu";

const ActivityButtons = () => {
  const prodVariant = useSelector(
    (state) => state.product.initialProduct.value.variant,
  );
  return (
    <>
      <div className="flex mt-8 text-lg justify-end gap-4">
        <button className="bg-success md:w-40 w-1/2 rounded p-2 flex justify-center items-center gap-2">
          <LuWallet2 />
          <span>Buy Now</span>
        </button>
        <button className="bg-primary md:w-52 w-1/2 rounded p-2 flex justify-center items-center gap-2">
          <LuShoppingCart />
          <span>Add To Cart</span>
        </button>
      </div>
    </>
  );
};

export default ActivityButtons;
