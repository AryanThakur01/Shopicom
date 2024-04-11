import { db } from "@/db";
import { products } from "@/db/schema/products";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get("name");
    if (!name) throw new Error("Product 'name' query required");

    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
    const pattern = new RegExp(escapedName, "i"); // 'i' flag for case-insensitive matching

    const data = await db.select().from(products);
    const filteredProducts = data.filter((product) => {
      return pattern.test(product.name);
    });
    const searchResult = filteredProducts.map((item) => {
      return { name: item.name, id: item.id };
    });
    return NextResponse.json({ data: searchResult }, { status: 200 });
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
