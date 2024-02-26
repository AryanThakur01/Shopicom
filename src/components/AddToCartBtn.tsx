"use client";
import { cartSlice, useDispatch, useSelector } from "@/lib/redux";
import { ICart } from "@/types/cart";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuLoader2 } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

interface IAddToCartBtn {
  productId: number;
  variantId?: number;
  className?: string;
}
const AddToCartBtn: React.FC<IAddToCartBtn> = ({
  productId,
  className,
  variantId,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const cart = useSelector((state) => state.cart.value);
  const user = useSelector((state) => state.user.value.isLoggedin);
  const dispatch = useDispatch();

  const addToCart = async () => {
    setStatus("loading");
    try {
      if (user) {
        const res = await fetch("/api/cart/add", {
          method: "POST",
          body: JSON.stringify({ itemId: productId, variantId }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const { data }: { data: ICart[] } = await res.json();
        dispatch(cartSlice.actions.setCart(data));
      } else {
        toast.error("Login For The Cart", {
          style: {
            borderRadius: "4px",
          },
        });
      }
    } catch (error) {
      toast.error(`${error}`, {
        style: {
          borderRadius: "4px",
        },
      });
    }
    setStatus("idle");
  };
  useEffect(() => {
    if (!cart?.length) {
      setIsSelected(false);
      return;
    }
    for (const item of cart) if (item.itemId === productId) setIsSelected(true);
  }, [cart]);
  return (
    <button
      className={twMerge(
        "bg-transparent text-primary border border-primary p-2 md:px-6 px-4 rounded w-40 md:text-xl text-xl font-bold",
        className,
        isSelected && "text-foreground bg-primary",
      )}
      onClick={addToCart}
      disabled={status === "loading" || (status === "idle" && isSelected)}
    >
      {status === "loading" ? (
        <LuLoader2 className="animate-spin mx-auto" />
      ) : (
        "Add to cart"
      )}
    </button>
  );
};

export default AddToCartBtn;
