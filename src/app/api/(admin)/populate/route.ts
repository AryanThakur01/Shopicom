import { db } from "@/db";
import {
  images,
  newImage,
  newProperty,
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

    const productsList = await populateProducts(count, sellerId);
    await addCategories(productsList);

    return NextResponse.json(productsList.slice(0, 50));
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "INTERNAL SERVER ERROR" },
      { status: 500 }
    );
  }
};

/* ------------------------------- HELPERS ------------------------------- */

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

/** Inserts a product, its properties, variants, and images into the DB */
const insertProduct = async (body: TFormInput, sellerId: number) => {
  const [newProduct] = await db
    .insert(products)
    .values({ ...body, sellerId })
    .returning();

  const insertProperties: newProperty[] = body.properties.map((p) => ({
    ...p,
    productId: newProduct.id,
  }));
  await db.insert(properties).values(insertProperties);

  for (const variant of body.variants) {
    const [newVariant] = await db
      .insert(variants)
      .values({
        productId: newProduct.id,
        discountedPrice: Number(variant.discountedPrice),
        price: Number(variant.price),
        orders: Number(variant.orders),
        stock: Number(variant.stock),
        color: variant.color,
      })
      .returning();

    const insertImages: newImage[] = variant.images.map((img) => ({
      value: img.value,
      variantId: newVariant.id,
    }));
    await db.insert(images).values(insertImages);
  }

  return newProduct;
};

/** Generates a single product with random name, description, variants, etc */
const createProduct = (): TFormInput => {
  const category = faker.commerce.department();
  const name = faker.commerce.productName();
  const description = `${category.toUpperCase()} | ${faker.commerce.productDescription()}`;

  const properties = Array.from({ length: 5 }).map(() => ({
    key: faker.commerce.productMaterial(),
    value: faker.commerce.productAdjective(),
  }));

  const variants = Array.from({ length: 3 }).map(() => {
    const color = faker.color.human();
    const images = Array.from({ length: 3 }).map(() => ({
      value:
        faker.image.urlLoremFlickr({ category, width: 640, height: 480 }) +
        `?random=${faker.string.alphanumeric(8)}`,
    }));
    const price = faker.number.int({ min: 200, max: 10000 });
    const discountedPrice = faker.number.int({ min: price / 2, max: price });
    const stock = faker.number.int({ min: 100, max: 1000 });

    return {
      color,
      images,
      price: price.toString(),
      discountedPrice: discountedPrice.toString(),
      stock: stock.toString(),
      orders: "0",
    };
  });

  return { name, description, properties, variants };
};

/** Populates DB with `count` number of products and returns them */
const populateProducts = async (count: number, sellerId: number) => {
  const generatedProducts: TFormInput[] = [];

  for (let i = 0; i < count; i++) {
    generatedProducts.push(createProduct());
  }

  // Step 1: Insert all products
  const insertedProducts = await db
    .insert(products)
    .values(
      generatedProducts.map((p) => ({
        name: p.name,
        description: p.description,
        sellerId,
      }))
    )
    .returning({ id: products.id });

  const productIds = insertedProducts.map((p) => p.id);

  // Step 2: Collect properties, variants, and images
  const allProperties: newProperty[] = [];
  const allVariants: { variant: any; index: number }[] = [];
  const allImages: newImage[] = [];

  for (let i = 0; i < generatedProducts.length; i++) {
    const productId = productIds[i];
    const p = generatedProducts[i];

    // Properties
    for (const prop of p.properties) {
      allProperties.push({ ...prop, productId });
    }

    // Variants + Images
    for (const variant of p.variants) {
      allVariants.push({
        variant: {
          productId,
          color: variant.color,
          price: Number(variant.price),
          discountedPrice: Number(variant.discountedPrice),
          stock: Number(variant.stock),
          orders: Number(variant.orders),
        },
        index: allVariants.length, // track index for image mapping
      });
    }
  }

  // Step 3: Insert properties
  await db.insert(properties).values(allProperties);

  // Step 4: Insert variants and collect variantIds
  const insertedVariants = await db
    .insert(variants)
    .values(allVariants.map((v) => v.variant))
    .returning({ id: variants.id });

  // Step 5: Map back images to variants
  let variantCounter = 0;
  for (let i = 0; i < generatedProducts.length; i++) {
    for (let j = 0; j < generatedProducts[i].variants.length; j++) {
      const variant = generatedProducts[i].variants[j];
      const variantId = insertedVariants[variantCounter++].id;
      for (const image of variant.images) {
        allImages.push({ value: image.value, variantId });
      }
    }
  }

  // Step 6: Insert all images
  await db.insert(images).values(allImages);

  return insertedProducts; // or any data you want to return
};

/** Adds 20 random products to sponsored / best seller category table */
const addCategories = async (productList: { id: number }[]) => {
  const chosen = faker.helpers.arrayElements(productList, 20);
  const entries = chosen.map((product) => ({
    productId: product.id,
    tag: faker.helpers.arrayElement(["sponsored", "best seller"]) as "best seller" | "sponsored",
  }));
  await db.insert(categories).values(entries);
};

