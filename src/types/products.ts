export { type TFormInput } from "@/components/dashboard/products/create/ProductCatelogueForm";
import { newImage, newProduct, newProperty } from "@/db/schema/products";

export interface IProductProps {
  id?: number | undefined;
  name?: string | null | undefined;
  description?: string | null | undefined;
  sellerId: number;
  properties: newProperty[];
  variants: {
    id?: number | undefined;
    color?: string | null | undefined;
    price?: number | null | undefined;
    imageList: newImage[];
    discountedPrice?: number | null | undefined;
    productId: number;
  }[];
}
