import { db } from "@/db";
import { images, products, variants } from "@/db/schema/products";
import { IProductProps } from "@/types/products";
import { jwtDecoder } from "@/utils/api/helpers";
import { productJoinMerger } from "@/utils/products";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const token = cookies().get("Session_Token")?.value;
    if (!token) throw new Error("Log in to continue");

    const jwtPayload = jwtDecoder(token);
    if (typeof jwtPayload === "string") throw new Error("Incorrect token");

    const allProducts = await db
      .select()
      .from(products)
      .where(eq(products.sellerId, jwtPayload.id))
      .innerJoin(variants, eq(products.id, variants.productId))
      .leftJoin(images, eq(variants.id, images.variantId));
    if (allProducts.length === 0) {
      return new NextResponse(JSON.stringify([]));
    }
    const productList: IProductProps[] = productJoinMerger(
      allProducts,
      jwtPayload.id,
    );

    return new NextResponse(JSON.stringify(productList));
  } catch (error) {
    console.log("ERROR ROUTE");
    return new NextResponse(JSON.stringify(error));
  }
};
