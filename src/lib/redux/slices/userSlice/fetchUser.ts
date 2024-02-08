import { url } from "@/lib/constants";

export const fetchUser = async (): Promise<Response> => {
  const res = await fetch(url + "/api/user/getprofile");
  return res;
};
