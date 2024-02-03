import { db } from "@/db";
import { images, products, variants } from "@/db/schema/products";
import { IProductProps } from "@/types/products";
import { jwtDecoder } from "@/utils/api/helpers";
import { productJoinMerger } from "@/utils/products";
import { eq, inArray } from "drizzle-orm";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { FC, ReactNode } from "react";

interface IProductList {
  token: string;
}

const ProductList: FC<IProductList> = async ({ token }) => {
  const jwtPayload = jwtDecoder(token);
  if (typeof jwtPayload === "string") redirect("/login");

  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.sellerId, jwtPayload.id))
    .innerJoin(variants, eq(products.id, variants.productId))
    .innerJoin(images, eq(variants.id, images.variantId));
  const productList: IProductProps[] = productJoinMerger(
    allProducts,
    jwtPayload.id,
  );

  return (
    <div>
      {/* table Header */}
      <Tr isHead>
        <div className="col-span-2 text-start">
          <h3>PRODUCT</h3>
        </div>
        <h3>STOCK</h3>
        <h3>ORDERS</h3>
        <h3>COLOR</h3>
      </Tr>
      <Tr className={`my-4`}>
        {productList.map((item) => (
          <React.Fragment key={item.id}>
            <div className="col-span-2 flex items-center gap-4 text-foreground">
              <div className="h-12 w-12 bg-purple-500 rounded overflow-hidden">
                <Image
                  src={`${item.variants[0].imageList[0].value}`}
                  alt="IMG"
                  height={100}
                  width={100}
                />
              </div>
              <div className="flex flex-col gap-1">
                <p>{item.name}</p>
                <div className="flex gap-2 text-xs">
                  <p className="line-through text-muted-foreground">
                    ₹ {item.variants[0].price}
                  </p>
                  <p>₹ {item.variants[0].discountedPrice}</p>
                </div>
              </div>
            </div>
            <p>--</p>
            <p>--</p>
            <div className="flex gap-4 place-self-center">
              {item.variants.map((_, i) => (
                <p
                  className="place-self-center rounded-full h-6 w-6"
                  style={{
                    backgroundColor: `${item.variants[i].color}`,
                  }}
                ></p>
              ))}
            </div>
          </React.Fragment>
        ))}
      </Tr>
    </div>
  );
};

interface ITr {
  children: ReactNode;
  isHead?: boolean;
  className?: string;
}
const Tr: React.FC<ITr> = ({ children, isHead, className }) => {
  return (
    <div
      className={
        (isHead ? "bg-muted " : "") +
        " " +
        className +
        " " +
        "grid grid-cols-5 gap-y-4 mt-4 rounded text-muted-foreground px-6 p-2 text-center items-center"
      }
    >
      {children}
    </div>
  );
};

export default ProductList;
