// src/api/blocksApiSlice.js
import { apiSlice } from "../../api/apiSlice";

export const blocksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlocks: builder.query({
      query: ({ page = 1, per_page = 20 } = {}) => {
        const url = `/blocks?page=${page}&per_page=${per_page}`;
        console.log("🔵 API Call - getBlocks:", url);
        return url;
      },
      providesTags: ["Blocks"],
    }),

    getLatestBlock: builder.query({
      query: () => {
        const url = `/blocks/latest`;
        console.log("🔵 API Call - getLatestBlock:", url);
        return url;
      },
      providesTags: ["Blocks"],
    }),

    getBlockByHeight: builder.query({
      query: (height) => {
        const url = `/blocks/${height}`;
        console.log("🔵 API Call - getBlockByHeight:", url);
        return url;
      },
      providesTags: (result, error, height) => [{ type: "Blocks", id: height }],
    }),

    getBlockTransactions: builder.query({
      query: (height) => {
        const url = `/blocks/${height}/transactions`;
        console.log("🔵 API Call - getBlockTransactions:", url);
        return url;
      },
      providesTags: (result, error, height) => [{ type: "Blocks", id: `transactions-${height}` }],
    }),

    getBlockTransfers: builder.query({
      query: (height) => {
        const url = `/blocks/${height}/transfers`;
        console.log("🔵 API Call - getBlockTransfers:", url);
        return url;
      },
      providesTags: (result, error, height) => [{ type: "Blocks", id: `transfers-${height}` }],
    }),
  }),
});

export const {
  useGetBlocksQuery,
  useGetLatestBlockQuery,
  useGetBlockByHeightQuery,
  useGetBlockTransactionsQuery,
  useGetBlockTransfersQuery,
} = blocksApi;