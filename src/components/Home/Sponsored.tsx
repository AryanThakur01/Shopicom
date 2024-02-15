import { dbDriver } from "@/db";
import { categories } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import Image from "next/image";
import React from "react";
import ProductCard from "../ProductCard";

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
      <div className="grid md:grid-cols-3 xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8">
        {sponsored.map((item) => (
          <ProductCard
            key={item.id}
            src={item.product.variants[0].images[0].value}
            name={item.product.name}
            tag={item.tag}
            description={item.product.description}
            price={item.product.variants[0].price}
            discountedPrice={item.product.variants[0].discountedPrice}
          />
        ))}
      </div>
    </section>
  );
};

export default Sponsored;
