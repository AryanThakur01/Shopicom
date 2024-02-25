import { cart } from "@/db/schema/carts";
import { product } from "@/db/schema/products";

export interface ICart extends cart {
  item: product;
}
