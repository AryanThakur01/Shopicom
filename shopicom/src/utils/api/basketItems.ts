import { db } from "@/db";
import { orders } from "@/db/schema/orders";
import { variants } from "@/db/schema/products";
import { eq } from "drizzle-orm";

export const lockProducts = async (sessionId: string) => {
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
      .select({
        orders: variants.orders,
        stock: variants.stock,
        id: variants.id,
      })
      .from(variants)
      .where(eq(variants.id, item.variantId));
    if (curVariant[0].stock - userOrders[0].qty <= 0)
      throw new Error("Product Out Of Stock");
    await db
      .update(variants)
      .set({
        orders: curVariant[0].orders + userOrders[0].qty,
        stock: curVariant[0].stock - userOrders[0].qty,
      })
      .where(eq(variants.id, curVariant[0].id));
  });
};

export const cancelOrder = async (sessionId: string) => {
  const userOrders = await db
    .update(orders)
    .set({ isLocked: false })
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
      orders: curVariant[0].orders - userOrders[0].qty,
      stock: curVariant[0].stock + userOrders[0].qty,
    });
  });
};
