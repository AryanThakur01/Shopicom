"use client";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

const Banner = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes());
    }
  }, [emblaApi]);
  const CarouselContent = [{}, {}, {}, {}, {}, {}];
  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {CarouselContent.map((item, i) => (
          <div
            key={"Carousel-" + i}
            className="flex-[0_0_95%] h-[80vh] bg-card mx-2 rounded-xl"
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
