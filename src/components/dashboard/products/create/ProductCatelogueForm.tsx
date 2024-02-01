"use client";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import FormField from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import * as zod from "zod";
import { LuLoader, LuTrash } from "react-icons/lu";
import ImageForm from "./ImageForm";

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
          zod.object({ value: zod.custom<FileList>().optional() }),
        ),
        price: zod.number(),
        discountedPrice: zod.number(),
      }),
    )
    .max(8),
});
export type TFormInput = zod.infer<typeof schema>;

const ProductCatelogueForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const defaultValues = {
    name: "",
    description: "",
    properties: [{ key: "", value: "" }],
    variants: [
      {
        color: "#c2362d",
        imageList: [{}, {}, {}, {}, {}],
        price: 100,
        discountedPrice: 200,
      },
    ],
  };
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const propTable = useFieldArray({ control, name: "properties" });
  const variants = useFieldArray({ control, name: "variants" });
  const submitHandler: SubmitHandler<TFormInput> = async (data) => {
    setSubmitting(true);
    const fReader = new FileReader();
    data.variants.map((item) => {
      item.imageList.map((_, i) => {
        const file = item.imageList[i].value;
        if (!file) delete item.imageList[i];
        else {
          // fReader.readAsDataURL(file[0]);
          // fReader.onload = (txt) => {
          //   console.log(txt.target?.result);
          // };
        }
      });
    });
    console.log(JSON.parse(JSON.stringify(data)));
    setSubmitting(false);
  };
  // Price
  // Variants
  // -------> Sizes
  // -------> Colors
  // Stars
  // Stock
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
                className="grid grid-cols-3 md:gap-8 2xl:gap-16 gap-8"
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
                type="color"
                uni={`variants.${i}.color`}
                register={register}
                error={errors.variants && errors.variants[i]?.color?.message}
              />
              <ImageForm
                index={i}
                value={{
                  ...item,
                  imageList: item.imageList,
                }}
                update={variants.update}
                control={control}
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
