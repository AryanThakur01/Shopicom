import * as zod from "zod";

export const schema = zod.object({
  email: zod.string().email(),
  password: zod
    .string()
    .min(8)
    .max(64)
    .refine(
      (password) => {
        const hasDigits = /[0-9]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        return hasDigits && hasLowerCase && hasUpperCase;
      },
      {
        message:
          "Password Must Contain atleast one digit, one lowercase and one uppercase character",
      },
    ),
});

export type TFormInput = zod.infer<typeof schema>;
