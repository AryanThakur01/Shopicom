export { type TFormInput } from "@/components/dashboard/products/create/ProductCatelogueForm";
import {
  image,
  newProperty,
  product,
  property,
  variant,
} from "@/db/schema/products";

export interface IProductProps {
  id: number;
  name: string;
  description: string;
  sellerId: number;
  properties: newProperty[];
  variants: {
    id: number;
    color: string;
    price: number;
    images: image[];
    discountedPrice: number;
    productId: number;
    stock: number;
    orders: number;
  }[];
}

interface IVariants extends variant {
  images: image[];
}
export interface IProducts extends product {
  properties: property;
  variants: IVariants[];
}
