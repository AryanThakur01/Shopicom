import { db } from "@/db";
import { carts } from "@/db/schema/carts";
import { jwtDecoder } from "@/utils/api/helpers";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Log in to continue");
    const jwtPayload = jwtDecoder(token);
    if (typeof jwtPayload === "string") throw new Error("Incorrect token");
    const userId = jwtPayload.id;

    // const cart = await db.select().from(carts).where(eq(carts.userId, userId));
    const cart = await db.query.carts.findMany({
      where: eq(carts.userId, userId),
      with: {
        item: true,
        variant: {
          with: {
            images: true,
          },
        },
      },
    });

    return NextResponse.json({ data: cart });
  } catch (error) {
    return NextResponse.json({});
  }
};
