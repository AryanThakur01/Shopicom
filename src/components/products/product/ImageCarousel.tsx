"use client";
import Carousel from "@/components/Carousel";
import { image } from "@/db/schema/products";
import { useSelector } from "@/lib/redux";
import Image from "next/image";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface IImageCarousel {
  image?: image[];
}
const ImageCarousel: React.FC<IImageCarousel> = ({ image }) => {
  const [curImage, setCurImage] = useState(0);
  const images = useSelector(
    (prod) => prod.product.initialProduct.value.images,
  );
  const imageStatus = useSelector((prod) => prod.product.initialProduct.status);
  return (
    <div>
      {imageStatus === "loading" ? (
        <div className="w-full aspect-square bg-card animate-pulse" />
      ) : (
        <>
          <div className="w-full md:h-[80vh] overflow-hidden">
            {images.map((item, i) => (
              <Image
                key={item.id}
                src={item.value}
                alt="Cur Product"
                width={1920}
                height={1080}
                className={twMerge(
                  i === curImage ? "block" : "hidden",
                  "min-h-full mx-auto",
                )}
              />
            ))}
          </div>
          <div className="my-8 flex gap-4">
            {images.map((item, index) => (
              <button
                key={`product-image-${index}`}
                onClick={() => setCurImage(index)}
                className={twMerge(
                  "p-1",
                  index === curImage &&
                    "border-2 border-muted bg-card shadow shadow-foreground/10",
                )}
              >
                <Image
                  src={item.value}
                  alt="Cur Product"
                  width={100}
                  height={100}
                />
              </button>
            ))}
          </div>
        </>
      )}
      {/* <Carousel> */}
      {/*   <div className="flex"> */}
      {/*     {images?.map((item) => ( */}
      {/*       <div */}
      {/*         key={item.id} */}
      {/*         className="flex-[0_0_90%] mx-2 rounded-xl flex flex-col overflow-hidden h-fit " */}
      {/*       > */}
      {/*         <Image */}
      {/*           src={item.value} */}
      {/*           height={1920} */}
      {/*           width={1080} */}
      {/*           alt="Product" */}
      {/*         /> */}
      {/*       </div> */}
      {/*     ))} */}
      {/*   </div> */}
      {/* </Carousel> */}
    </div>
  );
};

export default ImageCarousel;
