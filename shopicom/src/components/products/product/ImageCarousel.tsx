"use client";
import Carousel from "@/components/Carousel";
import { image } from "@/db/schema/products";
import { useSelector } from "@/lib/redux";
import Image from "next/image";
import React from "react";

interface IImageCarousel {
  image?: image[];
}
const ImageCarousel: React.FC<IImageCarousel> = ({ image }) => {
  const images = useSelector(
    (prod) => prod.product.initialProduct.value.images,
  );
  return (
    <>
      <Carousel>
        <div className="flex">
          {images?.map((item) => (
            <div
              key={item.id}
              className="flex-[0_0_90%] mx-2 rounded-xl flex flex-col overflow-hidden h-fit "
            >
              <Image
                src={item.value}
                height={1920}
                width={1080}
                alt="Product"
              />
            </div>
          ))}
        </div>
      </Carousel>
    </>
  );
};

export default ImageCarousel;
