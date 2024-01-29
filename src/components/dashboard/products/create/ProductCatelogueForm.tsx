"use client";
import React from "react";
import FormField from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";

interface IFormInput {
  name: string;
  password: string;
}
const schema = zod.object({
  name: zod.string(),
  password: zod.string().min(8),
});

const ProductCatelogueForm = () => {
  // Name of the product
  // Price
  // Description
  // Variants
  // -------> Sizes
  // -------> Colors
  // Stars
  // Stock
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      password: "",
    },
  });
  const submitHandler: SubmitHandler<IFormInput> = async (data) => {};
  return (
    <form
      className="my-8 flex flex-col gap-4"
      onSubmit={handleSubmit(submitHandler)}
    >
      <FormField
        type="text"
        placeholder="Enter the name of the Product"
        uni="name"
        register={register}
        // icon={<LuMail className="size-5" />}
        error={errors.name?.message}
        containerClass="border border-muted"
      />
      {/* <FormField */}
      {/*   type="password" */}
      {/*   placeholder="Password" */}
      {/*   uni="password" */}
      {/*   register={register} */}
      {/*   icon={<LuLock className="size-5" />} */}
      {/*   error={errors.password?.message} */}
      {/* /> */}
      {/* <button */}
      {/*   type="submit" */}
      {/*   className="bg-primary rounded-lg h-10 font-bold" */}
      {/*   disabled={submitting} */}
      {/* > */}
      {/*   {submitting ? ( */}
      {/*     <LuLoader className="animate-spin mx-auto size-5" /> */}
      {/*   ) : ( */}
      {/*     "Login" */}
      {/*   )} */}
      {/* </button> */}
    </form>
  );
};

export default ProductCatelogueForm;
