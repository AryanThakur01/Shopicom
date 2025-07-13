import { NextRequest, NextResponse } from "next/server";
import intentGenerator from "@/utils/helpers/paymentIntentGenerator";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; // Force dynamic rendering for this route
export const GET = async (req: NextRequest) => {
  try {
    const variantId = Number(req.nextUrl.searchParams.getAll("variantId"));
    const qty = Number(req.nextUrl.searchParams.getAll("qty"));
    const cart = req.nextUrl.searchParams.get("cart");

    if (!cart && !(variantId && qty)) {
      console.log(cart, variantId, qty);
      throw new Error(
        `either 'cart' or "'variantId' & 'qty'" are required query`,
      );
    }
    const paymentIntent = cart
      ? await intentGenerator.cart(req)
      : await intentGenerator.singleProduct(
          req,
          Number(variantId),
          Number(qty),
        );

    cookies().set({
      name: "stripe_payment.session-id",
      value: paymentIntent.id,
    });
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
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
