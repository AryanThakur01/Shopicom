import { NextRequest, NextResponse } from "next/server";
import intentGenerator from "@/utils/helpers/paymentIntentGenerator";

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
      : await intentGenerator.singleProduct(Number(variantId), Number(qty));

    req.cookies.set({
      name: "stripe_payment_session-id",
      value: paymentIntent.id,
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      { error: `Inernal Sever Error, Check Console` },
      { status: 500 },
    );
  }
};
