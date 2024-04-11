import { db } from "@/db";
import { newProduct, product, products } from "@/db/schema/products";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecoder } from "@/utils/api/helpers";
import { and, eq } from "drizzle-orm";

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");
    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller" && payload.role !== "admin")
      throw new Error("You Don't have a seller account make one to continue");

    const body: newProduct = await req.json();
    const productId = body.id;
    delete body.id;

    /* INSERT: New Product */
    await db
      .update(products)
      .set({ ...body })
      .where(
        and(
          eq(products.id, Number(productId)),
          eq(products.sellerId, Number(payload.id)),
        ),
      )
      .returning();

    return new NextResponse("Posted");
  } catch (error) {
    if (error instanceof Error)
      return new NextResponse(error.message, { status: 400 });
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
