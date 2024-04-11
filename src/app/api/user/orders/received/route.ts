import { db } from "@/db";
import { jwtDecoder } from "@/utils/api/helpers";
import { eq, DrizzleError } from "drizzle-orm";
import { orders } from "@/db/schema/orders";
import { NextRequest, NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";

export const PATCH = async (req: NextRequest) => {
  try {
    const q = req.nextUrl.searchParams.get("order_id");
    if (!q) throw new Error("'order_id' query necessary");
    const token = req.cookies.get("Session_Token")?.value;
    let payload: JwtPayload | null = null;
    if (token) {
      payload = jwtDecoder(token);
    }

    const myOrders = await db
      .update(orders)
      .set({
        deliveryStatus: "received",
      })
      .where(eq(orders.id, Number(q)))
      .returning();
    return NextResponse.json({ data: myOrders });
  } catch (error) {
    console.log(error);
    if (error instanceof DrizzleError)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
