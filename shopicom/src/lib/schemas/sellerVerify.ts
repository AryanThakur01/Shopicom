import * as zod from "zod";

export const sellerVerifySchema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  profilePic: zod.string(),
});

export type TFormInput = zod.infer<typeof sellerVerifySchema>;
