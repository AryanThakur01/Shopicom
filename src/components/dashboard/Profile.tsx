"use client";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  LuBell,
  LuLoader2,
  LuMail,
  LuPencilLine,
  LuUser,
  LuX,
} from "react-icons/lu";
import * as Dialog from "@radix-ui/react-dialog";
import * as zod from "zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../FormField";
import Image from "next/image";
import { imageProcessor } from "@/utils/helpers/blobToStr";

const Profile = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold">Profile</h2>
      <div className="mx-auto h-32 w-32 bg-muted mt-8 rounded-full"></div>
      <h1 className="text-center text-xl mt-4">Aryan Thakur</h1>
      <div className="flex gap-4 justify-center my-4 text-muted-foreground">
        <ProfileDialog>
          <button className="rounded-full p-4 hover:bg-muted bg-card hover:text-foreground">
            <LuPencilLine className="size-5" />
          </button>
        </ProfileDialog>
        <button className="rounded-full p-4 hover:bg-muted bg-card hover:text-foreground">
          <LuMail className="size-5" />
        </button>
        <button className="rounded-full p-4 hover:bg-muted bg-card hover:text-foreground">
          <LuBell className="size-5" />
        </button>
      </div>
    </>
  );
};

interface IProfileDialog {
  children: React.ReactNode;
}
interface IFormInput {
  firstName: string;
  lastName: string;
  profilePic: FileList;
}
const schema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  profilePic: zod.custom<FileList>(),
});
const ProfileDialog: FC<IProfileDialog> = ({ children }) => {
  const [usrImg, setUsrImg] = useState<string>();
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setValue,
  } = useForm<IFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });
  const fetchProfileInfo = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/getprofile");
      const user = await res.json();
      console.log(user);
      if (user.firstName) setValue("firstName", user.firstName);
      if (user.lastName) setValue("lastName", user.lastName);
      if (user.profilePic) setUsrImg(user.profilePic);
    } catch (error) {
      console.log(error);
    }
  };
  const formWatch = useWatch({ control });
  const submitHandler: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    try {
      const image = await imageProcessor(data.profilePic[0] || usrImg || "");
      const user = await fetch("/api/user/updateprofile", {
        method: "POST",
        body: JSON.stringify({ ...data, profilePic: image }),
      });
      console.log(await user.json());
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (formWatch.profilePic && formWatch.profilePic[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(formWatch.profilePic[0]);
      reader.onload = (e) => {
        if (typeof e.target?.result !== "string") return;
        setUsrImg(e.target.result);
      };
    }
  }, [formWatch]);
  useEffect(() => {
    fetchProfileInfo();
  }, []);
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="absolute top-0 bg-black opacity-80 h-screen w-screen" />
        <Dialog.Content className="min-w-60 absolute bg-card p-4 rounded-lg -translate-x-1/2 left-1/2 top-[50vh] -translate-y-1/2 border border-border shadow-2xl">
          <div className="flex justify-between mb-8">
            <Dialog.Title className="text-xl">Edit profile</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-lg relative" aria-label="Close">
                <LuX />
              </button>
            </Dialog.Close>
          </div>
          <form
            className="my-2 flex flex-col gap-6"
            onSubmit={handleSubmit(submitHandler)}
          >
            <div className="flex md:flex-row flex-col items-center md:gap-2 gap-4">
              <label
                htmlFor="profilePic"
                className={
                  "outline-white grid h-40 w-40 bg-background rounded border border-muted overflow-hidden "
                }
              >
                <div className="h-0">
                  <input
                    type="file"
                    {...register("profilePic")}
                    className="h-40 w-full opacity-0 cursor-pointer relative z-10"
                  />
                </div>
                {usrImg && (
                  <Image
                    src={usrImg}
                    height={100}
                    width={100}
                    className="min-h-full min-w-full object-contain"
                    alt=""
                  />
                )}
              </label>
              <div className="flex flex-col gap-4">
                <FormField
                  type="text"
                  placeholder="First name"
                  uni="firstName"
                  register={register}
                  // icon={<LuUser className="size-5" />}
                  label="First Name"
                  labelClass="text-muted-foreground"
                />
                <FormField
                  type="text"
                  placeholder="Last Name"
                  uni="lastName"
                  register={register}
                  // icon={<LuUser className="size-5" />}
                  label="Last Name"
                  labelClass="text-muted-foreground"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary p-2 rounded w-40 ml-auto"
              disabled={loading}
            >
              {loading ? (
                <LuLoader2 className="animate-spin duration-300 mx-auto text-xl" />
              ) : (
                "Update"
              )}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Profile;
