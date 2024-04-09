"use client";
import React, { useState } from "react";
import FormField from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import { LuLoader } from "react-icons/lu";
import { IProductProps } from "@/types/products";
import toast from "react-hot-toast";
import { generalSchema as productSchema_v2 } from "@/lib/schemas/products_v2";
import SectionContainer from "./SectionContainer";
import { useGetProfileQuery } from "@/lib/redux/services/user";
import { useUpdateProductGeneralMutation } from "@/lib/redux/services/products";
import PropertiesUpdater from "./PropertiesUpdater";
import Link from "next/link";

// -------------------- zod Schema for validation --------------------------
export type TFormInput = zod.infer<typeof productSchema_v2>;
// -------------------------------------------------------------------------

interface IProductCatelogueForm {
  product?: IProductProps;
  id?: string;
}
const ProductCatelogueForm: React.FC<IProductCatelogueForm> = ({
  product,
  id,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const user = useGetProfileQuery();
  const [updateProduct] = useUpdateProductGeneralMutation();
  const defaultValues = product
    ? { ...product }
    : { name: "", description: "" };
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: zodResolver(productSchema_v2),
    defaultValues,
  });

  const submitHandler: SubmitHandler<TFormInput> = async (data) => {
    setSubmitting(true);
    try {
      const { ...general } = data;
      const sellerId = user.data?.id;
      if (!sellerId || !id) throw new Error("'sellerId' && 'id' are required");
      if (!product) throw new Error("product should be provided");
      await updateProduct({
        ...general,
        sellerId: Number(sellerId),
        id: Number(id),
      });
      toast.success("Product Updated Successfully");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      console.log(error);
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
          <div className="flex flex-col gap-4">
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
            <button
              type="submit"
              className="bg-primary rounded h-10 font-bold w-40 ml-auto mt-4"
              disabled={submitting}
            >
              {submitting ? (
                <LuLoader className="animate-spin mx-auto size-5" />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </SectionContainer>
      </form>
      {product?.properties && <PropertiesUpdater productId={product.id} />}
      <div className="my-12 flex">
        <Link
          href={`/dashboard/products/create/variant/${product?.id}`}
          className="ml-auto bg-primary p-2 px-4 rounded font-bold"
        >
          Go To Variants
        </Link>
      </div>
    </>
  );
};

export default ProductCatelogueForm;
