import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "@/lib/constants";

export const api = createApi({
  reducerPath: "User",
  baseQuery: fetchBaseQuery({ baseUrl: `${url}/api` }),
  tagTypes: ["User"],
  endpoints: () => ({}),
});
