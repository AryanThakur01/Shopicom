import React from "react";
// import useEmblaCarousel from "embla-carousel-react";
import { db } from "@/db";
import { contents } from "@/db/schema/dynamicContent";
import { eq } from "drizzle-orm";
import Carousel from "../Carousel";
import Image from "next/image";
import Link from "next/link";

const Banner = async () => {
  // const [emblaRef, emblaApi] = useEmblaCarousel();

  const banners = await db
    .select()
    .from(contents)
    .where(eq(contents.tag, "home_banner"));

  // useEffect(() => {
  //   if (emblaApi) {
  //     console.log(emblaApi.slideNodes());
  //   }
  // }, [emblaApi]);
  const CarouselContent = [{}, {}, {}, {}, {}, {}];
  return (
    <section className="my-4 container">
      <Carousel>
        <div className="flex">
          {banners.map((item, i) => (
            <div
              key={item.id}
              className="flex-[0_0_95%] h-[80vh] bg-card mx-2 rounded-xl flex flex-col overflow-hidden"
              style={{
                background: `url(${item.image})no-repeat center center/cover`,
              }}
            >
              <div className="mt-auto bg-card p-4 min-h-20 flex justify-between items-center">
                <div>
                  <h1 className="text-4xl">{item.title}</h1>
                  <h2 className="my-4">{item.content}</h2>
                </div>
                {item.link && (
                  <Link
                    href={item.link}
                    className="bg-success w-20 p-1 text-center rounded text-xl"
                  >
                    Visit
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default Banner;
