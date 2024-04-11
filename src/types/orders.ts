import { order } from "@/db/schema/orders";
import { image, product, variant } from "@/db/schema/products";
import { User } from "@/db/schema/users";

interface IVariant extends variant {
  images: image[];
  product: product;
}
export interface IOrders extends order {
  product: IVariant;
  customer: User;
}
