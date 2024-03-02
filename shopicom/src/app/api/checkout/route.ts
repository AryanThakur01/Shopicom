import { db } from "@/db";
import { variants } from "@/db/schema/products";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";

export const GET = async (req: NextRequest) => {
  try {
    const variantId = Number(req.nextUrl.searchParams.getAll("variantId"));
    const qty = Number(req.nextUrl.searchParams.getAll("qty"));

    if (!variantId || !qty)
      throw new Error("'variantId', 'qty' are required query");

    const productVariant = await db
      .select()
      .from(variants)
      .where(eq(variants.id, variantId));

    const amount = productVariant[0].discountedPrice * qty;
    // if (qty > productVariant[0].stock) throw new Error("Product Out Of Stock");
    //
    // const newProductVariant = await db
    //   .update(variants)
    //   .set({ stock: productVariant[0].stock - 1 })
    //   .where(eq(variants.id, variantId))
    //   .returning();

    const stripe = new Stripe(process.env.STRIPE_SECRET || "");
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
    });

    return NextResponse.json({
      data: paymentIntent.client_secret,
      status: "Fetched",
      amount,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      { error: `Inernal Sever Error, Check Console` },
      { status: 500 },
    );
  }
};
