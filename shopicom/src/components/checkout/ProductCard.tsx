import React from "react";
import Image from "next/image";
import { LuShoppingBag } from "react-icons/lu";

interface IProductCard {
  name: string;
  image: string;
  description: string;
  color: string;
  price: number;
  qty: number;
}
export const ProductCard: React.FC<IProductCard> = ({
  name,
  image,
  description,
  color,
  price,
  qty,
}) => {
  return (
    <div className="flex lg:flex-row flex-col gap-8 bg-card rounded p-4 shadow-lg text-foreground lg:pr-12">
      <div className="lg:h-32 lg:w-32 rounded overflow-hidden shrink-0">
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="h-full w-full overflow-ellipsis"
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <h2 className="text-xl flex justify-between">
          <span className="overflow-ellipsis">
            {name[0].toUpperCase() + name.slice(1)}
          </span>
          <span className="shrink-0">₹ {price.toLocaleString()}</span>
        </h2>
        <p className="text-muted-foreground">{description.slice(0, 99)}...</p>
        <p className="text-muted-foreground flex items-center gap-2 font-bold">
          <LuShoppingBag />
          <span>{qty}</span>
        </p>
        <div
          className="h-8 w-8 rounded-full mt-auto"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};
