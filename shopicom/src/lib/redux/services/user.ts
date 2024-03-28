import { api } from "./api";
import { User } from "@/db/schema/users";
import { order } from "@/db/schema/orders";
import { image, product, variant } from "@/db/schema/products";
import { IUser } from "@/types/user";

interface IVariant extends variant {
  images: image[];
  product: product;
}
interface IData extends order {
  customer: User;
  product: IVariant;
}
interface IMyOrders {
  data: IData[];
}
export const user = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<IUser, void>({
      query: () => `/user/getprofile`,
    }),
    getOrders: build.query<IMyOrders, void>({
      query: () => `/user/orders`,
    }),
  }),
  overrideExisting: true,
});

export const { useGetOrdersQuery, useGetProfileQuery } = user;
