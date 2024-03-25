"use client";
import { cart } from "@/db/schema/carts";
import { cartSlice, useDispatch, useSelector } from "@/lib/redux";
import { ICart } from "@/types/cart";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LuLoader2,
  LuMinus,
  LuPlus,
  LuShoppingCart,
  LuTrash,
} from "react-icons/lu";

const CartItems = () => {
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [netTotal, setNetToatal] = useState(0);

  const cart = useSelector((state) => state.cart.value);
  const status = useSelector((state) => state.cart.status);
  useEffect(() => {
    let tempTotal = 0;
    let discount = 0;
    let netTotal = 0;
    cart?.map((item) => {
      tempTotal += item.variant?.price;
      discount += item.variant?.price - item.variant?.discountedPrice;
      netTotal += item.variant?.discountedPrice;
    });
    setTotal(tempTotal);
    setDiscount(discount);
    setNetToatal(netTotal);
  }, [cart]);

  return (
    <div className="md:grid grid-cols-4 gap-8">
      <div className="md:col-span-3 flex flex-col gap-4">
        {/* <div className="border border-muted-foreground flex justify-between p-4 rounded container"> */}
        {/*   <button */}
        {/*     className="my-auto flex gap-4" */}
        {/*     onClick={() => setSelectAll(!selectAll)} */}
        {/*   > */}
        {/*     <div */}
        {/*       className={twMerge( */}
        {/*         "border border-muted-foreground w-4 h-4 my-auto rounded-[2px]", */}
        {/*       )} */}
        {/*     > */}
        {/*       <LuCheck */}
        {/*         className={twMerge( */}
        {/*           "relative bottom-2 size-6 m-auto stroke-2 rounded-[2px] animate-open-pop", */}
        {/*           !selectAll && "hidden", */}
        {/*         )} */}
        {/*       /> */}
        {/*     </div> */}
        {/*     <p>Select All</p> */}
        {/*   </button> */}
        {/*   <button className="bg-foreground text-background p-2 rounded-full px-6"> */}
        {/*     Delete */}
        {/*   </button> */}
        {/* </div> */}
        {cart?.map((item) => <Product item={item} key={item.id} />)}
        {status !== "loading" && !cart.length && (
          <div className="border border-border rounded h-full w-full flex">
            <div className="text-muted font-bold m-auto min-h-80 flex flex-col justify-center">
              <LuShoppingCart className="mx-auto size-32" />
              <p className="text-xl pointer-events-none">Your Cart Is Empty</p>
            </div>
          </div>
        )}
        {status === "loading" && (
          <>
            <LoadingState />
            <LoadingState />
          </>
        )}
      </div>
      <div className="border border-border rounded p-4 md:my-0 my-4 h-fit">
        <h2 className="md:text-xl">Summary Order</h2>
        <div className="flex flex-col gap-2 my-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Subtotal</p>
            <p>₹ {total.toLocaleString()}</p>
          </div>
          <div className="text-muted-foreground flex items-center justify-between">
            <p className="text-sm">Discount</p>
            <p> ₹ {discount.toLocaleString()}</p>
          </div>
          <hr className="my-4 border-border" />
          <div className="flex items-center justify-between">
            <p className="text-success text-lg">Net Total</p>
            <p className="text-success text-2xl">
              ₹ {netTotal.toLocaleString()}
            </p>
          </div>
          <hr className="my-4 border-border" />
          {total > 0 && (discount / total) * 100 >= 20 ? (
            <p className="text-center text-success">
              Congrats you saved{" "}
              <b className="text-lg">
                {((discount / total) * 100).toFixed(0)}%{" "}
              </b>{" "}
              on this order
            </p>
          ) : (
            <></>
          )}
        </div>
        <Link
          href={`/checkout?cart=true`}
          className="font-bold text-muted text-center w-full bg-foreground p-2 rounded block"
        >
          Buy Now ({cart.length})
        </Link>
      </div>
    </div>
  );
};

interface IProduct {
  item: ICart;
}
const Product: React.FC<IProduct> = ({ item }) => {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  // const [selected, setSelected] = useState(false);
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
    <div className="border border-border p-4 rounded flex gap-4">
      {/* <button */}
      {/*   className="flex gap-4 self-start h-fit" */}
      {/*   onClick={() => setSelected(!selected)} */}
      {/* > */}
      {/*   <div */}
      {/*     className={twMerge( */}
      {/*       "border border-muted-foreground w-4 h-4 my-auto rounded-[2px]", */}
      {/*     )} */}
      {/*   > */}
      {/*     <LuCheck */}
      {/*       className={twMerge( */}
      {/*         "relative bottom-2 size-6 m-auto stroke-2 rounded-[2px] animate-open-pop", */}
      {/*         !selected && "hidden", */}
      {/*       )} */}
      {/*     /> */}
      {/*   </div> */}
      {/* </button> */}
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
            ₹ {item.variant?.price.toLocaleString()}
          </p>
          <p className="text-2xl">
            ₹ {item.variant?.discountedPrice.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="ml-auto flex flex-col items-end">
        <button
          className="text-xl text-muted-foreground hover:text-foreground transition-all duration-500"
          onClick={dropItem}
          disabled={loading}
        >
          {!loading ? <LuTrash /> : <LuLoader2 className="animate-spin" />}
        </button>
        <div className="border border-border rounded-sm mt-auto p-1 px-2 w-fit flex items-center">
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
                setQty(1);
                return;
              }
              const v = e.target.value;
              if (Number(v) < item.variant.stock) setQty(Number(v));
              else toast.error(`Maximum Order Limit: ${item.variant.stock}`);
            }}
          />
          <button
            onClick={() => {
              if (item.variant.stock > qty + 1) setQty(qty + 1);
              else toast.error(`Max Limit is: ${item.variant.stock}`);
            }}
          >
            <LuPlus />
          </button>
        </div>
      </div>
    </div>
  );
};
const LoadingState = () => (
  <div className="border border-muted p-4 rounded flex gap-4 animate-pulse">
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
