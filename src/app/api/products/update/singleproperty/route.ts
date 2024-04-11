import { db } from "@/db";
import { newProperty, properties, property } from "@/db/schema/products";
import { jwtDecoder } from "@/utils/api/helpers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller" && payload.role !== "admin")
      throw new Error("You Don't have a seller account make one to continue");

    const body: newProperty = await req.json();
    const prop = await db
      .insert(properties)
      .values({
        key: body.key,
        value: body.value,
        productId: body.productId,
        id: body.id,
      })
      .onConflictDoUpdate({
        target: properties.id,
        set: { key: body.key, value: body.value },
      })
      .returning();
    return NextResponse.json({ ...prop[0] });
  } catch (error) {
    return NextResponse.json({ error: "Some Error Occured" });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const propertyId = Number(req.nextUrl.searchParams.getAll("propertyId"));
    if (isNaN(propertyId)) throw new Error("'variantId' Not not a number");
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller" && payload.role !== "admin")
      throw new Error("You Don't have a seller account make one to continue");

    const removed = await db
      .delete(properties)
      .where(eq(properties.id, propertyId))
      .returning();

    return NextResponse.json({ ...removed[0] });
  } catch (error) {
    return NextResponse.json({ error: "Some Error Occured" });
  }
};
