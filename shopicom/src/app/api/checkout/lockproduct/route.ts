import { db, dbDriver } from "@/db";
import { orders } from "@/db/schema/orders";
import { variants } from "@/db/schema/products";
import { DrizzleError, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const sessionId = cookies().get("stripe_payment.session-id")?.value;
    if (!sessionId) throw new Error("stripe_payment.session-id required");
    if (typeof sessionId !== "string")
      throw new Error("stripe_payment.session-id is not a string");

    const userOrders = await db
      .update(orders)
      .set({ isLocked: true })
      .where(eq(orders.paymentIntentId, sessionId))
      .returning({
        variantId: orders.productVariantId,
        qty: orders.qty,
        isLocked: orders.isLocked,
      });
    userOrders.map(async (item) => {
      const curVariant = await db
        .select({ orders: variants.orders, stock: variants.stock })
        .from(variants)
        .where(eq(variants.id, item.variantId));
      await db.update(variants).set({
        orders: curVariant[0].orders + userOrders[0].qty,
        stock: curVariant[0].stock - userOrders[0].qty,
      });
    });

    return NextResponse.json({ data: "success" });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof DrizzleError)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      { error: `Inernal Sever Error, Check Console` },
      { status: 500 },
    );
  }
};
