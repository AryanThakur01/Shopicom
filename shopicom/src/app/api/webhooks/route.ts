import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  try {
    // ---------- Variables
    const signature = req.headers.get("stripe-signature");
    const stripe = new Stripe(process.env.STRIPE_SECRET || "", {
      apiVersion: "2023-10-16",
    });
    const endpointSecret =
      "whsec_c193d665cfb4d8e963d2054fdcf260005ddc6d801285c146f5eb023007d52783";
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
        break;

      case "charge.succeeded":
        break;

      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ received: false }, { status: 400 });
  }
};
