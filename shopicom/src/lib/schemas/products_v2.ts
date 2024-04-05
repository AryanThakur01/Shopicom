import * as zod from "zod";

const properties = zod
  .array(
    zod.object({
      id: zod.number().optional(),
      productId: zod.number().optional(),
      key: zod.string(),
      value: zod.string(),
    }),
  )
  .max(8);

// const images = zod.array(
//   zod.object({
//     id: zod.number().optional(),
//     variantId: zod.number().optional(),
//     value: zod.custom<FileList | string>().optional(),
//   }),
// );
//
// const variants = zod
//   .array(
//     zod.object({
//       id: zod.number().optional(),
//       productId: zod.number().optional(),
//       color: zod.string(),
//       images,
//       price: zod.string().min(1),
//       discountedPrice: zod.string().min(1),
//       stock: zod.string().min(1),
//       orders: zod.string().min(1),
//     }),
//   )
//   .max(8);

export const productSchema_v2 = zod.object({
  name: zod.string().min(3),
  description: zod.string().min(10),
  // id: zod.number().optional(),
  // sellerId: zod.number().optional(),
  properties,
  // variants,
});
