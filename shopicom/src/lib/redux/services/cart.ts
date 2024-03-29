import { ICart } from "@/types/cart";
import { api } from "./api";

export const cart = api.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<ICart[], void>({
      query: () => "/cart/read",
      transformResponse: (response: { data: ICart[] }) => response.data,
      providesTags: ["Cart", "User"],
    }),
    addToCart: build.mutation<ICart[], Pick<ICart, "itemId" | "variantId">>({
      query: ({ itemId, variantId }) => ({
        url: "/cart/add",
        method: "POST",
        body: { itemId, variantId },
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteFromCart: build.mutation<ICart[], { del: "one" | "all"; id: number }>(
      {
        query: ({ del, id }) => ({
          url: `/cart/delete?delete=${del}&id=${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Cart"],
      },
    ),
  }),
  overrideExisting: true,
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useDeleteFromCartMutation,
} = cart;
