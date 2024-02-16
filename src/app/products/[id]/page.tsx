import ImageCarousel from "@/components/products/product/ImageCarousel";
import VariantSelector from "@/components/products/product/VariantSelector";
import { dbDriver } from "@/db";
import { products } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import React from "react";

interface IPage {
  params: { id: string };
}
const page: React.FC<IPage> = async ({ params }) => {
  const product = await dbDriver.query.products.findFirst({
    where: eq(products.id, params.id),
    with: {
      seller: true,
      variants: {
        with: {
          images: true,
        },
      },
      categories: true,
      properties: true,
    },
  });

  return (
    <>
      <section className="container my-8 grid md:grid-cols-3 gap-8">
        <div>
          <ImageCarousel image={product?.variants[0].images} />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-3xl uppercase">{product?.name}</h1>
          <p className="text-xl text-muted-foreground my-2">
            {product?.description}
          </p>
          <div className="bg-muted rounded xl p-2 my-6">
            <Tr className="text-xl font-bold text-foreground bg-background">
              <h2>Property</h2>
              <h2>Value</h2>
            </Tr>
            {product?.properties.map((item, i) => (
              <Tr
                className={"text-lg" + " " + (i % 2 !== 0 ? "bg-card/50" : "")}
              >
                <p>{item.key}</p>
                <p>{item.value}</p>
              </Tr>
            ))}
          </div>
          <VariantSelector variants={product?.variants} />
        </div>
      </section>
    </>
  );
};

interface ITr {
  children: React.ReactNode;
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
        "cursor-default grid grid-cols-2 gap-2 rounded text-muted-foreground px-4 p-2" +
        " " +
        className
      }
    >
      {children}
    </div>
  );
};

export default page;
