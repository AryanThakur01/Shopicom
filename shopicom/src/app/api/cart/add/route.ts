import { db } from "@/db";
import { carts } from "@/db/schema/carts";
import { jwtDecoder } from "@/utils/api/helpers";
import { DrizzleError, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");

    const body = await req.json();

    await db
      .insert(carts)
      .values({
        itemId: body.itemId,
        variantId: body.variantId,
        userId: payload.id,
      })
      .returning();

    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, payload.id));

    return NextResponse.json({ data: cart });
  } catch (error) {
    console.log(error);
    if (error instanceof DrizzleError)
      return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
