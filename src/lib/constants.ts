export const url =
  process.env.NODE_ENV === "production"
    ? "https://shopicom.aryanthakur.dev"
    : "http://localhost:3000";

export const stripePublicKey = String(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE)
