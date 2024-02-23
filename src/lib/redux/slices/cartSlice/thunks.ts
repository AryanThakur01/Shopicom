import { cart as TCart } from "@/db/schema/carts";
import { fetchCart, cartInitialState } from ".";
import { createAppAsyncThunk } from "../../createAppAsynThunk";

export const cartDataAsync = createAppAsyncThunk("cart/fetchCart", async () => {
  const res = await fetchCart();
  const cart: TCart[] = await res.json();
  if (res.ok) return { ...cart };
  return cartInitialState.value;
});
