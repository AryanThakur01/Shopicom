import { queryClient } from "@/db";
import {
  images,
  product,
  products,
  properties,
  property,
  variant,
  variants,
} from "@/db/schema/products";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecoder } from "@/utils/api/helpers";
import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq } from "drizzle-orm";
import { carts } from "@/db/schema/cart";

interface IReqVariant extends variant {
  images?: {
    id: number;
    variantId: number;
    value: string;
  }[];
}
interface IUpdatedProps {
  general: product;
  properties: property[];
  variants: IReqVariant[];
}

export const POST = async (req: NextRequest) => {
  try {
    const db = drizzle(queryClient);
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "seller" && payload.role !== "admin")
      throw new Error("You Don't have a seller account make one to continue");

    const body: IUpdatedProps = await req.json();
    const generalDetails = body.general;
    // This is condition check is so that user modifies product only he owns it
    if (
      !generalDetails.id ||
      !generalDetails.sellerId ||
      generalDetails.sellerId !== payload.id
    )
      throw new Error(
        "should contain id(of prod), sellerId & sellerId === id(of seller)",
      );

    /* INSERT: New Product */
    const newProduct = await db
      .update(products)
      .set({ ...generalDetails })
      .where(
        and(
          eq(products.id, Number(generalDetails.id)),
          eq(products.sellerId, Number(generalDetails.sellerId)),
        ),
      )
      .returning();

    for (const prop of body.properties) {
      if (prop.id)
        await db
          .update(properties)
          .set(prop)
          .where(eq(properties.id, Number(prop.id)));
      else
        await db
          .insert(properties)
          .values({ ...prop, productId: newProduct[0].id })
          .returning();
    }

    for (const variant of body.variants) {
      const imgList = [...(variant.images || [])];
      delete variant.images;
      const newVariant = variant.id
        ? await db
            .update(variants)
            .set({ ...variant })
            .where(
              and(
                eq(variants.id, variant.id),
                eq(variants.productId, newProduct[0].id),
              ),
            )
            .returning()
        : await db
            .insert(variants)
            .values({ ...variant, productId: newProduct[0].id })
            .returning();

      for (const img of imgList) {
        if (img.id)
          await db
            .update(images)
            .set({ ...img })
            .where(
              and(
                eq(images.id, img.id),
                eq(images.variantId, newVariant[0].id),
              ),
            );
        else
          await db
            .insert(images)
            .values({ ...img, variantId: newVariant[0].id });
      }
    }

    return new NextResponse("Posted");
  } catch (error) {
    if (error instanceof Error) return new NextResponse(error.message);
    return new NextResponse(JSON.stringify(error));
  }
};

// {
//   "general": {
//     "id": 21,
//     "name": "Four Apple",
//     "description": "Fourth Update sample apple",
//     "sellerId": 5
//   },
//   "properties": [
//     {
//       "id":53,
//       "key": "lola",
//       "value": "bhola agola",
//       "productId": 21
//     }
//   ],
//   "variants": [
//     {
//       "id": 38,
//       "color": "#c2362d",
//       "price": 999,
//       "discountedPrice": 499,
//       "stock": 400,
//       "orders": 100,
//       "images":[{"variantId":38,"id":227, "value": ""}],
//       "productId":21
//     }
//   ]
// }
