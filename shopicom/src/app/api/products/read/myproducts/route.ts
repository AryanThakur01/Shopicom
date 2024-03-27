import { db } from "@/db";
import { products } from "@/db/schema/products";
import { jwtDecoder } from "@/utils/api/helpers";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const token = cookies().get("Session_Token")?.value;
    if (!token) throw new Error("Log in to continue");
    const prodId = url.searchParams.get("productId");

    const jwtPayload = jwtDecoder(token);
    if (typeof jwtPayload === "string") throw new Error("Incorrect token");

    const page: number = Number(url.searchParams.get("page"));
    if (!prodId) {
      const allProducts = await db.query.products.findMany({
        with: {
          properties: true,
          variants: {
            with: {
              images: true,
            },
          },
        },
        limit: 10,
        offset: !page ? 0 : (page - 1) * 10,
        where: eq(products.sellerId, Number(jwtPayload.id)),
      });
      return new NextResponse(JSON.stringify(allProducts.reverse()));
    }
    const allProducts = await db.query.products.findFirst({
      with: {
        properties: true,
        variants: {
          with: {
            images: true,
          },
        },
      },
      where: eq(products.id, Number(prodId)),
    });
    return new NextResponse(JSON.stringify(allProducts));
  } catch (error) {
    console.log("ERROR-API: /api/products/read/myproducts");
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      { error: "ERROR-API: /api/products/read/myproducts" },
      { status: 500 },
    );
  }
};
