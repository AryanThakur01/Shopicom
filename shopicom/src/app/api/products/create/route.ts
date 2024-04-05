import { db } from "@/db";
import {
  images,
  newImage,
  newProperty,
  products,
  properties,
  variants,
} from "@/db/schema/products";
import { TFormInput } from "@/types/products";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecoder } from "@/utils/api/helpers";

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller" && payload.role !== "admin")
      throw new Error("You Don't have a seller account make one to continue");

    const body: TFormInput = await req.json();
    /* INSERT: New Product */
    const newProduct = await db
      .insert(products)
      .values({
        ...body,
        sellerId: payload.id,
      })
      .returning();
    // console.log(newProduct);

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
          orders: Number(variant.orders),
          stock: Number(variant.stock),
          color: variant.color,
        })
        .returning();
      const insertImages: newImage[] = variant.images.map((img) => ({
        value: typeof img.value === "string" ? img.value : "",
        variantId: prodVariants[0].id,
      }));
      let prodImages = await db.insert(images).values(insertImages).returning();
    }
    return new NextResponse("Posted");
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      {
        error: "Something went wrong, it's not you, it's us",
      },
      { status: 500 },
    );
  }
};
