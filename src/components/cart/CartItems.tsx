"use client";
import { cart } from "@/db/schema/carts";
import { cartSlice, useDispatch, useSelector } from "@/lib/redux";
import { ICart } from "@/types/cart";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { LuCheck, LuLoader2, LuMinus, LuPlus, LuTrash } from "react-icons/lu";
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
      {cart?.map((item) => <Product item={item} key={item.id} />)}
      {status === "loading" && (
        <>
          <LoadingState />
          <LoadingState />
          <LoadingState />
          <LoadingState />
          <LoadingState />
        </>
      )}
    </div>
  );
};

interface IProduct {
  item: ICart;
}
const Product: React.FC<IProduct> = ({ item }) => {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const name = item.item?.name;
  const cartItems = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();
  const dropItem = async () => {
    setLoading(true);
    try {
      let tempCart = [...cartItems];
      const res = await fetch(`/api/cart/delete?delete=one&id=${item.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`${(await res.json()).error}`);
      const { data }: { data: cart[] } = await res.json();
      if (!data || data.length === 0) throw new Error("Data Not Found");

      tempCart = tempCart.filter((item) => {
        if (item.id !== data[0].id) return item;
      });
      dispatch(cartSlice.actions.setCart([...tempCart]));
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
    setLoading(false);
  };
  return (
    <div className="border border-muted-foreground p-4 rounded my-4 flex gap-4">
      <div className="h-32 w-32 bg-card rounded overflow-hidden">
        <Image
          src={item.variant?.images[0].value}
          alt={`${name}`}
          width={400}
          height={400}
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <Link className="flex flex-col" href={`/products/${item.itemId}`}>
          <p className="text-xl">
            {name && name[0].toUpperCase() + name.slice(1)}
          </p>
          <div className="flex gap-4">
            <p className="flex gap-2 items-center">
              <span className="text-muted-foreground">Color: </span>
              <span
                className="h-4 w-8 block rounded-sm"
                style={{ backgroundColor: item.variant?.color }}
              />
            </p>
          </div>
        </Link>
        <div className="mt-auto p-1 px-2 w-fit gap-4">
          <p className="text-xs text-muted-foreground line-through">
            ₹ {item.variant?.price}
          </p>
          <p className="text-2xl">₹ {item.variant?.discountedPrice}</p>
        </div>
      </div>
      <div className="ml-auto flex flex-col items-end">
        <button
          className="text-xl text-muted-foreground hover:text-foreground transition-all duration-500"
          onClick={dropItem}
        >
          {!loading ? <LuTrash /> : <LuLoader2 className="animate-spin" />}
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
              if (e.target.value < "0" || e.target.value > "9") {
                setQty(0);
                return;
              }
              const v = e.target.value;
              setQty(Number(v));
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
const LoadingState = () => (
  <div className="border border-muted p-4 rounded my-4 flex gap-4 animate-pulse">
    <div className="h-32 w-32 bg-card rounded" />
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <p className="w-40 h-8 bg-muted/40" />
        <div className="w-20 h-6 bg-muted/30" />
      </div>
      <div className="mt-auto flex flex-col gap-2">
        <p className="h-4 w-10 bg-muted/20"></p>
        <p className="h-4 w-20 bg-muted/40"></p>
      </div>
    </div>
    <div className="ml-auto flex flex-col items-end">
      <div className="w-5 h-6 bg-muted/20" />
      <div className="bg-muted/40 mt-auto p-1 px-2 w-32 h-8 flex items-center" />
    </div>
  </div>
);

export default CartItems;
