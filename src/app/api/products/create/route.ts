import { db } from "@/db";
import {
  images,
  newImage,
  newProduct,
  newProperty,
  products,
  properties,
  variants,
} from "@/db/schema/products";
import { IProductProps, TFormInput } from "@/types/products";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtDecoder } from "@/utils/api/helpers";

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");
    const payload: string | JwtPayload = jwtDecoder(token, req);
    if (typeof payload === "string")
      throw new Error("session token either string or has no expiry");
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller")
      throw new Error("You Don't have a seller account make one to continue");

    const body: IProductProps = await req.json();
    /* INSERT: New Product */
    const newProduct = await db
      .insert(products)
      .values({
        name: body.name,
        sellerId: payload.id,
        description: body.description,
      })
      .returning();

    const insertProperties: newProperty[] = body.properties.map((item) => ({
      ...item,
      productId: newProduct[0].id,
    }));
    const prodProperty = await db
      .insert(properties)
      .values(insertProperties)
      .returning();

    for (const variant of body.variants) {
      const prodVariants = await db
        .insert(variants)
        .values({
          productId: newProduct[0].id,
          discountedPrice: Number(variant.discountedPrice),
          price: Number(variant.price),
          color: variant.color,
        })
        .returning();
      const insertImages: newImage[] = variant.imageList.map((img) => ({
        value: img.value,
        variantId: prodVariants[0].id,
      }));
      let prodImages = await db.insert(images).values(insertImages).returning();
    }
    return new NextResponse("Posted");
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify(error));
  }
};
