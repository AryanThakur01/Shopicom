"use client";
import { useSelector } from "@/lib/redux";
import { ICart } from "@/types/cart";
import Link from "next/link";
import React, { useState } from "react";
import { LuCheck, LuMinus, LuPlus, LuTrash } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

const CartItems = () => {
  const [selectAll, setSelectAll] = useState(false);
  const cart = useSelector((state) => state.cart.value);
  const status = useSelector((state) => state.cart.status);
  return (
    <div>
      <div className="border border-muted-foreground flex justify-between p-4 rounded container">
        <button
          className="my-auto flex gap-4"
          onClick={() => setSelectAll(!selectAll)}
        >
          <div
            className={twMerge(
              "border border-muted-foreground w-4 h-4 my-auto rounded-[2px]",
            )}
          >
            <LuCheck
              className={twMerge(
                "relative bottom-2 size-6 m-auto stroke-2 rounded-[2px] animate-open-pop",
                !selectAll && "hidden",
              )}
            />
          </div>
          <p>Select All</p>
        </button>
        <button className="bg-foreground text-background p-2 rounded-full px-6">
          Delete
        </button>
      </div>
      {cart?.map((item) => (
        <>
          <Product item={item} />
        </>
      ))}
    </div>
  );
};

interface IProduct {
  item: ICart;
}
const Product: React.FC<IProduct> = ({ item }) => {
  const [qty, setQty] = useState(1);
  const name = item.item.name;
  return (
    <div className="border border-muted-foreground p-4 rounded my-4 flex gap-4">
      <div className="h-32 w-32 bg-card rounded"></div>
      <div className="flex flex-col">
        <Link className="flex flex-col" href={`/products/${item.itemId}`}>
          <p className="text-xl">{name[0].toUpperCase() + name.slice(1)}</p>
          <div className="flex gap-4">
            <p>
              <span className="text-muted-foreground">Type: </span>
              <span>Stero</span>
            </p>
            <p>
              <span className="text-muted-foreground">Color: </span>
              <span>White</span>
            </p>
          </div>
        </Link>
        <div className="mt-auto p-1 px-2 w-fit gap-4">
          <p className="text-xs text-muted-foreground line-through">$2400</p>
          <p className="text-2xl">$1000</p>
        </div>
      </div>
      <div className="ml-auto flex flex-col items-end">
        <button className="text-xl text-muted-foreground hover:text-foreground transition-all duration-500">
          <LuTrash />
        </button>
        <div className="border border-muted mt-auto p-1 px-2 w-fit flex items-center">
          <button onClick={() => qty > 1 && setQty(qty - 1)}>
            <LuMinus />
          </button>
          <input
            type="number"
            className="bg-transparent w-20 outline-none text-center"
            placeholder="1"
            value={qty}
            onChange={(e) => {
              if (e.target.value <= "0" || e.target.value >= "9") {
                setQty(0);
                return;
              }
              const v = e.target.value - "0";
              setQty(v);
            }}
          />
          <button onClick={() => setQty(qty + 1)}>
            <LuPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
