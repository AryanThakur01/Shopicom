"use client";

import { IProductProps } from "@/types/products";
import Image from "next/image";
import React, { FC, ReactNode, useMemo, useState } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";

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
      console.log(products);
      setSelectedVariant([...Array(products.length)].map(() => 0));
      setProductList(products);
    } catch (error) {
      console.log("ERROR FETCHING DATA");
    }
    setProductFetching(false);
  };

  useMemo(fetchProducts, []);

  return (
    <div className="min-h-96">
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
        </>
      ) : (
        <>
          {productList.length > 0 ? (
            productList.map(
              (item, i) =>
                item.id && (
                  <Tr
                    className="my-4"
                    key={item.id}
                    productId={item.id?.toString()}
                  >
                    <Link
                      href={"/dashboard/products/update/" + item.id}
                      className="cursor-pointer col-span-2 flex items-center gap-4 text-foreground"
                    >
                      <div className="h-12 w-12 rounded overflow-hidden flex items-center">
                        <Image
                          src={`${
                            item.variants[selectedVariant[i]].images[0].value
                          }`}
                          alt="?"
                          className="text-4xl object-center min-h-full"
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
                            ₹ {item.variants[selectedVariant[i]].price}
                          </p>
                          <p>
                            ₹{" "}
                            {item.variants[selectedVariant[i]].discountedPrice}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <p className="md:block hidden">
                      {item.variants[selectedVariant[i]].stock}
                    </p>
                    <p className="md:block hidden">
                      {item.variants[selectedVariant[i]].orders}
                    </p>
                    <Popover.Root>
                      <Popover.Trigger asChild>
                        <button
                          className="h-8 w-8 mx-auto rounded-full hover:ring-muted hover:ring"
                          style={{
                            backgroundColor: `${
                              item.variants[selectedVariant[i]].color
                            }`,
                          }}
                        ></button>
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content className="" sideOffset={5}>
                          <ToggleGroup.Root
                            className="bg-muted flex gap-4 place-self-center p-2 rounded w-fit px-4"
                            type="single"
                          >
                            {item.variants.map((sub, subI) => (
                              <ToggleGroup.Item
                                value={i.toString()}
                                key={sub.id}
                                onClick={() => {
                                  const copiedVariants = [...selectedVariant];
                                  copiedVariants[i] = subI;
                                  setSelectedVariant([...copiedVariants]);
                                }}
                              >
                                <div
                                  className="place-self-center rounded-full h-6 w-6"
                                  style={{
                                    backgroundColor: `${item.variants[subI].color}`,
                                  }}
                                />
                              </ToggleGroup.Item>
                            ))}
                          </ToggleGroup.Root>
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
                  </Tr>
                ),
            )
          ) : (
            <p className="min-h-80 flex items-center justify-center text-muted-foreground text-xl">
              No Products Found
            </p>
          )}
        </>
      )}
    </div>
  );
};

interface ITr {
  children: ReactNode;
  isHead?: boolean;
  className?: string;
  productId?: string;
}
const Tr: React.FC<ITr> = ({ children, isHead, className, productId }) => {
  return (
    <div
      className={
        (isHead ? "bg-muted " : "") +
        " " +
        className +
        " " +
        "cursor-default grid md:grid-cols-5 grid-cols-3 gap-2 gap-y-4 mt-4 rounded text-muted-foreground md:mx-6 p-2 text-center items-center"
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
