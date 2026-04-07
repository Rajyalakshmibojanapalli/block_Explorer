// src/api/statsApi.js
import { apiSlice } from "../../api/apiSlice";

export const statsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => {
        const url = `/stats`;
        console.log("🔵 API Call - getStats:", url);
        return url;
      },
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetStatsQuery,
} = statsApi;