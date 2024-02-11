import { db } from "@/db";
import {
  images,
  newImage,
  newProperty,
  products,
  properties,
  variants,
} from "@/db/schema/products";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecoder } from "@/utils/api/helpers";
import { faker } from "@faker-js/faker";
import { randomInt } from "crypto";

export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("Session_Token")?.value;
    if (!token) throw new Error("Token Not Found");

    const payload = jwtDecoder(token);
    if (!payload.id || !payload.role)
      throw new Error("Session Token role or id missing");
    if (payload.role !== "admin") throw new Error("ADMIN ONLY ROUTE");

    const url = new URL(req.url);

    const count = Number(url.searchParams.get("count"));
    const sellerId = Number(url.searchParams.get("seller_id"));
    if (!count || !sellerId)
      throw new Error('Send The "Count" and "seller_id" in query');

    const product = populate(count, sellerId);

    return NextResponse.json(product.slice(0, 50));
  } catch (error) {
    // Handle the error
    if (error instanceof Error) {
      console.error("An error occurred:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("An unknown error occurred:", error);
      return NextResponse.json(
        { error: "INTERNAL SERVER ERROR" },
        { status: 500 },
      );
    }
  }
};

/* ------------------------------- HELPERS --------------------------------*/
type TFormInput = {
  name: string;
  description: string;
  properties: {
    key: string;
    value: string;
  }[];
  variants: {
    color: string;
    images: { value: string }[];
    price: string;
    discountedPrice: string;
    stock: string;
    orders: string;
  }[];
};

const insertProduct = async (body: TFormInput, sellerId: number) => {
  const newProduct = await db
    .insert(products)
    .values({
      ...body,
      sellerId,
    })
    .returning();

  // insert properties
  const insertProperties: newProperty[] = body.properties.map((item) => ({
    ...item,
    productId: newProduct[0].id,
  }));
  await db.insert(properties).values(insertProperties).returning();

  for (const variant of body.variants) {
    const prodVariants = await db
      .insert(variants)
      .values({
        productId: newProduct[0].id,
        discountedPrice: Number(variant.discountedPrice),
        price: Number(variant.price),
        orders: Number(variant.orders),
        stock: Number(variant.stock),
        color: variant.color,
      })
      .returning();
    const insertImages: newImage[] = variant.images.map((img) => ({
      value: typeof img.value === "string" ? img.value : "",
      variantId: prodVariants[0].id,
    }));
    await db.insert(images).values(insertImages).returning();
  }
};

const createProduct = () => {
  const wordList = faker.word;
  const name = wordList.noun() + " " + wordList.verb();
  const num = randomInt(10);
  const description = `${faker.rawDefinitions.commerce?.product_description?.[num]}`;
  const properties = [];
  for (let i = 0; i < 8; i++)
    properties.push({ key: wordList.noun(), value: wordList.noun() });

  const variants = [];
  for (let i = 0; i < 8; i++) {
    const color = faker.color.rgb();
    const images = [];
    for (let i = 0; i < 5; i++) {
      const image = faker.image.urlLoremFlickr({ category: "object" });
      images.push({ value: image });
    }
    const price = faker.number.int({ min: 200, max: 10000 });
    const discountedPrice = faker.number.int({ min: price / 2, max: price });
    const stock = faker.number.int({ min: 100, max: 1000 });
    const orders = 0;
    variants.push({
      color,
      images,
      price: price.toString(),
      discountedPrice: discountedPrice.toString(),
      stock: stock.toString(),
      orders: orders.toString(),
    });
  }

  return { name, description, properties, variants };
};
const populate = (count: number, sellerId: number) => {
  let body: TFormInput[] = [];
  for (let index = 0; index < count; index++) {
    const product = createProduct();
    body.push(product);
    insertProduct(product, sellerId);
  }
  return body;
};
