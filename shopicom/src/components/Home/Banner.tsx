import React from "react";
import { db } from "@/db";
import { contents } from "@/db/schema/dynamicContent";
import { eq } from "drizzle-orm";
import Carousel from "../Carousel";
import Image from "next/image";
import Link from "next/link";

const Banner = async () => {
  const banners = await db
    .select()
    .from(contents)
    .where(eq(contents.tag, "home_banner"));

  return (
    <section className="my-4 container">
      <Carousel>
        <div className="flex">
          {banners &&
            banners.map((item) => (
              <div
                key={item.id}
                className="flex-[0_0_95%] bg-card mx-2 rounded-xl flex flex-col overflow-hidden"
              >
                <Image
                  src={`${item.image}`}
                  alt={`${item.title}`}
                  width={1920}
                  height={1080}
                  className="h-[75vh] sm:object-cover object-fill"
                />
                <div className="mt-auto bg-card p-4 min-h-20 flex justify-between gap-8 items-center">
                  <div>
                    <h1 className="md:text-4xl text-2xl">{item.title}</h1>
                    <h2 className="my-4 md:text-xl text-sm">{item.content}</h2>
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
