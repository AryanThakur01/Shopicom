import { db, dbDriver } from "@/db";
import { variants } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { jwtDecoder } from "../api/helpers";
import { carts } from "@/db/schema/carts";
import { orders } from "@/db/schema/orders";
import { JwtPayload } from "jsonwebtoken";
interface orderList {
  variantId: number;
  qty: number;
}
const createOrder = async (
  paymentIntent: Stripe.Response<Stripe.PaymentIntent>,
  variantsList: orderList[],
  customerId?: number,
) => {
  const shipping = paymentIntent.shipping;
  const address = shipping?.address;
  variantsList.map(async (item) => {
    await db
      .insert(orders)
      .values({
        name: shipping?.name || "processing",
        phone: shipping?.phone || "processing",
        address: JSON.stringify(address) || "processing",
        paymentAmount: paymentIntent.amount,
        paymentStatus: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
        productVariantId: item.variantId,
        qty: item.qty,
        customerId: customerId,
      })
      .returning();
  });
};

const cart = async (req: NextRequest) => {
  const token = req.cookies.get("Session_Token")?.value;
  if (!token) throw new Error("Token Not Found");
  const payload = jwtDecoder(token);
  if (!payload.id || !payload.role)
    throw new Error("Session Token role or id missing");

  const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
    apiVersion: "2023-10-16",
  });

  const products = await dbDriver.query.carts.findMany({
    where: eq(carts.userId, payload.id),
    with: {
      variant: true,
    },
  });

  let amount = 0;
  let orderedVariants: orderList[] = [];
  products.map((item) => {
    amount += item.variant.discountedPrice;
    orderedVariants.push({ variantId: item.variant.id, qty: 1 });
  });

  const sessId = req.cookies.get("stripe_payment.session-id")?.value;
  if (sessId) {
    const sess = await stripe.paymentIntents.retrieve(sessId);
    if (sess.amount === amount * 100 && sess.status !== "succeeded")
      return sess;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
  });
  createOrder(paymentIntent, orderedVariants, payload.id);
  return paymentIntent;
};

const singleProduct = async (
  req: NextRequest,
  variantId: number,
  qty: number,
) => {
  const token = req.cookies.get("Session_Token")?.value;
  let payload: JwtPayload | null = null;
  if (token) {
    payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
    apiVersion: "2023-10-16",
  });
  const productVariant = await db
    .select()
    .from(variants)
    .where(eq(variants.id, variantId));

  const amount = productVariant[0].discountedPrice * qty;

  const sessId = req.cookies.get("stripe_payment.session-id")?.value;
  if (sessId) {
    const sess = await stripe.paymentIntents.retrieve(sessId);
    if (sess.amount === amount * 100 && sess.status !== "succeeded")
      return sess;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
  });
  createOrder(paymentIntent, [{ variantId, qty }], payload?.id);
  return paymentIntent;
};

export default { cart, singleProduct };
