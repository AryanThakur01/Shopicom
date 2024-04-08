import { NextRequest, NextResponse } from "next/server";
import { jwtDecoder } from "@/utils/api/helpers";
import { db } from "@/db";
import { images } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import { cloudinaryConfig } from "@/utils/helpers/cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinaryConfig();
export const DELETE = async (req: NextRequest) => {
  try {
    const imageId = Number(req.nextUrl.searchParams.get("imageId"));
    const token = req.cookies.get("Session_Token")?.value;
    if (!imageId) throw new Error("VariantId Not Provided");
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller" && payload.role !== "admin")
      throw new Error("You Don't have a seller account make one to continue");

    const img = await db
      .delete(images)
      .where(eq(images.id, imageId))
      .returning();

    const del = img[0];
    if (!del) throw new Error("No Such Image Found");
    let publicId =
      `Shopicom/${del.variantId}/` +
      del.value.split("/").reverse()[0].split(".")[0];

    const status = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ ...img, status }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      { error: "Something went wrong, it's not you, it's us" },
      { status: 500 },
    );
  }
};
