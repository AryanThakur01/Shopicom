import { products } from "@/db/schema/products";
import { jwtDecoder } from "@/utils/api/helpers";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { dbDriver } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, _: NextResponse) => {
  try {
    const url = new URL(req.url);
    const page: number = Number(url.searchParams.get("page"));
    const sponsored = await dbDriver.query.categories.findMany({
      with: {
        product: true,
      },
      limit: 10,
      offset: !page ? 0 : (page - 1) * 10,
    });
    return NextResponse.json({ data: sponsored }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    } else
      return NextResponse.json(
        { error: "ERROR-API: /api/products/read/myproducts" },
        { status: 500 },
      );
  }
};
