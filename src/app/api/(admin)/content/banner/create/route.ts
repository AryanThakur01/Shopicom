import { db } from "@/db";
import { contents } from "@/db/schema/dynamicContent";
import { jwtDecoder } from "@/utils/api/helpers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "admin") throw new Error("ADMIN ONLY ROUTE");

    const body: string = await req.text();

    const image = await db
      .insert(contents)
      .values({ tag: "home_banner", image: body })
      .returning();
    return NextResponse.json({ data: image }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json(
      { error: "Error: /api/content/banner/create" },
      { status: 500 },
    );
  }
};

// TESTING
export const GET = async () => {
  try {
    const res = await db
      .insert(contents)
      .values({ tag: "home_banner", title: "NEXTJS" })
      .returning();
    return NextResponse.json({ data: res }, { status: 400 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json(
      { error: "Error: /api/content/create" },
      { status: 500 },
    );
  }
};
