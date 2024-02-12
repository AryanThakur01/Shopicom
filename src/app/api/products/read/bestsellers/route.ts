import { dbDriver } from "@/db";
import { categories } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, _: NextResponse) => {
  try {
    const url = new URL(req.url);
    const page: number = Number(url.searchParams.get("page"));
    const limit: number = Number(url.searchParams.get("limit"));
    const bestSellers = await dbDriver.query.categories.findMany({
      where: eq(categories.tag, "best seller"),
      with: {
        product: {
          with: {
            variants: {
              with: {
                images: true,
              },
            },
          },
        },
      },
      limit: !limit ? 10 : limit,
      offset: !page ? 0 : (page - 1) * 10,
    });
    return NextResponse.json({ bestSellers }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    } else
      return NextResponse.json(
        { error: "ERROR-API: /api/products/read/bestsellers" },
        { status: 500 },
      );
  }
};
