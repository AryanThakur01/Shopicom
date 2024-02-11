import { getServerSession } from "@/utils/serverActions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const withAuth = (
  Component: any,
  allowed: Array<"seller" | "customer" | "admin">,
) => {
  const WithAuth = async (props: any) => {
    const cookie = cookies().get("Session_Token")?.value;
    if (!cookie) redirect("/");
    const session = await getServerSession(cookie);
    if (!allowed.includes(session.role)) redirect("/dashboard");

    return <Component {...props} />;
  };
  return WithAuth;
};

export default withAuth;
