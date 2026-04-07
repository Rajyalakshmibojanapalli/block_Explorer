import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
});

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery,
  tagTypes: ["Home" , "Search", "Block", "Transaction", "Address"],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 30,
    keepUnusedDataFor: 60,
  endpoints: (builder) => ({}),
});

export const { usePrefetch } = apiSlice;