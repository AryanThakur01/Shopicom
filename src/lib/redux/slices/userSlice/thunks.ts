import { IUserValue, fetchUser, initialState } from ".";
import { createAppAsyncThunk } from "../../createAppAsynThunk";

export const userDataAsync = createAppAsyncThunk("user/fetchUser", async () => {
  const res = await fetchUser();
  const user: IUserValue = await res.json();
  if (res.ok) return { ...user, isLoggedin: true };
  return initialState.value;
});
