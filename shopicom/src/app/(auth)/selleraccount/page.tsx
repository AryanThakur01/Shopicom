"use client";
import { useSelector } from "@/lib/redux";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  sellerVerifySchema,
  type TFormInput,
} from "@/lib/schemas/sellerVerify";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/FormField";

const page = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user.value);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: zodResolver(sellerVerifySchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      profilePic: user.profilePic || "",
    },
  });

  const router = useRouter();
  useEffect(() => {
    if (user.role === "seller" || user.role === "admin") router.back();
  }, [user]);

  const submitHandler: SubmitHandler<TFormInput> = async (data) => {
    setSubmitting(true);
    try {
      //   const body = { ...data };
      //   const config = { method: "POST", body: JSON.stringify(body) };
      //   const res = await fetch("/api/login", config);
      //   if (!res.ok) throw new Error((await res.json()).error);
      //   dispatch(userDataAsync());
      //   router.push("/");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    }
    setSubmitting(false);
  };
  return (
    <section className="container max-w-[32rem] border border-border mt-[calc(50vh-2.5rem)] -translate-y-[50%] min-h-[70vh]">
      <h1 className="my-4 text-center font-bold text-xl">Become A Seller</h1>
      <FormField uni="firstName" type="text" register={register} />
    </section>
  );
};

export default page;
