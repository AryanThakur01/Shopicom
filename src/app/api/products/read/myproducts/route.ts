import { dbDriver } from "@/db";
import { products } from "@/db/schema/products";
import { jwtDecoder } from "@/utils/api/helpers";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, _: NextResponse) => {
  try {
    const url = new URL(req.url);
    const token = cookies().get("Session_Token")?.value;
    if (!token) throw new Error("Log in to continue");
    const prodId = url.searchParams.get("productId");

    const jwtPayload = jwtDecoder(token);
    if (typeof jwtPayload === "string") throw new Error("Incorrect token");
    if (!prodId) {
      const allProducts = await dbDriver.query.products.findMany({
        with: {
          properties: true,
          variants: {
            with: {
              images: true,
            },
          },
        },
      });
      return new NextResponse(JSON.stringify(allProducts));
    }
    const allProducts = await dbDriver.query.products.findFirst({
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
    return NextResponse.json(
      { error: "ERROR-API: /api/products/read/myproducts" },
      { status: 500 },
    );
  }
};
