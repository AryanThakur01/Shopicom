import * as zod from "zod";

const properties = zod
  .array(
    zod.object({
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
export const variantsFormData = zod.object({
  color: zod.string(),
  price: zod.string().min(1),
  discountedPrice: zod.string().min(1),
  stock: zod.string().min(1),
  orders: zod.string().min(1),
  // images,
});

export const productSchema_v2 = zod.object({
  name: zod.string().min(3),
  description: zod.string().min(10),
  properties,
});

export const generalSchema = zod.object({
  name: zod.string().min(3),
  description: zod.string().min(10),
});
