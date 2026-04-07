// src/api/cw20Api.js
import { apiSlice } from "../../api/apiSlice";

export const cw20Api = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get address activity
    getAddressActivity: builder.query({
      query: ({ page = 1, per_page = 20, contract }) => {
        const url = `/cw20/address-activity?page=${page}&per_page=${per_page}&contract=${contract}`;
        console.log("🔵 API Call - getAddressActivity:", url);
        return url;
      },
      providesTags: ["AddressActivity"],
    }),

    // Get balances
    getBalances: builder.query({
      query: ({ page = 1, per_page = 20, contract, address }) => {
        const url = `/cw20/balances?page=${page}&per_page=${per_page}&contract=${contract}&address=${address}`;
        console.log("🔵 API Call - getBalances:", url);
        return url;
      },
      providesTags: ["Balances"],
    }),

    // Get holdings for an address
    getHoldings: builder.query({
      query: ({ address, page = 1, per_page = 20 }) => {
        const url = `/cw20/holdings/${address}?page=${page}&per_page=${per_page}`;
        console.log("🔵 API Call - getHoldings:", url);
        return url;
      },
      providesTags: ["Holdings"],
    }),

    // Get all tokens
    getTokens: builder.query({
      query: ({ page = 1, per_page = 20 }) => {
        const url = `/cw20/tokens?page=${page}&per_page=${per_page}`;
        console.log("🔵 API Call - getTokens:", url);
        return url;
      },
      providesTags: ["Tokens"],
    }),

    // Get single token details
    getTokenDetails: builder.query({
      query: (contractAddress) => {
        const url = `/cw20/tokens/${contractAddress}`;
        console.log("🔵 API Call - getTokenDetails:", url);
        return url;
      },
      providesTags: ["TokenDetails"],
    }),

    // Get transfers
    getTransfers: builder.query({
      query: ({ page = 1, per_page = 20, contract }) => {
        const url = `/cw20/transfers?page=${page}&per_page=${per_page}&contract=${contract}`;
        console.log("🔵 API Call - getTransfers:", url);
        return url;
      },
      providesTags: ["Transfers"],
    }),
  }),
});

export const {
  useGetAddressActivityQuery,
  useGetBalancesQuery,
  useGetHoldingsQuery,
  useGetTokensQuery,
  useGetTokenDetailsQuery,
  useGetTransfersQuery,
} = cw20Api;