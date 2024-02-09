import { dbDriver, queryClient } from "@/db";
import { images, products, properties, variants } from "@/db/schema/products";
import { IProductProps } from "@/types/products";
import { jwtDecoder } from "@/utils/api/helpers";
import { productJoinMerger } from "@/utils/products";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, _: NextResponse) => {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");
    const db = drizzle(queryClient);
    const token = cookies().get("Session_Token")?.value;
    if (!token) throw new Error("Log in to continue");

    const jwtPayload = jwtDecoder(token);
    if (typeof jwtPayload === "string") throw new Error("Incorrect token");
    // const allProducts = await dbDriver.query.products.findMany({
    //   with: {
    //     properties: true,
    //     variants: {
    //       with: {
    //         images: true,
    //       },
    //     },
    //   },
    // });

    const allProducts = await db
      .select()
      .from(products)
      .where(
        productId
          ? and(
              eq(products.sellerId, jwtPayload.id),
              eq(products.id, Number(productId)),
            )
          : eq(products.sellerId, jwtPayload.id),
      )
      .innerJoin(variants, eq(products.id, variants.productId))
      .innerJoin(images, eq(variants.id, images.variantId));
    // .innerJoin(properties, eq(properties.productId, products.id));

    if (allProducts.length === 0) return new NextResponse(JSON.stringify([]));
    const productList: IProductProps[] = productJoinMerger(
      allProducts,
      jwtPayload.id,
    );

    return new NextResponse(JSON.stringify(productList));
    // return new NextResponse(JSON.stringify(allProducts));
  } catch (error) {
    console.log("ERROR-API: /api/products/read/myproducts");
    return NextResponse.json(
      { error: "ERROR-API: /api/products/read/myproducts" },
      { status: 500 },
    );
  }
};
