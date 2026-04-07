// src/api/proposalsApi.js
import { apiSlice } from "../../api/apiSlice";

export const proposalsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProposals: builder.query({
      query: ({ page = 1, per_page = 20 } = {}) =>
        `/proposals?page=${page}&per_page=${per_page}`,
      providesTags: ["Proposals"],
    }),
    
    getProposalById: builder.query({
      query: (id) => `/proposals/${id}`,
      providesTags: (result, error, id) => [{ type: "Proposals", id }],
    }),
  }),
});

export const { useGetProposalsQuery, useGetProposalByIdQuery } = proposalsApi;