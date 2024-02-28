import { cartSlice, productSlice, userSlice } from "./slices";

export const reducer = {
  user: userSlice.reducer,
  product: productSlice.reducer,
  cart: cartSlice.reducer,
};
