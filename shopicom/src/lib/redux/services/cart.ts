import { ICart } from "@/types/cart";
import { api } from "./api";

interface IResponseCart {
  data: ICart[];
}
export const cart = api.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<IResponseCart, void>({
      query: () => "/cart/read",
    }),
  }),
  overrideExisting: true,
});

export const { useGetCartQuery } = cart;
