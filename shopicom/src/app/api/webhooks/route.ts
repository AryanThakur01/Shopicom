import { db } from "@/db";
import { orders } from "@/db/schema/orders";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  try {
    // ---------- Variables
    const signature = req.headers.get("stripe-signature");
    const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
      apiVersion: "2023-10-16",
    });
    const endpointSecret = process.env.STRIPE_END_POINT_SECRET || "";
    const body = await req.text();
    // ---------------------

    if (!signature) throw new Error("Didn't recieve stripe signature");

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret,
    );

    switch (event.type) {
      case "payment_intent.created":
        break;

      case "payment_intent.succeeded":
        const shipping = event.data.object.shipping;
        await db
          .update(orders)
          .set({
            name: shipping?.name,
            address: JSON.stringify(shipping?.address),
            phone: `${shipping?.phone}`,
            paymentStatus: event.data.object.status,
          })
          .where(eq(orders.paymentIntentId, event.data.object.id));
        break;

      case "charge.succeeded":
        console.log("Charge Success");
        break;

      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ received: false }, { status: 400 });
  }
};
