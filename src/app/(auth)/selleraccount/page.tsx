"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { sellerVerifySchema } from "@/lib/schemas/sellerVerify";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/FormField";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  useGetProfileQuery,
  useVerifysellerMutation,
} from "@/lib/redux/services/user";

interface IFormInput {
  firstName: string;
  lastName: string;
}
const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");
  const { data: user } = useGetProfileQuery();
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [sellerVerify, verifyRest] = useVerifysellerMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(sellerVerifySchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  useEffect(() => {
    if (user?.role === "seller" || user?.role === "admin") router.back();
    setImage(user?.profilePic || "");
  }, [user]);

  const submitHandler: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      if (!image) throw new Error("Please Upload the image first");
      if (!form.current) throw new Error("No form found");
      const body = {
        firstName: data.firstName,
        lastName: data.lastName,
        profilePic: image,
      };
      await sellerVerify(body).unwrap();
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Something went wrong");
    }
    setIsLoading(false);
  };
  return (
    <section className="container max-w-[20rem] border border-border mt-4 min-h-[70vh]">
      <h1 className="my-4 text-center font-bold text-xl">Become A Seller</h1>
      <hr className="border-border my-4 mb-8" />
      <form
        className="w-full flex justify-center flex-col"
        onSubmit={handleSubmit(submitHandler)}
        ref={form}
      >
        <div className="flex flex-col">
          <div className="border-dashed border-border mb-4 w-full rounded overflow-hidden">
            {image.length ? (
              <Image
                src={image}
                alt={user?.firstName + " " + user?.lastName}
                height={400}
                width={400}
              />
            ) : (
              <UploadDropzone
                appearance={{
                  label: {
                    fontSize: "10px",
                    lineHeight: "0.8rem",
                    marginBlock: "2px",
                    color: "hsl(var(--primary))",
                  },
                  button: {
                    marginTop: "5px",
                    backgroundColor: "hsl(var(--primary))",
                    paddingInline: "1rem",
                    borderRadius: "2px",
                    height: "2rem",
                  },
                  allowedContent: { fontSize: "10px" },
                }}
                onClientUploadComplete={(res) => {
                  setImage(res[0].url);
                }}
                endpoint="imageUploader"
                className="min-h-56"
              />
            )}
          </div>
          <FormField
            uni="firstName"
            type="text"
            placeholder="First Name"
            containerClass="w-full my-4"
            register={register}
          />
          <FormField
            uni="lastName"
            type="text"
            placeholder="Last Name"
            containerClass="mt-auto w-full"
            register={register}
          />
        </div>
        <button className="mx-auto my-8 bg-primary p-2 w-40 rounded text-lg" disabled={isLoading}>
          {isLoading ? "Loading..." : "Become Seller"}
        </button>
      </form>
    </section>
  );
};

export default Page;
