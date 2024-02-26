import Image from "next/image";
import Link from "next/link";
import React from "react";
import AddToCartBtn from "./AddToCartBtn";

interface IProductCard {
  src: string;
  name: string;
  tag: string;
  description: string;
  price: number;
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
    <div className="rounded-lg overflow-hidden group bg-card border-muted border">
      <Image
        src={src}
        alt={name}
        height={400}
        width={400}
        className="w-full "
      />
      <div className="bg-card rounded-lg relative -top-2 p-4 flex flex-col text-muted-foreground min-h-72">
        <Link href={`/products/${id}`}>
          <h3 className="md:text-2xl text-xl font-bold">
            {name[0].toUpperCase() + name.substring(1)}
          </h3>
          <p className="border border-border w-fit px-4 p-px my-2 font-light">
            {tag}
          </p>
          <p className="my-2 tracking-wide md:text-base text-sm font-light">
            {description.substring(0, 100)}...
          </p>
        </Link>
        <div className="mt-auto flex justify-between">
          {/* <p className="text-sm font-light">PRICE</p> */}
          <div className="text-success">
            <p className="md:text-2xl text-lg">
              ₹ {discountedPrice.toLocaleString()}
            </p>
            <div className="flex items-center gap-2">
              <p className="md:text-sm text-xs text-muted-foreground line-through">
                ₹ {price.toLocaleString()}
              </p>
            </div>
          </div>
          <AddToCartBtn productId={id} variantId={variantId} />
          {/* <button className="bg-primary p-2 md:px-6 px-4 rounded text-foreground min-w-[50%] md:text-xl text-xl font-bold"> */}
          {/*   Add to cart */}
          {/* </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
