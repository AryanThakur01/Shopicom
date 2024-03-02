"use client";
import AddToCartBtn from "@/components/AddToCartBtn";
import { useSelector } from "@/lib/redux";
import Link from "next/link";
import React, { useState } from "react";
import { LuMinus, LuPlus, LuWallet2 } from "react-icons/lu";

interface IActivityButtons {
  productId: string;
}
const ActivityButtons: React.FC<IActivityButtons> = ({ productId }) => {
  const [qty, setQty] = useState("1");
  const product = useSelector((state) => state.product.initialProduct.value);
  const prodVariant = useSelector(
    (state) => state.product.initialProduct.value.variant,
  );
  const handlePurchase = () => {};
  return (
    <>
      <div>
        <div className="flex my-8 text-lg justify-end gap-4">
          <div className="w-1/2 border border-muted flex justify-evenly">
            <button
              onClick={() => {
                const quantity = Number(qty);
                if (quantity > 1 && quantity < prodVariant.stock)
                  setQty((quantity - 1).toString());
              }}
            >
              <LuMinus />
            </button>
            <input
              className="h-full w-20 rounded text-center bg-background outline-none"
              type="number"
              placeholder="0"
              value={qty}
              onChange={(e) => {
                let val = e.target.value;
                console.log(val);
                if (!val) setQty("0");
                if (val >= "0" && val <= "9") setQty(val);
              }}
            />
            <button
              onClick={() => {
                const quantity = Number(qty);
                if (quantity < prodVariant.stock)
                  setQty((quantity + 1).toString());
              }}
            >
              <LuPlus />
            </button>
          </div>
          <AddToCartBtn
            productId={Number(productId)}
            variantId={product.variant.id}
            className="w-1/2"
          />
        </div>
        <Link
          className="bg-success w-full rounded p-2 flex justify-center items-center gap-2"
          href={`/checkout/?productId=${productId}&variantId=${product.variant.id}&qty=${qty}`}
        >
          <LuWallet2 />
          <span>Buy Now</span>
        </Link>
      </div>
    </>
  );
};

export default ActivityButtons;
