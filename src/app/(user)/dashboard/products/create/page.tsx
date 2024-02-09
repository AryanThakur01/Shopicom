import ProductCatelogueForm from "@/components/dashboard/products/create/ProductCatelogueForm";
import React from "react";
import { getServerSession } from "@/utils/serverActions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const cookie = cookies().get("Session_Token")?.value;
  if (!cookie) redirect("/");
  const session = await getServerSession(cookie);
  if (session.role === "customer") redirect("/dashboard");
  return (
    <div>
      <h2 className="text-2xl font-bold p-1">Create A New Product</h2>
      <ProductCatelogueForm />
    </div>
  );
};

export default page;
