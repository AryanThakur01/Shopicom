import { image, product, variant } from "@/db/schema/products";
import { IProductProps } from "@/types/products";

interface IProduct {
  products: product;
  variants: variant;
  images: image;
}

const getDefaultProduct = (
  allProducts: IProduct[],
  index: number,
  sellerId: number,
) => {
  return {
    id: allProducts[index].products.id,
    name: allProducts[index].products.name,
    description: allProducts[index].products.description,
    variants: [
      {
        ...allProducts[index].variants,
        imageList: [allProducts[index].images || { value: "" }],
      },
    ],
    sellerId: sellerId,
    properties: [],
  };
};
