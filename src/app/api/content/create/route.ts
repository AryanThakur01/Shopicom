import { db } from "@/db";
import { contents } from "@/db/schema/dynamicContent";
import { NextRequest, NextResponse } from "next/server";

export const POST = () => {
  try {
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error }, { status: 400 });
    return NextResponse.json(
      { error: "Error: /api/content/create" },
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
