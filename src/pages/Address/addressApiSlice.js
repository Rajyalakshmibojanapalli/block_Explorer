// src/api/addressApi.js
import { apiSlice } from "../../api/apiSlice";

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get address overview
    getAddress: builder.query({
      query: (address) => `/addresses/${address}`,
      providesTags: (result, error, address) => [
        { type: "Address", id: address },
      ],
    }),

    // Get address balances
    getAddressBalances: builder.query({
      query: (address) => `/addresses/${address}/balances`,
      providesTags: (result, error, address) => [
        { type: "AddressBalances", id: address },
      ],
    }),

    // Get bank transfers
    getAddressBankTransfers: builder.query({
      query: ({ address, page = 1, per_page = 20 }) => ({
        url: `/addresses/${address}/bank-transfers`,
        params: { page, per_page },
      }),
      providesTags: (result, error, { address }) => [
        { type: "BankTransfers", id: address },
      ],
    }),

    // Get CW20 transfers
    getAddressCw20Transfers: builder.query({
      query: ({ address, page = 1, per_page = 20 }) => ({
        url: `/addresses/${address}/cw20-transfers`,
        params: { page, per_page },
      }),
      providesTags: (result, error, { address }) => [
        { type: "Cw20Transfers", id: address },
      ],
    }),

    // Get transactions
    getAddressTransactions: builder.query({
      query: ({ address, page = 1, per_page = 20 }) => ({
        url: `/addresses/${address}/transactions`,
        params: { page, per_page },
      }),
      providesTags: (result, error, { address }) => [
        { type: "AddressTransactions", id: address },
      ],
    }),

    // Get votes
    getAddressVotes: builder.query({
      query: (address) => `/addresses/${address}/votes`,
      providesTags: (result, error, address) => [
        { type: "AddressVotes", id: address },
      ],
    }),
  }),
});

export const {
  useGetAddressQuery,
  useGetAddressBalancesQuery,
  useGetAddressBankTransfersQuery,
  useGetAddressCw20TransfersQuery,
  useGetAddressTransactionsQuery,
  useGetAddressVotesQuery,
} = addressApi;