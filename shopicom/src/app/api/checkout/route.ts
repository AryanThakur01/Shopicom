import { NextRequest, NextResponse } from "next/server";
import intentGenerator from "@/utils/helpers/paymentIntentGenerator";

export const GET = async (req: NextRequest) => {
  try {
    const variantId = Number(req.nextUrl.searchParams.getAll("variantId"));
    const qty = Number(req.nextUrl.searchParams.getAll("qty"));
    const cart = req.nextUrl.searchParams.get("cart");

    if (cart) {
      const paymentIntent = await intentGenerator.cart(req);
      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
    } else if (variantId || qty) {
      const paymentIntent = await intentGenerator.singleProduct(
        Number(variantId),
        Number(qty),
      );

      return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } else {
      throw new Error(
        `either 'cart' or "'variantId' & 'qty'" are required query`,
      );
    }
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(
      { error: `Inernal Sever Error, Check Console` },
      { status: 500 },
    );
  }
};
