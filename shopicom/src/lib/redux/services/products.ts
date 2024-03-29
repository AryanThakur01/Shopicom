import { image, product, property, variant } from "@/db/schema/products";
import { api } from "./api";
import { IProducts } from "@/types/products";

export const products = api.injectEndpoints({
  endpoints: (build) => ({
    getOneProduct: build.query<IProducts, { productId: number }>({
      query: (vars) => {
        let queryString = "?";
        if (vars.productId) queryString += `productId=${vars.productId}`;

        return { url: "/products/read/myproducts" + queryString };
      },
    }),
    getMyProducts: build.query<IProducts[], number>({
      query: (page) => {
        let queryString = "?";
        if (page) queryString += `page=${page}`;

        return { url: "/products/read/myproducts" + queryString };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetMyProductsQuery, useGetOneProductQuery } = products;
