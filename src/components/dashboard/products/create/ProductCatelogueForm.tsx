"use client";
import React, { ReactNode, useState } from "react";
import FormField from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import * as zod from "zod";
import { LuLoader, LuTrash } from "react-icons/lu";

const schema = zod.object({
  name: zod.string().min(3),
  description: zod.string().min(10),
  properties: zod
    .array(zod.object({ key: zod.string(), value: zod.string() }))
    .max(16),
});
type TFormInput = zod.infer<typeof schema>;

const ProductCatelogueForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      properties: [
        {
          key: "",
          value: "",
        },
      ],
    },
  });
  // const { fields, append, remove } = useFieldArray({
  const productProperties = useFieldArray({
    control,
    name: "properties",
  });
  const submitHandler: SubmitHandler<TFormInput> = async (data) => {
    setSubmitting(true);
    console.log(data);
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
          <h3 className="my-4">Property Table</h3>
          <div>
            {productProperties.fields.map((item, i) => (
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
                    onClick={() => productProperties.remove(i)}
                    className="self-start hover:bg-muted w-10 h-10 rounded"
                  >
                    <LuTrash className="stroke-destructive mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            {productProperties.fields.length < 8 && (
              <button
                type="button"
                onClick={() => {
                  if (productProperties.fields.length < 16)
                    productProperties.append({
                      key: "",
                      value: "",
                    });
                }}
                className="bg-background p-2 w-32 rounded"
              >
                Add
              </button>
            )}
          </div>
        </SectionContainer>
        <SectionContainer title="Price/Picture Details">
          <div></div>
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
