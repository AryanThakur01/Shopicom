import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userDataAsync } from ".";

export interface IUserValue {
  firstName: string;
  lastName: string;
  profilePic: string;
  isLoggedin: boolean;
  role: "admin" | "customer" | "seller";
}
export interface UserSliceState {
  value: IUserValue;
  status: "idle" | "loading" | "failed";
}
export const initialState: UserSliceState = {
  value: {
    firstName: "",
    lastName: "",
    profilePic: "",
    role: "customer",
    isLoggedin: false,
  },
  status: "idle",
};

export const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<typeof initialState.value>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userDataAsync.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(userDataAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.value = action.payload;
    });
  },
});
