"use client";
import FormField from "@/components/FormField";
import { productSchema_v2 } from "@/lib/schemas/products_v2";
import { IProductProps } from "@/types/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { LuLoader, LuTrash } from "react-icons/lu";
import * as zod from "zod";

interface IGenDetails {
  product?: IProductProps;
  id?: string;
}
type TFormInput = zod.infer<typeof productSchema_v2>;
const GenDetails: React.FC<IGenDetails> = ({ product, id }) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const defaultValues = product
    ? { ...product }
    : {
        name: "",
        description: "",
        properties: [{ key: "", value: "" }],
      };
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: zodResolver(productSchema_v2),
    defaultValues,
  });
  const propTable = useFieldArray({ control, name: "properties" });
  const submitHandler: SubmitHandler<TFormInput> = (data) => {
    console.log(data);
  };
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="my-8 flex flex-col gap-4"
    >
      <SectionContainer title="General Details">
        <FormField
          type="text"
          placeholder="Enter the name of the Product"
          uni="name"
          register={register}
          label="Name of Product"
          error={errors.name?.message}
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
  );
};

// --------------------------- Container For Section -------------------------
interface ISectionContainer {
  title: string;
  children: React.ReactNode;
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
    <div className="border border-border bg-card rounded-md overflow-hidden">
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
// ---------------------------------------------------------------------------

export default GenDetails;
