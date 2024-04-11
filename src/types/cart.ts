import { cart } from "@/db/schema/carts";
import { image, product, variant } from "@/db/schema/products";

export interface IExtendedVariants extends variant {
  images: image[];
}
export interface ICart extends cart {
  item: product;
  variant: IExtendedVariants;
}
