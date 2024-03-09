import { db, dbDriver } from "@/db";
import { variants } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { jwtDecoder } from "../api/helpers";
import { carts } from "@/db/schema/carts";

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
  products.map((item) => {
    amount += item.variant.discountedPrice;
  });

  const sessId = req.cookies.get("stripe_payment.session-id")?.value;
  if (sessId) {
    const sess = await stripe.paymentIntents.retrieve(sessId);
    if (sess.amount === amount * 100 && sess.status !== "succeeded")
      return sess;
  }

  return await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
  });
};

const singleProduct = async (
  req: NextRequest,
  variantId: number,
  qty: number,
) => {
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

  return await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
  });
};

export default { cart, singleProduct };
