import { NextRequest, NextResponse } from "next/server";
import { jwtDecoder } from "@/utils/api/helpers";
import { db } from "@/db";
import { images } from "@/db/schema/products";
import { UploadBlobToCloudinary } from "@/utils/helpers/cloudinary";

export const POST = async (req: NextRequest) => {
  try {
    const variantId = Number(req.nextUrl.searchParams.get("variantId"));
    const token = req.cookies.get("Session_Token")?.value;
    if (!variantId) throw new Error("VariantId Not Provided");
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller" && payload.role !== "admin")
      throw new Error("You Don't have a seller account make one to continue");

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) throw new Error("Blob File Not Found");
    const [fileType, fileExtension] = file.type.split("/");
    if (fileType !== "image") throw new Error("File Should be an image");
    const fileName = `image_${variantId + "." + fileExtension}`;

    const Image = await UploadBlobToCloudinary(fileName, file, variantId);

    const newImg = await db
      .insert(images)
      .values({ variantId, value: Image.secure_url })
      .returning();

    return NextResponse.json({ ...newImg[0] }, { status: 200 });
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
