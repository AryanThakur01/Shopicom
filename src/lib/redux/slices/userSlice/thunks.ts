import { fetchUser } from ".";
import { createAppAsyncThunk } from "../../createAppAsynThunk";

export const userDataAsync = createAppAsyncThunk("user/fetchUser", async () => {
  const res = await fetchUser();
  return res;
});
