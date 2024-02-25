import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cartDataAsync } from ".";
import { ICart } from "@/types/cart";

export interface CartSliceState {
  value: ICart[];
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
    setCart: (state, action: PayloadAction<ICart[]>) => {
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
