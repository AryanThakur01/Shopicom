"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ICarousel {
  children: React.ReactNode;
}
const Carousel: React.FC<ICarousel> = ({ children }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  return (
    <div className="overflow-hidden" ref={emblaRef}>
      {children}
    </div>
  );
};

export default Carousel;
