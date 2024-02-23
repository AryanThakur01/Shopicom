import { url } from "@/lib/constants";

export const fetchCart = async (): Promise<Response> => {
  const res = await fetch(url + "/api/cart/read");
  return res;
};
