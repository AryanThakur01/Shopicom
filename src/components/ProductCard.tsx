import Image from "next/image";
import Link from "next/link";
import React from "react";
import AddToCartBtn from "./AddToCartBtn";
import { LuShoppingCart } from "react-icons/lu";

interface IProductCard {
  src: string;
  name: string;
  tag: string;
  description: string;
  price: string;
  discountedPrice: number;
  id: number;
  variantId?: number;
}

const ProductCard: React.FC<IProductCard> = ({
  id,
  src,
  name,
  price,
  description,
  tag,
  discountedPrice,
  variantId,
}) => {
  return (
    <div className="rounded-md overflow-hidden group bg-background border-muted shadow-foreground/5 shadow">
      <Image
        src={src}
        alt={name}
        height={400}
        width={400}
        className="w-full "
      />
      <div className="bg-background rounded-sm relative -top-2 p-4 flex flex-col text-muted-foreground min-h-32">
        <div className="flex gap-2 justify-between">
          <Link href={`/products/${id}`}>
            <h3 className="md:text-2xl text-xl font-bold shrink-0">
              {name[0].toUpperCase() + name.substring(1)}
            </h3>
          </Link>
          <AddToCartBtn
            productId={id}
            variantId={variantId}
            icon={<LuShoppingCart size={22} />}
          />
          {/* <p className="border border-border w-fit px-4 p-px my-2 font-light"> */}
          {/*   {tag} */}
          {/* </p> */}
          {/* <p className="my-2 tracking-wide md:text-base text-sm font-light"> */}
          {/*   {description.substring(0, 100)}... */}
          {/* </p> */}
        </div>
        <hr className="my-auto border-border" />
        <div className=" flex justify-between">
          <p className="self-center text- font-light">PRICE</p>
          <div className="text-success">
            <p className="md:text-2xl text-lg">
              ₹ {discountedPrice.toLocaleString()}
            </p>
            {/* <div className="flex items-center gap-2"> */}
            {/*   <p className="md:text-sm text-xs text-muted-foreground line-through"> */}
            {/*     ₹ {price.toLocaleString()} */}
            {/*   </p> */}
            {/* </div> */}
          </div>
          {/* <AddToCartBtn productId={id} variantId={variantId} /> */}
          {/* <button className="bg-primary p-2 md:px-6 px-4 rounded text-foreground min-w-[50%] md:text-xl text-xl font-bold"> */}
          {/*   Add to cart */}
          {/* </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
