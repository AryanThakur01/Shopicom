"use client";
import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuImagePlus,
  LuTrash,
} from "react-icons/lu";
import Image from "next/image";
import { imageProcessor } from "@/utils/helpers/blobToStr";

const BannerUploader = () => {
  // const [images, setImages] = useState<Array<FileList>>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [imgSrc, setImgSrc] = useState<Array<string>>([]);

  const newImgRef = useRef<HTMLInputElement | null>(null);

  const insertImg = async () => {
    if (!newImgRef.current?.files) return;

    const img = await imageProcessor(newImgRef.current?.files[0]);
    setImgSrc([...imgSrc, img]);
    const res = await fetch("/api/content/banner/create?", {
      body: img,
      method: "POST",
    });
    console.log(await res.json());
  };
  useEffect(() => {
    console.log(imgSrc);
  }, [imgSrc]);

  // const processAllImages = async () => {
  //   const imgStrList = [];
  //   for (const img of images) {
  //     const imgStr = await imageProcessor(img[0]);
  //     imgStrList.push(imgStr);
  //   }
  //   setImgSrc([...imgStrList]);
  // };
  // useEffect(() => {
  //   processAllImages();
  // }, [images]);

  return (
    <div>
      <h2 className="text-2xl">Home Page Banner</h2>
      <hr className="mb-8 mt-4 border-border" />
      <div className="border border-border rounded-lg">
        <div className="min-h-72 p-2 flex">
          <button
            className="md:block hidden text-2xl hover:scale-150 transition-all"
            onClick={() => {
              emblaApi?.scrollPrev();
            }}
          >
            <LuChevronLeft />
          </button>
          <div className="overflow-hidden w-full" ref={emblaRef}>
            <div className="flex">
              {imgSrc.map((_, i) => (
                <>
                  <label
                    htmlFor={`banner${i}`}
                    key={"Carousel-" + i}
                    className="cursor-pointer flex-[0_0_95%] max-h-80 bg-black mx-2 rounded-xl flex flex-col overflow-hidden group"
                  >
                    <input
                      type="file"
                      name={`banner${i}`}
                      id={`banner${i}`}
                      className="hidden"
                      // onChange={(e) => {
                      //   const tempImg = [...images];
                      //   if (!e.target.files) return;
                      //   tempImg[i] = e.target.files;
                      //   setImages([...tempImg]);
                      // }}
                    />
                    {!imgSrc[i] ? (
                      <span className="mx-auto my-auto">
                        <LuImagePlus className="text-8xl" />
                      </span>
                    ) : (
                      <>
                        <div className="relative top-1/2 h-0 z-10">
                          <button
                            className="hover:scale-110 transition-all p-2 text-xl hidden group-hover:block rounded bg-destructive/80 backdrop-blur-sm hover:bg-destructive mx-auto"
                            // onClick={() => {
                            //   const tempImgBlobs = [...images];
                            //   setImages([
                            //     ...tempImgBlobs.slice(0, i),
                            //     ...tempImgBlobs.slice(i + 1),
                            //   ]);
                            // }}
                          >
                            <LuTrash className="mx-auto" />
                          </button>
                        </div>
                        <span
                          className="flex flex-col justify-center h-full p-1 group-hover:opacity-65 group-hover:blur-[1px]"
                          style={{
                            background: `url(${imgSrc[i]})no-repeat center center/cover`,
                          }}
                        />
                      </>
                    )}
                  </label>
                </>
              ))}
              <label
                htmlFor={`banner${imgSrc.length + 1}`}
                key={"Carousel-" + (imgSrc.length + 1)}
                className="cursor-pointer flex-[0_0_95%] min-h-80 bg-card mx-2 rounded-xl flex flex-col"
              >
                <input
                  type="file"
                  name={`banner${imgSrc.length + 1}`}
                  id={`banner${imgSrc.length + 1}`}
                  className="hidden"
                  ref={newImgRef}
                  onChange={insertImg}
                  // onChange={(e) => {
                  //   if (e.target.files !== null) {
                  //     setImages([...images, e.target.files]);
                  //   }
                  // }}
                />
                <span className="mx-auto my-auto">
                  <LuImagePlus className="text-8xl" />
                </span>
              </label>
            </div>
          </div>
          <button
            className="md:block hidden text-2xl hover:scale-150 transition-all"
            onClick={() => {
              emblaApi?.scrollNext();
            }}
          >
            <LuChevronRight />
          </button>
        </div>
      </div>
      {/* <div className="flex"> */}
      {/*   <button className="bg-primary my-4 mx-auto text-foreground font-bold p-2 w-32 rounded text-xl"> */}
      {/*     Update */}
      {/*   </button> */}
      {/* </div> */}
    </div>
  );
};

export default BannerUploader;
