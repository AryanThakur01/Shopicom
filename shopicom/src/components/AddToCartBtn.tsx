"use client";
import { useSelector } from "@/lib/redux";
import {
  useAddToCartMutation,
  useGetCartQuery,
} from "@/lib/redux/services/cart";
import { useGetProfileQuery } from "@/lib/redux/services/user";
import React, { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuLoader2 } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

interface IAddToCartBtn {
  productId: number;
  variantId?: number;
  className?: string;
  icon?: ReactNode;
}
const AddToCartBtn: React.FC<IAddToCartBtn> = ({
  productId,
  className,
  variantId,
  icon,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const cart = useGetCartQuery().data;
  // const user = useSelector((state) => state.user.value.isLoggedin);
  const user = useGetProfileQuery();
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const cartHandler = async () => {
    try {
      if (!variantId) throw new Error("No variant id found");
      if (!user) {
        throw new Error("Login For The Cart");
      }
      addToCart({ itemId: productId, variantId });
    } catch (error) {
      let message = "It's not you, it's us";
      if (error instanceof Error) message = error.message;
      toast.error(message, { style: { borderRadius: "4px" } });
    }
  };
  useEffect(() => {
    if (!cart?.length) {
      setIsSelected(false);
      return;
    }
    for (const item of cart) if (item.itemId === productId) setIsSelected(true);
  }, [cart]);
  return (
    <>
      <button
        className={twMerge(
          !icon &&
            "bg-transparent text-primary border border-primary p-2 md:px-6 px-4 rounded w-40 md:text-xl text-xl font-bold",
          isSelected && (icon ? "text-success" : "text-foreground bg-primary"),
          className,
        )}
        onClick={cartHandler}
        disabled={isLoading || isSelected}
      >
        {isLoading ? (
          <LuLoader2 className="animate-spin mx-auto" />
        ) : icon ? (
          icon
        ) : (
          "Add to cart"
        )}
      </button>
    </>
  );
};

export default AddToCartBtn;
