import { image, product, property, variant } from "@/db/schema/products";

export interface IProductProps extends product {
  properties: property[];
  variants: {
    id: number;
    color: string;
    price: string;
    images: image[];
    discountedPrice: number;
    productId: number;
    stock: number;
    orders: number;
  }[];
}

export interface IVariants extends variant {
  images: image[];
}
export interface IProducts extends product {
  properties: property[];
  variants: IVariants[];
}
