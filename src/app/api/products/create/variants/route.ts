import { db } from "@/db";
import { variants } from "@/db/schema/products";
import { variantsFormData } from "@/lib/schemas/products_v2";
import { jwtDecoder } from "@/utils/api/helpers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const variantId = Number(req.nextUrl.searchParams.getAll("variantId"));
    const productId = Number(req.nextUrl.searchParams.getAll("productId"));
    if (!productId) throw new Error("`productId` Parameter Required");
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller" && payload.role !== "admin")
      throw new Error("You Don't have a seller account make one to continue");

    const body = variantsFormData.parse(await req.json());
    const data = {
      productId,
      discountedPrice: Number(body.discountedPrice),
      color: body.color,
      price: Number(body.price),
      stock: Number(body.stock),
      orders: Number(body.orders),
      id: variantId && !isNaN(variantId) ? variantId : undefined,
    };
    const newVariant = await db
      .insert(variants)
      .values({ ...data })
      .onConflictDoUpdate({ target: variants.id, set: { ...data } })
      .returning();
    return NextResponse.json({ ...newVariant[0] }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      { error: "Something went wrong, it's not you, it's us" },
      { status: 500 },
    );
  }
};
