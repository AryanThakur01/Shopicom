import { db } from "@/db";
import { products } from "@/db/schema/products";
import { url } from "@/lib/constants";
import { eq } from "drizzle-orm";
import { MetadataRoute } from "next";

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }];
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const start = id * 10000;
  const end = start + 10000;
  const productList = [];
  for (let productId = 0; productId < end; productId++) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        seller: true,
        variants: {
          with: {
            images: true,
          },
        },
        categories: true,
        properties: true,
      },
    });
    if (product) productList.push(product);
  }
  return productList.map((product) => ({
    url: `${url}/products/${product.id}`,
    lastModified: new Date(),
  }));
}
