import { dbDriver } from "@/db";
import { categories } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import Image from "next/image";
import React from "react";

const Sponsored = async () => {
  const fetchSponsored = async () => {
    return await dbDriver.query.categories.findMany({
      with: {
        product: {
          with: {
            variants: {
              with: {
                images: true,
              },
            },
          },
        },
      },
      where: eq(categories.tag, "sponsored"),
      limit: 12,
    });
  };
  const sponsored = await fetchSponsored();
  return (
    <section className="container my-10">
      <p className="my-4 text-muted-foreground">• sponsored</p>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {sponsored.map((item) => (
          <div className="rounded-lg overflow-hidden group bg-card">
            <Image
              src={item.product.variants[0].images[0].value}
              alt={item.product.name}
              height={400}
              width={400}
              className="w-full "
            />
            <div className="bg-card rounded-lg relative -top-2 p-4 flex flex-col text-muted-foreground min-h-72">
              <h3 className="text-xl font-bold">
                {item.product.name[0].toUpperCase() +
                  item.product.name.substring(1)}
              </h3>
              <p className="border border-border w-fit px-4 p-1 my-2 font-light">
                {item.tag}
              </p>
              <p className="my-2 tracking-wide text-lg font-light">
                {item.product.description.substring(0, 100)}...
              </p>
              <div className="mt-auto flex justify-between">
                <div className="text-success">
                  <p className="text-sm font-light">PRICE</p>
                  <p className="text-2xl">
                    ₹{" "}
                    {item.product.variants[0].discountedPrice.toLocaleString()}
                  </p>
                </div>
                <button className="bg-primary p-2 px-6 rounded text-foreground min-w-[50%] text-2xl font-bold">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Sponsored;
