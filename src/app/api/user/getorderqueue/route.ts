import { db } from "@/db";
import { jwtDecoder } from "@/utils/api/helpers";
import { eq, and } from "drizzle-orm";
import { orders } from "@/db/schema/orders";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");
    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role === "customer") throw new Error("You are no seller");

    const orderQueue = await db.query.orders.findMany({
      where: and(
        eq(orders.sellerId, payload.id),
        eq(orders.paymentStatus, "succeeded"),
      ),
      with: {
        product: {
          with: {
            images: true,
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ data: orderQueue });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
