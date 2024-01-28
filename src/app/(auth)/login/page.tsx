"use client";
import FormField from "@/components/FormField";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuLock, LuMail } from "react-icons/lu";
import * as zod from "zod";
import { FaApple, FaGoogle } from "react-icons/fa";

interface IFormInput {
  email: string;
  password: string;
}
const schema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const submitHandler: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };
  return (
    <section className="bg-background h-screen min-h-fit text-foreground flex flex-col container">
      <div className="my-auto md:w-1/3 w-full mx-auto bg-card p-4 rounded-lg">
        <h1 className="text-center text-2xl">Welcome Back</h1>
        <h2 className="text-center text-xs text-muted-foreground my-2">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="text-foreground">
            Sign up
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
          >
            Login
          </button>
        </form>
        <div className="flex items-center gap-4 text-muted-foreground my-8">
          <hr className="border border-border w-full" />
          <p>OR</p>
          <hr className="border border-border w-full" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <button className="bg-muted rounded-lg h-10 drop-shadow-md">
            <FaApple className="mx-auto" />
          </button>
          <button className="bg-muted rounded-lg h-10">
            <FaGoogle className="mx-auto" />
          </button>
          <button className="bg-muted rounded-lg h-10 drop-shadow-md">
            <XIcon />
          </button>
        </div>
      </div>
    </section>
  );
};
const XIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 256 256"
      className="size-4 fill-foreground mx-auto"
    >
      <defs></defs>
      <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
        <path
          d="M 0.219 2.882 l 34.748 46.461 L 0 87.118 h 7.87 l 30.614 -33.073 l 24.735 33.073 H 90 L 53.297 38.043 L 85.844 2.882 h -7.87 L 49.781 33.341 L 27.001 2.882 H 0.219 z M 11.793 8.679 h 12.303 L 78.425 81.32 H 66.122 L 11.793 8.679 z"
          transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default Login;
