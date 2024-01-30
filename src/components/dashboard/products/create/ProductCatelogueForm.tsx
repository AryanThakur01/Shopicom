"use client";
import React, { ReactNode, useState } from "react";
import FormField from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import * as zod from "zod";
import { LuLoader } from "react-icons/lu";
import Image from "next/image";

const schema = zod.object({
  name: zod.string().min(3),
  description: zod.string().min(10),
  images: zod.array(
    zod.object({
      value: zod.custom<FileList>((val) => {
        return typeof val;
      }),
    }),
  ),
});
type TFormInput = zod.infer<typeof schema>;

const ProductCatelogueForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    register,
    getValues,
    formState: { errors },
    watch,
  } = useForm<TFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      images: [{}],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "images",
    control,
  });
  const submitHandler: SubmitHandler<TFormInput> = async (data) => {
    setSubmitting(true);
    console.log(data);
    console.log(data.images[0].value[0]);
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
      {/* <input type="color" onChange={(e) => setCol(e.target.value)} /> */}
      {/* <input type="file" onChange={(e) => console.log(e.target.files)} /> */}
      {console.log(fields)}
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
          {getValues().images.map((_, i) => (
            <FormField
              key={"image_" + i}
              uni={`images.${i}.value`}
              type="file"
              register={register}
              error={errors.images?.message}
              labelClass="h-40 w-40"
            ></FormField>
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
}
const SectionContainer: React.FC<ISectionContainer> = ({ title, children }) => {
  return (
    <div className="border border-border bg-card rounded-lg overflow-hidden">
      <h3 className="text-lg font-bold p-4 bg-muted">{title}</h3>
      <hr className="border-border" />
      <div className="p-4">{children}</div>
    </div>
  );
};

export default ProductCatelogueForm;
