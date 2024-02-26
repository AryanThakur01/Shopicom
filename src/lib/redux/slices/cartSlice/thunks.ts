import { ICart } from "@/types/cart";
import { fetchCart, cartInitialState } from ".";
import { createAppAsyncThunk } from "../../createAppAsynThunk";

export const cartDataAsync = createAppAsyncThunk("cart/fetchCart", async () => {
  const res = await fetchCart();
  const { data }: { data: ICart[] } = await res.json();
  console.log(res);
  if (res.ok) return data;
  return cartInitialState.value;
});
