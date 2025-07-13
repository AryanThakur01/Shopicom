"use client";
import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "../ProductCard";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { url } from "@/lib/constants";
import { category, image, product, variant } from "@/db/schema/products";

interface IVariants extends variant {
  images: image[];
}
interface IProducts extends product {
  variants: IVariants[];
}
interface IFetchedBestSellers extends category {
  product: IProducts;
}
const BestSellers = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [bestSeller, setBestSeller] = useState<IFetchedBestSellers[]>([]);

  const fetchBestSellers = async () => {
    const res = await fetch(url + "/api/products/read/bestsellers");
    const { bestSellers }: { bestSellers?: IFetchedBestSellers[] } =
      await res.json();
    if(bestSellers) setBestSeller(bestSellers);
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  // const bestSeller = await fetchSponsored();
  return (
    <>
      {bestSeller.length>0 && (
        <section className="mt-20 container py-8 bg-muted">
          <h2 className="text-4xl text-muted-foreground font-bold">
            Best Sellers
          </h2>
          <hr className="my-8 border-border" />
          <div>
            <div className="flex justify-between gap-2">
              <button
                className="h-fit my-auto text-4xl p-1 hover:text-foreground text-muted-foreground md:block hidden"
                onClick={() => {
                  if (!emblaApi) return;
                  emblaApi.scrollPrev();
                }}
              >
                <LuChevronLeft />
              </button>
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-[2%] h-fit">
                  {bestSeller.map((item) => item.product.variants[0] && (
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
                        price={Number(item.product.variants[0].price)}
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
                  // setPage(emblaApi.selectedScrollSnap());
                }}
              >
                <LuChevronRight />
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default BestSellers;
