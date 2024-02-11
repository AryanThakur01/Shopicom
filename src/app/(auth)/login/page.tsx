"use client";
import FormField from "@/components/FormField";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuLoader, LuLock, LuMail } from "react-icons/lu";
import * as zod from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import OAuthLogin from "@/components/auth/OAuthLogin";
import { useDispatch, userDataAsync } from "@/lib/redux";

interface IFormInput {
  email: string;
  password: string;
}
const schema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });
  const dispatch = useDispatch();

  const submitHandler: SubmitHandler<IFormInput> = async (data) => {
    setSubmitting(true);
    try {
      const body = { ...data };
      const config = { method: "POST", body: JSON.stringify(body) };
      const res = await fetch("/api/login", config);
      if (!res.ok) throw new Error("Recheck Credentials");
      dispatch(userDataAsync());
      router.push("/");
    } catch (error) {
      console.log(error);
    }
    setSubmitting(false);
  };
  return (
    <section className="bg-background h-screen min-h-fit text-foreground flex flex-col container">
      <div className="my-auto md:w-1/3 w-full mx-auto bg-card p-4 rounded-lg">
        <h1 className="text-center text-2xl">Welcome Back</h1>
        <h2 className="text-center text-xs text-muted-foreground my-2">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="hover:underline text-primary">
            Register Now
          </Link>
        </h2>
        <form
          className="my-8 flex flex-col gap-4"
          onSubmit={handleSubmit(submitHandler)}
        >
          <FormField
            type="email"
            placeholder="email address"
            uni="email"
            register={register}
            icon={<LuMail className="size-5" />}
            error={errors.email?.message}
          />
          <FormField
            type="password"
            placeholder="Password"
            uni="password"
            register={register}
            icon={<LuLock className="size-5" />}
            error={errors.password?.message}
          />
          <button
            type="submit"
            className="bg-primary rounded-lg h-10 font-bold"
            disabled={submitting}
          >
            {submitting ? (
              <LuLoader className="animate-spin mx-auto size-5" />
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="flex items-center gap-4 text-muted-foreground my-8">
          <hr className="border border-border w-full" />
          <p>OR</p>
          <hr className="border border-border w-full" />
        </div>
        {/* <div className="grid grid-cols-3 gap-4"> */}
        {/*   <OAuthLogin /> */}
        {/* </div> */}
      </div>
    </section>
  );
};

export default Login;
