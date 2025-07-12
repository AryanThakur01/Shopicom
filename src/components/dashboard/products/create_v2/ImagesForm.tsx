import React, { useRef, useState } from "react";
import SectionContainer from "./SectionContainer";
import { LuCloud, LuLoader2, LuTrash2 } from "react-icons/lu";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  useDeleteImageMutation,
  useUploadImageMutation,
} from "@/lib/redux/services/products";
import { image } from "@/db/schema/products";
import { twMerge } from "tailwind-merge";

interface IImageForm {
  id: number;
  color?: string;
  images?: image[];
}
const ImagesForm: React.FC<IImageForm> = ({ id, color, images }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadImgApi, { isLoading, isSuccess }] = useUploadImageMutation();
  const [deleteImgApi] = useDeleteImageMutation();
  const ImageUploadHandler = async () => {
    setUploading(true);
    try {
      const file = inputRef.current?.files?.item(0);
      if (!file || !file.type.startsWith("image"))
        throw new Error("Recheck File and Format");
      console.log(file.type.split("/"));
      const f = await uploadImgApi({ img: file, variantId: id }).unwrap();
      console.log(f);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else toast.error("Something went wrong, it's Not you it's us");
    }
    setUploading(false);
  };
  const deleteImg = async (id: number) => {
    setDeleting(id);
    try {
      const del = await deleteImgApi(id).unwrap();
      console.log(del);
      toast.success("Updated Successfully");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something Went Wrong");
    }
    setDeleting(-1);
  };
  return (
    <>
      <SectionContainer title="Product Images" className="h-full" color={color}>
        <div className="gap-4 flex overflow-scroll">
          {images?.map((item, i) => (
            <div
              className="md:h-40 md:w-40 h-32 w-32 overflow-hidden rounded group flex shrink-0"
              key={item.id}
            >
              <div
                className={twMerge(
                  "w-0 h-8 my-auto relative z-10 left-[50%] group-hover:block",
                  deleting !== item.id && "hidden",
                )}
              >
                <button
                  className="-translate-x-[50%]"
                  disabled={deleting === item.id}
                  onClick={() => {
                    deleteImg(item.id);
                  }}
                >
                  {deleting === item.id ? (
                    <LuLoader2 className="animate-spin size-6" />
                  ) : (
                    <LuTrash2 className="text-white size-8 hover:stroke-destructive" />
                  )}
                </button>
              </div>
              <Image
                src={item.value}
                key={`Img-${i}`}
                alt="Check Format"
                height={200}
                width={200}
                className={twMerge(
                  "h-full w-full group-hover:opacity-20 transition duration-300",
                  deleting === item.id && "opacity-20",
                )}
              />
            </div>
          ))}
          {(!images || images.length < 5) && (
            <div className="md:h-40 md:w-40 h-32 w-32 border-dashed border rounded flex justify-center items-center shrink-0">
              {uploading ? (
                <LuLoader2 className="mx-auto my-auto animate-spin size-16 stroke-muted-foreground" />
              ) : (
                <label
                  htmlFor={`image-${id}`}
                  className="md:text-md text-sm md:h-40 md:w-40 h-32 w-32 cursor-pointer flex flex-col justify-center items-center"
                  onDrop={(e) => {
                    e.preventDefault();
                    console.log("Dropped");
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    console.log("Dropped");
                  }}
                >
                  <input
                    type="file"
                    className="hidden"
                    id={`image-${id}`}
                    ref={inputRef}
                    onChange={ImageUploadHandler}
                  />
                  <p className="text-primary">Upload an image</p>
                  <LuCloud size={24} />
                  <p className="text-muted-foreground text-xs">
                    Click Or Drag and drop
                  </p>
                </label>
              )}
            </div>
          )}
        </div>
      </SectionContainer>
    </>
  );
};

export default ImagesForm;
