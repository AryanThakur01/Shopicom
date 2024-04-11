import { db } from "@/db";
import { carts } from "@/db/schema/carts";
import { jwtDecoder } from "@/utils/api/helpers";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { DrizzleError, and, eq } from "drizzle-orm";

export const DELETE = async (req: NextRequest) => {
  try {
    // Check Required Delete Param
    const del = req.nextUrl.searchParams.get("delete");
    if (!del || (del !== "one" && del !== "all"))
      throw new Error("delete query required, value = 'one' or 'all'");

    // Verify User
    const token = cookies().get("Session_Token")?.value;
    if (!token) throw new Error("Log in to continue");
    const jwtPayload = jwtDecoder(token);
    if (typeof jwtPayload === "string") throw new Error("Incorrect token");
    const userId = jwtPayload.id;

    // Delete All
    if (del === "all") {
      const data = await db
        .delete(carts)
        .where(eq(carts.userId, userId))
        .returning();
      return NextResponse.json({ data });
    }

    // Delete One
    const idParam = req.nextUrl.searchParams.get("id");
    console.log(idParam);
    if (!idParam) throw new Error("'id' param of type number is required");

    const id = Number(idParam);
    const data = await db
      .delete(carts)
      .where(and(eq(carts.id, id), eq(carts.userId, userId)))
      .returning();
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof DrizzleError)
      return NextResponse.json({ error: error.message }, { status: 400 });
    else if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
