import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/login", "/register"];
const privateRoutes = ["/dashboard/*"];

export async function middleware(request: NextRequest) {
  const url = new URL(request.url, request.url);
  const cookie = cookies().get("Session_Token");

  if (protectedRoutes.includes(url.pathname) && !!cookie)
    return NextResponse.redirect(new URL("/", request.url));

  for (const path of privateRoutes) {
    if (url.pathname.match(path) && !cookie)
      return NextResponse.redirect(new URL("/login", request.url));
  }
}
