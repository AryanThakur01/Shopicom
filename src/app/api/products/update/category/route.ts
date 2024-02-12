import { queryClient } from "@/db";
import { categories } from "@/db/schema/products";
import { jwtDecoder } from "@/utils/api/helpers";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, _: NextResponse) => {
  try {
    const db = drizzle(queryClient);
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller" && payload.role !== "admin")
      throw new Error("You Don't have a seller account make one to continue");

    const queries = new URL(req.url).searchParams;
    const productId = Number(queries.get("product_id"));
    const tag = queries.get("tag");
    if (!productId || !tag || isNaN(productId))
      throw new Error("Pass in the 'product_id' and 'tag'");
    if (tag !== "sponsored" && tag !== "best seller")
      throw new Error("tag is either 'sponsored' or 'best seller'");

    const findUnique = await db
      .select({})
      .from(categories)
      .where(and(eq(categories.productId, productId), eq(categories.tag, tag)));
    if (findUnique.length !== 0)
      throw new Error(`Product Already listed as ${tag}`);

    const category = await db
      .insert(categories)
      .values({ productId: productId, tag: tag })
      .returning();

    return NextResponse.json({ data: category });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    else
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
  }
};

// ------------------------------ TEST ROUTE --------------------------------
export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    return NextResponse.json({ data: "Success" });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    else
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
  }
};
