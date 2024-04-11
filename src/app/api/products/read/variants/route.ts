import { db } from "@/db";
import { variants } from "@/db/schema/products";
import { jwtDecoder } from "@/utils/api/helpers";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const productId = Number(req.nextUrl.searchParams.getAll("productId"));
    if (!productId) throw new Error("`productId` Query Required");
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");
    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller" && payload.role !== "admin")
      throw new Error("You Don't have a seller account make one to continue");

    const searchRes = await db.query.variants.findMany({
      where: eq(variants.productId, productId),
      with: {
        images: true,
      },
    });

    return NextResponse.json({ data: searchRes });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      { error: "Something went wrong, it's not you, it's us" },
      { status: 500 },
    );
  }
};
