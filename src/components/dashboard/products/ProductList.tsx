"use client";

import { IProductProps } from "@/types/products";
import Image from "next/image";
import React, { FC, ReactNode, useMemo, useState } from "react";

interface IProductList {}

const ProductList: FC<IProductList> = () => {
  const [productList, setProductList] = useState<IProductProps[]>([]);
  const [productFetching, setProductFetching] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number[]>([]);
  const fetchProducts = async () => {
    setProductFetching(true);
    try {
      const res = await fetch("/api/products/read/myproducts", {
        method: "GET",
      });
      const products = await res.json();
      setProductList(products);
    } catch (error) {
      console.log("ERROR FETCHING DATA");
    }
    setProductFetching(false);
  };

  useMemo(fetchProducts, []);

  return (
    <div>
      {/* table Header */}
      <Tr isHead>
        <div className="col-span-2 text-start">
          <h3>PRODUCT</h3>
        </div>
        <h3 className="md:block hidden">STOCK</h3>
        <h3 className="md:block hidden">ORDERS</h3>
        <h3>COLOR</h3>
      </Tr>
      {productFetching ? (
        <>
          <TrLoadingSkeleton />
          <TrLoadingSkeleton />
          <TrLoadingSkeleton />
          <TrLoadingSkeleton />
          <TrLoadingSkeleton />
        </>
      ) : (
        productList.map((item) => (
          <Tr className="my-4" key={item.id}>
            <div className="col-span-2 flex items-center gap-4 text-foreground">
              <div className="h-12 w-12 bg-purple-500 rounded overflow-hidden">
                <Image
                  src={`${item.variants[0].imageList[0].value}`}
                  alt="IMG"
                  height={100}
                  width={100}
                />
              </div>
              <div className="flex flex-col gap-1 max-w-[60%] text-start">
                <p className="md:text-base 2xl:text-lg text-xs truncate">
                  {item.name}
                </p>
                <div className="flex gap-2 text-xs">
                  <p className="line-through text-muted-foreground">
                    ₹ {item.variants[0].price}
                  </p>
                  <p>₹ {item.variants[0].discountedPrice}</p>
                </div>
              </div>
            </div>
            <p className="md:block hidden">--</p>
            <p className="md:block hidden">--</p>
            <div className="grid grid-cols-4 gap-4 place-self-center">
              {item.variants.map((sub, i) => (
                <p
                  key={sub.id}
                  className="place-self-center rounded-full h-6 w-6"
                  style={{
                    backgroundColor: `${item.variants[i].color}`,
                  }}
                ></p>
              ))}
            </div>
          </Tr>
        ))
      )}
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
        "grid md:grid-cols-5 grid-cols-3 gap-2 gap-y-4 mt-4 rounded text-muted-foreground md:mx-6 p-2 text-center items-center"
      }
    >
      {children}
    </div>
  );
};
const TrLoadingSkeleton = () => {
  return (
    <Tr>
      <div className="col-span-2 flex items-center gap-4 text-foreground">
        <div className="h-12 w-12 bg-muted rounded animate-pulse" />
        <div className="max-w-[60%] bg-muted w-full h-12 rounded animate-pulse" />
      </div>
      <p className="md:block hidden h-12 animate-pulse bg-muted w-20 justify-self-center rounded"></p>
      <p className="md:block hidden h-12 animate-pulse bg-muted w-20 justify-self-center rounded"></p>
      <div className="place-self-center h-8 animate-pulse w-8 rounded-full bg-muted"></div>
    </Tr>
  );
};

export default ProductList;
