export { type TFormInput } from "@/components/dashboard/products/create/ProductCatelogueForm";
import { image, newProperty } from "@/db/schema/products";

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
    imageList: image[];
    discountedPrice: number;
    productId: number;
    stock: number;
    orders: number;
  }[];
}
