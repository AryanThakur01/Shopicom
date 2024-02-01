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
    imageList: Array<{
      value?: FileList;
    }>;
    price: number;
    discountedPrice: number;
  };
  control: Control<TFormInput>;
}
const ImageForm: React.FC<IImageForm> = ({ update, index, value }) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { register, control } = useForm({
    defaultValues: { imageList: value.imageList },
  });
  const { fields } = useFieldArray({ control, name: "imageList" });
  const fieldWatch = useWatch({ control });
  const imageUploader = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const file = e.target.files;
    if (!file) return;
    if (!fieldWatch.imageList) return;
    const tempImg = [...fieldWatch.imageList];
    tempImg[i].value = file;
    update(index, {
      ...value,
      imageList: tempImg,
    });
  };
  useEffect(() => {
    if (!fieldWatch.imageList) return;

    const imageCount = fieldWatch.imageList.length;
    if (imageCount < 0) return;

    const imageList = [];
    for (let i = 0; i < imageCount; i++) {
      const element = fieldWatch.imageList[i].value;
      if (element) {
        const url = URL.createObjectURL(element[0]);
        imageList.push(url);
      } else {
        imageList.push("");
      }
    }
    setUploadedImages(imageList);
  }, [fieldWatch]);
  return (
    <>
      <div className="flex gap-4 my-4">
        {fields.map((item, i) => (
          <label
            key={item.id}
            htmlFor={`imageList.${i}.value`}
            className={
              (uploadedImages[i] && "place-items-center ") +
              "outline-white grid h-40 w-40 bg-background rounded border border-muted overflow-hidden "
            }
          >
            <div className="h-0">
              <input
                key={item.id}
                type="file"
                {...register(`imageList.${i}.value`)}
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
