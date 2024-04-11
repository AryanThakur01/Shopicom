import { db } from "@/db";
import { newProperty, products, properties } from "@/db/schema/products";
import { productSchema_v2 } from "@/lib/schemas/products_v2";
import { jwtDecoder } from "@/utils/api/helpers";
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

    const body = productSchema_v2.parse(await req.json());
    /* INSERT: New Product */
    const newProduct = await db
      .insert(products)
      .values({ ...body, sellerId: payload.id })
      .returning();

    const insertProperties: newProperty[] = body.properties.map((item) => ({
      ...item,
      productId: newProduct[0].id,
    }));
    const newProperties = await db
      .insert(properties)
      .values(insertProperties)
      .returning();

    // for (const variant of body.variants) {
    //   const prodVariants = await db
    //     .insert(variants)
    //     .values({
    //       productId: newProduct[0].id,
    //       discountedPrice: Number(variant.discountedPrice),
    //       price: Number(variant.price),
    //       orders: Number(variant.orders),
    //       stock: Number(variant.stock),
    //       color: variant.color,
    //     })
    //     .returning();
    //   const insertImages: newImage[] = variant.images.map((img) => ({
    //     value: typeof img.value === "string" ? img.value : "",
    //     variantId: prodVariants[0].id,
    //   }));
    //   let prodImages = await
    //   db.insert(images).values(insertImages).returning();
    // }
    return NextResponse.json({
      data: { newProduct: newProduct[0], newProperties },
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      { error: "Something went wrong, it's not you, it's us" },
      { status: 500 },
    );
  }
};
