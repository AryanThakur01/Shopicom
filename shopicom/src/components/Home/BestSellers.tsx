"use client";
import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "../ProductCard";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface IFetchedBestSellers {
  id: number;
  tag: string;
  productId: number;
  product: {
    description: string;
    id: number;
    name: string;
    sellerId: number;
    variants: {
      id: number;
      images: { value: string }[];
      price: number;
      discountedPrice: number;
    }[];
  };
}
const BestSellers = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [bestSeller, setBestSeller] = useState<IFetchedBestSellers[]>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch("/api/products/read/bestsellers", {
      method: "GET",
    }).then(async (res) => {
      try {
        const { bestSellers }: { bestSellers: IFetchedBestSellers[] } =
          await res.json();
        setBestSeller(bestSellers);
      } catch (error) {}
    });
  }, []);

  // const bestSeller = await fetchSponsored();
  return (
    <section className="mt-20 container py-8 bg-muted">
      <h2 className="text-4xl text-muted-foreground font-bold">Best Sellers</h2>
      <hr className="my-8 border-border" />
      <div>
        {bestSeller && (
          <>
            <div className="flex justify-between gap-2">
              <button
                className="h-fit my-auto text-4xl p-1 hover:text-foreground text-muted-foreground md:block hidden"
                onClick={() => {
                  if (!emblaApi) return;
                  emblaApi.scrollPrev();
                  setPage(emblaApi.selectedScrollSnap());
                }}
              >
                <LuChevronLeft />
              </button>
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-[2%] h-fit">
                  {bestSeller.map((item, i) => (
                    <div
                      className="lg:flex-[0_0_31%] md:flex-[0_0_60%] sm:flex-[0_0_80%] flex-[0_0_96%] h-fit"
                      key={item.id}
                    >
                      <ProductCard
                        id={item.product.id}
                        src={item.product.variants[0].images[0].value}
                        name={item.product.name}
                        tag={item.tag}
                        description={item.product.description}
                        price={item.product.variants[0].price}
                        discountedPrice={
                          item.product.variants[0].discountedPrice
                        }
                        variantId={item.product.variants[0].id}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="h-fit my-auto text-4xl p-1 hover:text-foreground text-muted-foreground md:block hidden"
                onClick={() => {
                  if (!emblaApi) return;
                  emblaApi.scrollNext();
                  setPage(emblaApi.selectedScrollSnap());
                }}
              >
                <LuChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BestSellers;