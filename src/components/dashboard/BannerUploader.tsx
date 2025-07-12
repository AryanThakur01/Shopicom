"use client";
import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuImagePlus,
  LuLoader,
  LuLoader2,
  LuMegaphone,
  LuX,
} from "react-icons/lu";
import { imageProcessor } from "@/utils/helpers/blobToStr";
import { NewContent } from "@/db/schema/dynamicContent";
import toast from "react-hot-toast";
import { useGetProfileQuery } from "@/lib/redux/services/user";

const BannerUploader = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [banners, setBanners] = useState<NewContent[]>([]);
  const [deleting, setDeleting] = useState(false);

  const {isLoading, data: user} = useGetProfileQuery()

  const getBanners = async () => {
    try {
      const res = await fetch("api/content/banner", { method: "GET" });
      if (!res.ok) {
        const body = await res.json();
        console.log(body);
        throw new Error(`${body}`);
      }
      const { data }: { data: NewContent[] } = await res.json();
      setBanners(data);
    } catch (error) {
      console.log("ERROR-FrontEnd", error);
    }
  };

  const deleteBanner = async (id?: number, optionalIndex?: number) => {
    setDeleting(true);
    try {
      if (id) {
        const res = await fetch(`/api/content/banner?id=${id}`, {
          method: "DELETE",
        });
        console.log(await res.json());
        await getBanners();
      } else if (optionalIndex) {
        const tempBanners = [...banners];
        setBanners([
          ...tempBanners.slice(0, optionalIndex),
          ...tempBanners.slice(optionalIndex + 1, banners.length),
        ]);
      }
    } catch (error) {
      console.log(error);
    }
    setDeleting(false);
  };

  useEffect(() => {
    getBanners();
  }, []);

  return isLoading?
    <div className="w-full min-h-[50vh] flex items-center justify-center">
      <LuLoader2 className="animate-spin size-10" />
    </div>
    :
    user?.role === "admin" ?(
    <div>
      <h2 className="text-2xl">Home Page Banner (Only For Admin)</h2>
      <hr className="mb-8 mt-4 border-border" />
      <div className="border border-border rounded-lg">
        <div className="min-h-72 p-2 flex">
          <button
            className="md:block hidden text-2xl hover:scale-150 transition-all h-40 my-auto"
            onClick={() => {
              emblaApi?.scrollPrev();
            }}
          >
            <LuChevronLeft />
          </button>
          <div className="overflow-hidden w-full" ref={emblaRef}>
            <div className="flex gap-2">
              {banners?.map((item, i) => (
                <div
                  className="flex-[0_0_95%] rounded-xl flex flex-col group animate-open-pop"
                  key={"banner-" + i}
                >
                  <div className="h-0 flex justify-end relative z-20">
                    <button
                      className="m-2 p-1 text-xl border h-fit rounded-full"
                      onClick={() => deleteBanner(item.id, i)}
                      disabled={deleting}
                    >
                      {deleting ? (
                        <LuLoader className="mx-auto animate-spin" />
                      ) : (
                        <LuX />
                      )}
                    </button>
                  </div>
                  <Banner data={item} />
                </div>
              ))}
              <button
                className="cursor-pointer flex-[0_0_95%] h-80 bg-card rounded-xl flex flex-col"
                // onClick={() => setBannerLength(bannerLength + 1)}
                onClick={() => setBanners([...banners, { tag: "home_banner" }])}
              >
                <span className="mx-auto my-auto">
                  <LuMegaphone className="text-8xl" />
                </span>
              </button>
            </div>
          </div>
          <button
            className="md:block hidden text-2xl hover:scale-150 transition-all h-40 my-auto"
            onClick={() => {
              emblaApi?.scrollNext();
            }}
          >
            <LuChevronRight />
          </button>
        </div>
      </div>
    </div>
  ): <>
    <h2 className="text-2xl">Welcome {user?.firstName && user.lastName ? `${user?.firstName} ${user?.lastName}`: "User"}</h2>
        <h3 className="text-muted-foreground">You can check your orders and all other details from the sidebar</h3>
      </>;
};

interface IBanner {
  data?: NewContent;
}
const Banner: React.FC<IBanner> = ({ data }) => {
  const [title, setTitle] = useState<string | null | undefined>("");
  const [description, setDescription] = useState<string | null | undefined>("");
  const [link, setLink] = useState<string | null | undefined>("");
  const [imgSrc, setImgSrc] = useState<string | null | undefined>("");
  const [loading, setLoading] = useState(false);

  const imgRef = useRef<HTMLInputElement>(null);

  const uploadBanner = async () => {
    setLoading(true);
    try {
      const body: NewContent = {
        tag: "home_banner",
        link: link,
        image: imgSrc,
        content: description,
        title: title,
      };
      if (data?.id) body.id = data.id;
      const res = await fetch("/api/content/banner", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      await res.json();
      toast.success("Banner Uploaded Successfully");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      console.log(error);
    }
    setLoading(false);
  };
  const imageSelector = async () => {
    try {
      const imgBlob = imgRef.current?.files?.item(0);
      if (!imgBlob) throw new Error("Image Format Error");
      const img = await imageProcessor(imgBlob);
      if (!img) throw new Error("Image Conversion Error");
      setImgSrc(img);
    } catch (error) {}
  };
  useEffect(() => {
    if (!data) return;
    setImgSrc(data.image);
    setTitle(data.title);
    setDescription(data.content);
    setLink(data.link);
    setImgSrc(data.image);
  }, []);
  return (
    <>
      <label className="cursor-pointer w-full min-h-80 bg-black rounded-xl flex flex-col overflow-hidden group">
        <input
          ref={imgRef}
          type="file"
          name="image"
          id="image"
          className="hidden"
          onChange={imageSelector}
        />
        {imgSrc ? (
          <>
            <span
              className="flex flex-col justify-center h-full p-1 hover:opacity-90 hover:blur-[1px] transition-all"
              style={{
                background: `url(${imgSrc})no-repeat center center/cover`,
              }}
            />
          </>
        ) : (
          <>
            <LuImagePlus className="text-8xl mx-auto my-auto" />
          </>
        )}
      </label>
      <div className="py-6 px-2 grid md:grid-cols-2 gap-8">
        <input
          type="text"
          className="bg-background border-b border-b-border w-full px-4 p-1 outline-none focus:border-b-success"
          placeholder="Title"
          value={title ? title : ""}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="bg-background border-b border-b-border w-full px-4 p-1 outline-none focus:border-b-success"
          placeholder="Link"
          value={link ? link : ""}
          onChange={(e) => setLink(e.target.value)}
        />
        <input
          type="text"
          className="md:col-span-2 bg-background border-b border-b-border w-full px-4 p-1 outline-none focus:border-b-success"
          placeholder="Description | image hook | text color | overlay(y/n)"
          value={description ? description : ""}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div />
        <div className="flex justify-end gap-4">
          <button
            className="bg-success h-10 rounded w-32 font-bold"
            onClick={uploadBanner}
            disabled={loading}
          >
            {loading ? <LuLoader className="mx-auto animate-spin" /> : "Upload"}
          </button>
        </div>
      </div>
    </>
  );
};
export default BannerUploader;
