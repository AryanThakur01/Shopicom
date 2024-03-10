import { db } from "@/db";
import { NewContent, contents } from "@/db/schema/dynamicContent";
import { jwtDecoder } from "@/utils/api/helpers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const tag = "home_banner";
export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "admin") throw new Error("ADMIN ONLY ROUTE");

    const body: NewContent = await req.json();
    if (body.id) {
      const banner = await db
        .update(contents)
        .set({ ...body })
        .where(eq(contents.id, body.id))
        .returning();
      return NextResponse.json({ data: banner }, { status: 200 });
    } else {
      const banner = await db
        .insert(contents)
        .values({ ...body, tag })
        .returning();
      return NextResponse.json({ data: banner }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      { error: "Error: /api/content/banner - get" },
      { status: 500 },
    );
  }
};

// TESTING
export const GET = async () => {
  try {
    const res = await db.select().from(contents);
    return NextResponse.json({ data: res }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json(
      { error: "Error: /api/content/banner - get" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");
    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "admin") throw new Error("ADMIN ONLY ROUTE");

    const id = Number(url.searchParams.get("id"));
    if (isNaN(id)) throw new Error("Pass in 'id' in the correct format");

    const res = await db.delete(contents).where(eq(contents.id, id));
    return NextResponse.json({ data: res }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json(
      { error: "Error: /api/content/banner - get" },
      { status: 500 },
    );
  }
};
