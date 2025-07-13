import { db } from "@/db";
import {
  images,
  products,
  properties,
  variants,
  categories,
} from "@/db/schema/products";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecoder } from "@/utils/api/helpers";
import { faker } from "@faker-js/faker";

// Force dynamic rendering
export const dynamic = "force-dynamic";

/* ------------------------------- API HANDLER ------------------------------- */
export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload?.id || payload?.role !== "admin") {
      throw new Error("ADMIN ONLY ROUTE");
    }

    const url = new URL(req.url);
    const count = Number(url.searchParams.get("count"));
    const sellerId = Number(url.searchParams.get("seller_id"));

    if (!count || !sellerId) {
      throw new Error('Missing "count" or "seller_id" in query');
    }

    await seed(sellerId, count);

    return NextResponse.json("Products seeded successfully");
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
};

async function seed(sellerId: number, count: number) {
  const res = await fetch(`https://dummyjson.com/products?limit=${count}&select=title,description,price,discountPercentage,stock,images,tags`);
  const data = await res.json();

  let counter = 0
  for (const item of data.products) {
    const insertedProduct = await db
      .insert(products)
      .values({
        name: item.title,
        description: item.description,
        sellerId,
      })
      .returning({ id: products.id });

    const productId = insertedProduct[0].id;

    // Add a fake property or two
      await db.insert(properties).values([
        { key: "brand", value: item.brand || "Unknown", productId },
        { key: "rating", value: item.rating?.toString() || "0", productId },
      ]);

    // Add a category based on tags
    if (counter % 2 === 0 && counter < 35) {
      const random1Or2 = (Math.random() < 0.5);
      await db.insert(categories).values({
        tag: !random1Or2? "best seller" : "sponsored",
        productId,
      });
    }

    // Add a fake variant
    for (let i = 0; i < item.images.length; i++) {
      const img = item.images[i] || faker.image.urlLoremFlickr({ category: "product", width: 640, height: 480 }) + `?random=${faker.string.alphanumeric(8)}`;
      const variant = await db.insert(variants).values({
        color: faker.color.human(), // Random color
        price: parseFloat(item.price + Math.floor(Math.random() * 10).toFixed(2)), // Randomly adjust price
        discountedPrice: Math.round(item.price * (1 - item.discountPercentage / 100)),
        stock: Math.floor(item.stock / item.images.length),
        orders: 0,
        productId,
      }).returning({ id: variants.id });

      const variantId = variant[0].id;

      await db.insert(images).values({
        value: img,
        variantId,
      });
    }
    counter++
  }
}
