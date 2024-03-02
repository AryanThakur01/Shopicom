"use client";
import { image, variant } from "@/db/schema/products";
import { productSlice, useDispatch } from "@/lib/redux";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface IVariantWithImgs extends variant {
  images: image[];
}
interface IVariantSelector {
  variants: IVariantWithImgs[];
}
const VariantSelector: React.FC<IVariantSelector> = ({ variants }) => {
  const dispatch = useDispatch();
  const [curVar, setCurVar] = useState(0);
  useEffect(() => {
    dispatch(
      productSlice.actions.setProduct({
        variant: variants[curVar],
        images: variants[curVar].images,
      }),
    );
  }, [curVar]);
  return (
    <>
      <div className="grid grid-cols-4 w-fit gap-2 my-4">
        {variants.map((item, i) => (
          <button
            key={item.id}
            className={twMerge(
              "p-4 w-fit rounded-full border-4 border-background hover:border-muted",
              curVar === i && "border-muted",
            )}
            style={{ backgroundColor: item.color }}
            onClick={() => setCurVar(i)}
          ></button>
        ))}
      </div>
    </>
  );
};

export default VariantSelector;
