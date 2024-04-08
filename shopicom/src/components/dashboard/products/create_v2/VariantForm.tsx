"use client";
import FormField from "@/components/FormField";
import { variantsFormData } from "@/lib/schemas/products_v2";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as zod from "zod";
import SectionContainer from "./SectionContainer";
import { LuLoader } from "react-icons/lu";
import { useCreateVariantMutation } from "@/lib/redux/services/products";
import { variant } from "@/db/schema/products";

interface IVariantForm {
  id: number;
  variant: variant | null;
}
type TFormInput = zod.infer<typeof variantsFormData>;
const VariantForm: React.FC<IVariantForm> = ({ id, variant }) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [createVariant, isLoading] = useCreateVariantMutation();
  const defaultValues = {
    color: variant?.color || "#000",
    price: `${variant?.price || "0"}`,
    discountedPrice: `${variant?.discountedPrice || ""}`,
    stock: `${variant?.stock || ""}`,
    orders: `${variant?.orders || "0"}`,
  };
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: zodResolver(variantsFormData),
    defaultValues,
  });
  const submitHandler: SubmitHandler<TFormInput> = async (data) => {
    setSubmitting(true);
    try {
      console.log(data);
      const newVariant = await createVariant({
        ...data,
        productId: id,
        variantId: variant?.id,
      }).unwrap();
      console.log(newVariant);
    } catch (error) {
      toast.error("Something Went Wrong");
    }
    setSubmitting(false);
  };
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="h-full">
      <SectionContainer
        title="Availability Details"
        color={variant?.color}
        className="h-full"
      >
        <FormField
          label="Color"
          type="color"
          uni="color"
          register={register}
          error={errors.color?.message}
        />
        <div className="flex gap-4 items-center">
          <FormField
            label="Stock"
            type="number"
            uni="stock"
            placeholder="Stock"
            register={register}
            error={errors.stock?.message}
          />
          <FormField
            label="Orders"
            type="number"
            uni="orders"
            placeholder="Orders"
            value="0"
            register={register}
            error={errors.orders?.message}
            containerClass="hidden"
          />
          <FormField
            label="Product price"
            type="number"
            uni="price"
            placeholder="Product Price"
            register={register}
            error={errors.price?.message}
          />
          <FormField
            label="Discouted price"
            type="number"
            uni="discountedPrice"
            register={register}
            placeholder="Discounted Price"
            error={errors.discountedPrice?.message}
          />
        </div>
        {/* <div className="flex gap-4 items-center my-4"> */}
        {/*   <FormField */}
        {/*     label="Product price" */}
        {/*     type="number" */}
        {/*     uni="price" */}
        {/*     placeholder="Product Price" */}
        {/*     register={register} */}
        {/*     error={errors.price?.message} */}
        {/*   /> */}
        {/*   <FormField */}
        {/*     label="Discouted price" */}
        {/*     type="number" */}
        {/*     uni="discountedPrice" */}
        {/*     register={register} */}
        {/*     placeholder="Discounted Price" */}
        {/*     error={errors.discountedPrice?.message} */}
        {/*   /> */}
        {/* </div> */}
        <div className="flex">
          <button
            type="submit"
            className="bg-primary rounded h-10 font-bold w-40 ml-auto"
            disabled={submitting}
          >
            {submitting ? (
              <LuLoader className="animate-spin mx-auto size-5" />
            ) : variant ? (
              "Update"
            ) : (
              "Create Variant"
            )}
          </button>
        </div>
      </SectionContainer>
    </form>
  );
};

export default VariantForm;
