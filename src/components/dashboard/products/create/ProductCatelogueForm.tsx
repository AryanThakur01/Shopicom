"use client";
import React, { ReactNode, useEffect, useState } from "react";
import FormField from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import * as zod from "zod";
import { LuLoader, LuTrash } from "react-icons/lu";
import ImageForm from "./ImageForm";
import { useRouter } from "next/navigation";
import { imageProcessor } from "@/utils/helpers/blobToStr";
import { IProductProps } from "@/types/products";

const schema = zod.object({
  name: zod.string().min(3),
  description: zod.string().min(10),
  properties: zod
    .array(zod.object({ key: zod.string(), value: zod.string() }))
    .max(8),
  variants: zod
    .array(
      zod.object({
        color: zod.string(),
        imageList: zod.array(
          zod.object({ value: zod.custom<FileList | string>().optional() }),
        ),
        price: zod.string().min(1),
        discountedPrice: zod.string().min(1),
        stock: zod.string().min(1),
        orders: zod.string().min(1),
      }),
    )
    .max(8),
});
export type TFormInput = zod.infer<typeof schema>;

interface IProductCatelogueForm {}
const ProductCatelogueForm: React.FC<IProductCatelogueForm> = ({}) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const defaultValues = {
    name: "",
    description: "",
    properties: [{ key: "", value: "" }],
    variants: [
      {
        color: "#c2362d",
        imageList: [{}, {}, {}, {}, {}],
        price: "",
        discountedPrice: "",
        stock: "",
        orders: "0",
      },
    ],
  };
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const propTable = useFieldArray({ control, name: "properties" });
  const variants = useFieldArray({ control, name: "variants" });
  const submitHandler: SubmitHandler<TFormInput> = async (data) => {
    setSubmitting(true);
    try {
      console.log(data);
      for (let i = 0; i < data.variants.length; i++) {
        const variantImages = data.variants[i].imageList;
        const images: { value: string }[] = [];
        for (let j = 0; j < variantImages.length; j++) {
          if (!variantImages[j].value) delete variantImages[j];
          else {
            const fileBlobList = variantImages[j].value;
            if (!fileBlobList) throw new Error("Improper file format");
            const image = await imageProcessor(fileBlobList[0]);
            images.push({ value: image });
          }
        }
        data.variants[i].imageList = images;
      }
      console.log(data);
      const res = await fetch("/api/products/create", {
        method: "POST",
        body: JSON.stringify(data),
      });
      console.log("RES: ", await res.text());
      router.push("/dashboard/products");
    } catch (error) {
      console.log("ERROR: ", error);
    }
    setSubmitting(false);
  };
  return (
    <>
      <form
        className="my-8 flex flex-col gap-4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <SectionContainer title="General Details">
          <FormField
            type="text"
            placeholder="Enter the name of the Product"
            uni="name"
            register={register}
            error={errors.name?.message}
            label="Name of Product"
          />
          <FormField
            type="text"
            as="textarea"
            placeholder="Enter The Description of the project"
            uni="description"
            register={register}
            error={errors.description?.message}
            label="Description"
          />
        </SectionContainer>
        <SectionContainer
          title="Property Table"
          ctaFunction={
            propTable.fields.length < 8
              ? () => {
                  if (propTable.fields.length < 8)
                    propTable.append({
                      key: "",
                      value: "",
                    });
                }
              : undefined
          }
          ctaText="Add Property"
        >
          <div>
            {propTable.fields.map((item, i) => (
              <div
                key={item.id}
                className="my-4 grid grid-cols-3 md:gap-8 2xl:gap-16 gap-8"
              >
                <FormField
                  type="text"
                  register={register}
                  uni={`properties.${i}.key`}
                  placeholder="Key"
                />
                <div className="col-span-2 flex gap-4 items-center">
                  <FormField
                    type="text"
                    register={register}
                    uni={`properties.${i}.value`}
                    placeholder="Value"
                    containerClass="col-span-2 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => propTable.remove(i)}
                    className="self-start bg-background hover:bg-muted w-10 h-10 rounded"
                  >
                    <LuTrash className="stroke-destructive mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
        <SectionContainer
          title="Variant Details"
          ctaFunction={
            variants.fields.length < 8
              ? () => {
                  variants.append(defaultValues.variants);
                }
              : undefined
          }
          ctaText="Add Variant"
        >
          {variants.fields.map((item, i) => (
            <React.Fragment key={item.id}>
              <FormField
                label="Color"
                type="color"
                uni={`variants.${i}.color`}
                register={register}
                error={errors.variants && errors.variants[i]?.color?.message}
              />
              <div className="flex gap-4 items-center">
                <FormField
                  label={"Stock"}
                  type="number"
                  uni={`variants.${i}.stock`}
                  placeholder="Stock"
                  register={register}
                  error={errors.variants && errors.variants[i]?.stock?.message}
                />
                <FormField
                  label={"Orders"}
                  type="number"
                  uni={`variants.${i}.orders`}
                  placeholder="Orders"
                  value="0"
                  register={register}
                  error={errors.variants && errors.variants[i]?.orders?.message}
                  containerClass="hidden"
                />
              </div>
              <div className="flex gap-4 items-center">
                <FormField
                  label={"Product price"}
                  type="number"
                  uni={`variants.${i}.price`}
                  placeholder="Product Price"
                  register={register}
                  error={errors.variants && errors.variants[i]?.price?.message}
                />
                <FormField
                  label="Discouted price"
                  type="number"
                  uni={`variants.${i}.discountedPrice`}
                  register={register}
                  placeholder="Discounted Price"
                  error={
                    errors.variants &&
                    errors.variants[i]?.discountedPrice?.message
                  }
                />
              </div>
              <ImageForm
                index={i}
                value={{
                  ...item,
                  imageList: item.imageList,
                }}
                update={variants.update}
                parentControl={control}
              />
              {i !== variants.fields.length - 1 && (
                <hr className="border-muted my-4" />
              )}
            </React.Fragment>
          ))}
        </SectionContainer>
        <button
          type="submit"
          className="bg-primary rounded-lg h-10 font-bold w-40 ml-auto"
          disabled={submitting}
        >
          {submitting ? (
            <LuLoader className="animate-spin mx-auto size-5" />
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </>
  );
};

interface ISectionContainer {
  title: string;
  children: ReactNode;
  ctaFunction?: () => void;
  ctaText?: string;
}
const SectionContainer: React.FC<ISectionContainer> = ({
  title,
  children,
  ctaFunction,
  ctaText,
}) => {
  return (
    <div className="border border-border bg-card rounded-lg overflow-hidden">
      <div className="flex justify-between bg-muted items-center p-2 px-4 min-h-16">
        <h3 className="text-lg font-bold">{title}</h3>
        {ctaFunction && (
          <button
            type="button"
            onClick={ctaFunction}
            className="bg-success p-2 w-32 rounded"
          >
            {ctaText}
          </button>
        )}
      </div>
      <hr className="border-border" />
      <div className="p-4">{children}</div>
    </div>
  );
};

export default ProductCatelogueForm;
