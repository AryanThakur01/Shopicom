import { createSlice } from "@reduxjs/toolkit";
import { userDataAsync } from ".";

export interface IUserValue {
  id: number;
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
    id: 0,
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
    resetUser: (state) => {
      state.value = initialState.value;
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
