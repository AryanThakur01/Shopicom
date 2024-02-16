import { productSlice, userSlice } from "./slices";

export const reducer = {
  user: userSlice.reducer,
  product: productSlice.reducer,
};
