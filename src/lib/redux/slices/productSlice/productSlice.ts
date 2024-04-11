import { image, variant } from "@/db/schema/products";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { userDataAsync } from ".";

export interface IProductValue {
  variant: variant;
  images: image[];
}
export interface ProductSliceState {
  value: IProductValue;
  status: "idle" | "loading" | "failed";
}
export const initialProduct: ProductSliceState = {
  value: {
    variant: {
      id: 0,
      color: "",
      price: 0,
      stock: 0,
      orders: 0,
      productId: 0,
      discountedPrice: 0,
    },
    images: [
      {
        id: 0,
        value: "",
        variantId: 0,
      },
    ],
  },
  status: "idle",
};

export const productSlice = createSlice({
  name: "User",
  initialState: { initialProduct },
  reducers: {
    setProduct: (state, action: PayloadAction<IProductValue>) => {
      state.initialProduct.value = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(userDataAsync.pending, (state) => {
  //     state.status = "loading";
  //   });
  //   builder.addCase(userDataAsync.fulfilled, (state, action) => {
  //     state.status = "idle";
  //     state.value = action.payload;
  //   });
  // },
});
