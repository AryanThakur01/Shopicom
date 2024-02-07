import { IUserValue } from "./userSlice";
import { url } from "@/lib/constants";

export const fetchUser = async (): Promise<IUserValue> => {
  const res = await fetch(url + "/api/user/getprofile");
  const user = await res.json();
  console.log(user);
  return user;
};
