import { image, product, property, variant } from "@/db/schema/products";
import { api } from "./api";

interface IVariants extends variant {
  images: image;
}
interface IProducts extends product {
  properties: property;
  variants: IVariants[];
}
export const products = api.injectEndpoints({
  endpoints: (build) => ({
    getOneProduct: build.query<IProducts, { productId: number }>({
      query: (vars) => {
        let queryString = "?";
        if (vars.productId) queryString += `productId=${vars.productId}`;

        return { url: "/products/read/myproducts" + queryString };
      },
    }),
    getMyProducts: build.query<IProducts[], { page: number }>({
      query: (vars) => {
        let queryString = "?";
        if (vars.page) queryString += `page=${vars.page}`;

        return { url: "/products/read/myproducts" + queryString };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useGetMyProductsQuery, useGetOneProductQuery } = products;
