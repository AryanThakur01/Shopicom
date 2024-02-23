import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cart as TCart } from "@/db/schema/carts";
import { cartDataAsync } from ".";

export interface CartSliceState {
  value: TCart[];
  status: "idle" | "loading" | "failed";
}
export const cartInitialState: CartSliceState = {
  value: [],
  status: "idle",
};

export const cartSlice = createSlice({
  name: "Cart",
  initialState: cartInitialState,
  reducers: {
    setCart: (state, action: PayloadAction<TCart[]>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(cartDataAsync.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(cartDataAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.value = action.payload;
    });
  },
});
