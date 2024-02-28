import {
  Control,
  UseFieldArrayUpdate,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { TFormInput } from "./ProductCatelogueForm";
import { useEffect, useState } from "react";
import Image from "next/image";

interface IImageForm {
  update: UseFieldArrayUpdate<TFormInput, "variants">;
  index: number;
  value: {
    color: string;
    images: Array<{
      value?: FileList | string;
      id?: number;
      variantId?: number;
    }>;
    price: string;
    discountedPrice: string;
    stock: string;
    orders: string;
  };
  parentControl: Control<TFormInput>;
}
const ImageForm: React.FC<IImageForm> = ({
  update,
  index,
  value,
  parentControl,
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { register, control } = useForm({
    defaultValues: { images: value.images },
  });
  const { fields } = useFieldArray({ control, name: "images" });
  const fieldWatch = useWatch({ control });
  const variantVals = useWatch({ control: parentControl, name: "variants" });

  const imageUploader = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const file = e.target.files;
    if (!file) return;
    if (!fieldWatch.images) return;
    const tempImg = [...fieldWatch.images];
    tempImg[i].value = file;
    update(index, {
      ...variantVals[index],
      images: tempImg,
    });
  };
  useEffect(() => {
    if (!fieldWatch.images) return;

    const imageCount = fieldWatch.images.length;
    if (imageCount < 0) return;

    // console.log("Field: ", fieldWatch);

    const images = [];
    for (let i = 0; i < imageCount; i++) {
      const element = fieldWatch.images[i].value;
      if (element) {
        let url: string =
          typeof element === "string"
            ? element
            : URL.createObjectURL(element[0]);
        images.push(url);
      } else {
        images.push("");
      }
    }
    setUploadedImages(images);
  }, [fieldWatch]);
  return (
    <>
      <div className="flex gap-4 my-4">
        {fields.map((item, i) => (
          <label
            key={item.id}
            htmlFor={`images.${i}.value`}
            className={
              (uploadedImages[i] && "place-items-center ") +
              "outline-white grid h-40 w-40 bg-background rounded border border-muted overflow-hidden "
            }
          >
            <div className="h-0">
              <input
                key={item.id}
                type="file"
                {...register(`images.${i}.value`)}
                className="h-40 w-full opacity-0 cursor-pointer relative z-10"
                onChange={(e) => imageUploader(e, i)}
              />
            </div>
            {uploadedImages[i] && (
              <Image
                src={uploadedImages[i]}
                height={100}
                width={100}
                className="min-h-full min-w-full object-contain"
                alt=""
              />
            )}
          </label>
        ))}
      </div>
    </>
  );
};

export default ImageForm;
