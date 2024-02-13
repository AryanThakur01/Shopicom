"use client";
import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { LuChevronLeft, LuChevronRight, LuImagePlus } from "react-icons/lu";
import Image from "next/image";
import { imageProcessor } from "@/utils/helpers/blobToStr";

const BannerUploader = () => {
  const [images, setImages] = useState<Array<FileList>>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [imgSrc, setImgSrc] = useState<Array<string>>([]);

  const processAllImages = async () => {
    for (const img of images) {
      const imgStr = await imageProcessor(img[0]);
      setImgSrc([...imgSrc, imgStr]);
    }
  };
  useEffect(() => {
    processAllImages();
  }, [images]);

  return (
    <div>
      <h2 className="text-2xl">Home Page Banner</h2>
      <hr className="mb-8 mt-4 border-border" />
      <div className="border border-border rounded-lg">
        <div className="min-h-72 p-2 flex">
          <button
            className="text-2xl"
            onClick={() => {
              emblaApi?.scrollPrev();
            }}
          >
            <LuChevronLeft />
          </button>
          <div className="overflow-hidden w-full" ref={emblaRef}>
            <div className="flex">
              {images.map((_, i) => (
                <label
                  htmlFor={`banner${i}`}
                  key={"Carousel-" + i}
                  className="cursor-pointer flex-[0_0_95%] max-h-80 overflow-hidden bg-card mx-2 rounded-xl flex flex-col"
                >
                  <input
                    type="file"
                    name={`banner${i}`}
                    id={`banner${i}`}
                    className="hidden"
                    onChange={(e) => {
                      const tempImg = [...images];
                      if (!e.target.files) return;
                      tempImg[i] = e.target.files;
                      console.log("Update");
                      setImages([...tempImg]);
                    }}
                  />
                  {!images[i] ? (
                    <span className="mx-auto my-auto">
                      <LuImagePlus className="text-8xl" />
                    </span>
                  ) : (
                    <span className="block">
                      {imgSrc[i] && (
                        <Image
                          className="object-center"
                          src={`${imgSrc[i]}`}
                          alt={"Banner"}
                          width={1240}
                          height={600}
                        />
                      )}
                    </span>
                  )}
                </label>
              ))}
              <label
                htmlFor={`banner${images.length + 1}`}
                key={"Carousel-" + (images.length + 1)}
                className="cursor-pointer flex-[0_0_95%] min-h-80 bg-card mx-2 rounded-xl flex flex-col"
              >
                <input
                  type="file"
                  name={`banner${images.length + 1}`}
                  id={`banner${images.length + 1}`}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files !== null) {
                      setImages([...images, e.target.files]);
                    }
                  }}
                />
                <span className="mx-auto my-auto">
                  <LuImagePlus className="text-8xl" />
                </span>
              </label>
            </div>
          </div>
          <button
            className="text-2xl"
            onClick={() => {
              emblaApi?.scrollNext();
            }}
          >
            <LuChevronRight />
          </button>
        </div>
        <div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default BannerUploader;
