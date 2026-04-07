// src/api/homeApi.js
import { apiSlice } from "../../api/apiSlice";

export const homeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHomeData: builder.query({
      query: () => "/home",
      providesTags: ["Home"],
    }),
    search: builder.query({
      query: ({ q, limit = 1 }) => ({
        url: "/search",
        params: { q, limit },
      }),
      providesTags: (result, error, { q }) => [{ type: "Search", id: q }],
    }),
  }),
});

export const { useGetHomeDataQuery, useSearchQuery, useLazySearchQuery } = homeApi;