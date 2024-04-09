"use client";
import FormField from "@/components/FormField";
import { productSchema_v2 } from "@/lib/schemas/products_v2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LuLoader, LuTrash } from "react-icons/lu";
import * as zod from "zod";
import SectionContainer from "./SectionContainer";

interface IGenDetails {}
type TFormInput = zod.infer<typeof productSchema_v2>;
const GenDetails: React.FC<IGenDetails> = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const defaultValues = {
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
  const submitHandler: SubmitHandler<TFormInput> = async (body) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const {
        data,
        data: { newProduct },
      } = await res.json();
      console.log(data, newProduct);
      router.push(`/dashboard/products/create/variant/${newProduct.id}`);
    } catch (error) {
      toast.error("Something Went Wrong");
    }
    setSubmitting(false);
  };
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="my-4 flex flex-col gap-4"
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
        className="bg-primary rounded h-10 font-bold w-40 ml-auto"
        disabled={submitting}
      >
        {submitting ? (
          <LuLoader className="animate-spin mx-auto size-5" />
        ) : (
          "Next"
        )}
      </button>
    </form>
  );
};

export default GenDetails;
