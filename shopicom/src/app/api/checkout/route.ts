import { NextRequest, NextResponse } from "next/server";
import intentGenerator from "@/utils/helpers/paymentIntentGenerator";
import { cookies } from "next/headers";

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
    // paymentIntent.id;
    // paymentIntent.status;
    // paymentIntent.amount;
    // paymentIntent.shipping
    // interface Shipping {
    //   address?: Stripe.Address;
    //
    //   /**
    //    * The delivery service that shipped a physical product, such as Fedex, UPS, USPS, etc.
    //    */
    //   carrier?: string | null;
    //
    //   /**
    //    * Recipient name.
    //    */
    //   name?: string;
    //
    //   /**
    //    * Recipient phone (including extension).
    //    */
    //   phone?: string | null;
    //
    //   /**
    //    * The tracking number for a physical product, obtained from the delivery service. If multiple tracking numbers were generated for this purchase, please separate them with commas.
    //    */
    //   tracking_number?: string | null;
    // }
    // interface Address {
    //   /**
    //    * City/District/Suburb/Town/Village.
    //    */
    //   city: string | null;
    //
    //   /**
    //    * 2-letter country code.
    //    */
    //   country: string | null;
    //
    //   /**
    //    * Address line 1 (Street address/PO Box/Company name).
    //    */
    //   line1: string | null;
    //
    //   /**
    //    * Address line 2 (Apartment/Suite/Unit/Building).
    //    */
    //   line2: string | null;
    //
    //   /**
    //    * ZIP or postal code.
    //    */
    //   postal_code: string | null;
    //
    //   /**
    //    * State/County/Province/Region.
    //    */
    //   state: string | null;
    // }
    // products

    cookies().set({
      name: "stripe_payment.session-id",
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
