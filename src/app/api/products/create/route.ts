import { db } from "@/db";
import { products, properties, variants } from "@/db/schema/products";
import { IProductProps } from "@/types/products";
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

    const body: IProductProps = await req.json();
    console.log(body);
    // const newProduct = await db
    //   .insert(products)
    //   .values({
    //     name: body.name,
    //     sellerId: payload.id,
    //     description: body.description,
    //   })
    //   .returning();
    // for (let i = 0; i < body.properties.length; i++) {
    //   body.properties[i].productId = newProduct[0].id;
    //   if (body.properties[i].id) delete body.properties[i].id;
    // }
    // const prodProperty = await db
    //   .insert(properties)
    //   .values(body.properties)
    //   .returning();
    // for (let i = 0; i < body.variants.length; i++) {
    //   body.variants[i].productId = newProduct[0].id;
    //   if (body.variants[i].id) delete body.properties[i].id;
    // }
    // const prodVariants = await db.insert(variants).values(body.variants);
    return new NextResponse("Posted");
  } catch (error) {
    return new NextResponse(JSON.stringify(error));
  }
};
