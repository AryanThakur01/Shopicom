import React from "react";
import { db } from "@/db";
import { contents } from "@/db/schema/dynamicContent";
import { eq } from "drizzle-orm";
import Carousel from "../Carousel";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const Banner = async () => {
  const banners = await db
    .select()
    .from(contents)
    .where(eq(contents.tag, "home_banner"));

  banners.sort((a, b) => a.id - b.id);

  return (
    <section className="my-4 md:container">
      <Carousel>
        <div className="flex">
          {banners &&
            banners.map((item) => {
              const content = item.content?.split("|");
              return (
                <div
                  key={item.id}
                  className="flex-[0_0_95%] bg-card mx-2 rounded-xl flex flex-col overflow-hidden min-h-[80vh] max-h-[40rem]"
                  style={{
                    background: `url(${item.image})no-repeat ${
                      content && content[1] ? content[1] : "center"
                    } center/cover`,
                  }}
                >
                  <div
                    className={twMerge(
                      "h-full w-full flex flex-col container justify-center",
                      content &&
                        content[3] &&
                        content[3].toLowerCase() === "y" &&
                        "bg-background/80 backdrop-blur-sm",
                    )}
                  >
                    {item.title && (
                      <>
                        <h1
                          className="text-6xl"
                          style={{
                            color: `${
                              content && content[2]
                                ? content[2]
                                : "hsl(var(--foreground))"
                            }`,
                          }}
                        >
                          {item.title}
                        </h1>
                        <h2
                          className="md:text-xl max-w-[28rem]"
                          style={{
                            color: `${
                              content && content[2]
                                ? content[2]
                                : "hsl(var(--foreground))"
                            }`,
                          }}
                        >
                          {content && content[0]}
                        </h2>
                      </>
                    )}
                    {item.link && (
                      <Link
                        href={item.link}
                        className="bg-success w-32 p-1 text-center rounded text-xl my-4"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </Carousel>
    </section>
  );
};

export default Banner;
