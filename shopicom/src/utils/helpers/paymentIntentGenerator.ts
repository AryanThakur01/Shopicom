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

  const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
    apiVersion: "2023-10-16",
  });
  return await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
  });
};

const singleProduct = async (variantId: number, qty: number) => {
  const productVariant = await db
    .select()
    .from(variants)
    .where(eq(variants.id, variantId));

  const amount = productVariant[0].discountedPrice * qty;

  const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
    apiVersion: "2023-10-16",
  });
  return await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
  });
};

export default { cart, singleProduct };
