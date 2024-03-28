import { api } from "./services/api";
import { cartSlice, productSlice, userSlice } from "./slices";

export const reducer = {
  [api.reducerPath]: api.reducer,
  user: userSlice.reducer,
  product: productSlice.reducer,
  cart: cartSlice.reducer,
};
