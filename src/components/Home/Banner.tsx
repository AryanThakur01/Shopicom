import React from "react";
// import useEmblaCarousel from "embla-carousel-react";
import { db } from "@/db";
import { contents } from "@/db/schema/dynamicContent";
import { eq } from "drizzle-orm";
import Carousel from "../Carousel";

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
              className="flex-[0_0_95%] h-[80vh] bg-card mx-2 rounded-xl"
              style={{
                background: `url(${item.image})no-repeat center center/cover`,
              }}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default Banner;
