import { image, variant } from "@/db/schema/products";
import { api } from "./api";
import { IProducts, IVariants } from "@/types/products";
import * as zod from "zod";
import { variantsFormData } from "@/lib/schemas/products_v2";

interface IVariantFormData extends zod.infer<typeof variantsFormData> {
  productId?: number;
  variantId?: number;
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
    getMyProducts: build.query<IProducts[], number>({
      query: (page) => {
        let queryString = "?";
        if (page) queryString += `page=${page}`;

        return { url: "/products/read/myproducts" + queryString };
      },
    }),
    getProductVariants: build.query<IVariants[], number>({
      query: (productId) => {
        let queryString = "?";
        if (productId) queryString += `productId=${productId}`;
        return { url: "/products/read/variants" + queryString };
      },
      transformResponse: (response: { data: IVariants[] }) => response.data,
      providesTags: ["Product"],
    }),
    createVariant: build.mutation<variant, IVariantFormData>({
      query: (body) => {
        let queryString = "?";
        if (body.productId) queryString += `productId=${body.productId}`;
        if (body.variantId) queryString += `&variantId=${body.variantId}`;
        delete body.productId;

        return {
          url: "/products/create/variants" + queryString,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Product"],
    }),
    uploadImage: build.mutation<image, { img: Blob; variantId: number }>({
      query: (body) => {
        let queryString = "?";
        if (body.variantId) queryString += `variantId=${body.variantId}`;
        const formData = new FormData();
        formData.append("file", body.img);

        return {
          url: "/products/create/variants/image/" + queryString,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Product"],
    }),
    deleteImage: build.mutation<image, number>({
      query: (imageId) => {
        let queryString = "?";
        if (imageId) queryString += `imageId=${imageId}`;

        return {
          url: "/products/create/variants/image/remove" + queryString,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Product"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMyProductsQuery,
  useGetOneProductQuery,
  useGetProductVariantsQuery,
  useCreateVariantMutation,
  useUploadImageMutation,
  useDeleteImageMutation,
} = products;
