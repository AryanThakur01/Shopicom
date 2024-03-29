import { api } from "./api";
import { User } from "@/db/schema/users";
import { order } from "@/db/schema/orders";
import { image, product, variant } from "@/db/schema/products";
import { IUser } from "@/types/user";
import { TFormInput } from "@/lib/schemas/auth";

interface IVariant extends variant {
  images: image[];
  product: product;
}
interface IMyOrders extends order {
  customer: User;
  product: IVariant;
}
export const user = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<IUser, void>({
      query: () => `/user/getprofile`,
      providesTags: ["User"],
    }),
    getOrders: build.query<IMyOrders[], void>({
      query: () => `/user/orders`,
      transformResponse: (response: { data: IMyOrders[] }) => response.data,
      providesTags: ["User"],
    }),
    getCustomerOrders: build.query<Omit<IMyOrders, "customer">, void>({
      query: () => `/user/getorderqueue`,
      transformResponse: (response: { data: Omit<IMyOrders, "customer"> }) =>
        response.data,
      providesTags: ["User"],
    }),
    login: build.mutation<string, TFormInput>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Cart"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetOrdersQuery, useGetProfileQuery, useLoginMutation } = user;
