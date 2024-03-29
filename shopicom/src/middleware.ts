import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const hiddenRoutes = ["/login", "/register", "/purchases"];
const privateRoutes = ["/dashboard/*", "/cart"];

export async function middleware(request: NextRequest) {
  const url = new URL(request.url, request.url);
  const cookie = cookies().get("Session_Token")?.value;

  if (hiddenRoutes.includes(url.pathname) && !!cookie)
    return NextResponse.redirect(new URL("/", request.url));

  for (const path of privateRoutes) {
    if (url.pathname.match(path) && !cookie)
      return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
