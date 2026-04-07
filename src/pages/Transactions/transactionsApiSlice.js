// src/api/transactionsApi.js
import { apiSlice } from "../../api/apiSlice";

export const transactionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: ({ page = 1, per_page = 25 } = {}) => {
        const url = `/transactions?page=${page}&per_page=${per_page}`;
        console.log("🔵 API Call - getTransactions:", url);
        return url;
      },
      providesTags: ["Transactions"],
    }),

    getTransactionByHash: builder.query({
      query: (hash) => {
        const url = `/transactions/${hash}`;
        console.log("🔵 API Call - getTransactionByHash:", url);
        console.log("Hash received:", hash);
        return url;
      },
      providesTags: (result, error, hash) => [{ type: "Transactions", id: hash }],
    }),

    getTransactionsByAddress: builder.query({
      query: ({ address, page = 1, per_page = 25 }) => {
        const url = `/transactions/by-address?address=${address}&page=${page}&per_page=${per_page}`;
        console.log("🔵 API Call - getTransactionsByAddress:", url);
        return url;
      },
      providesTags: ["Transactions"],
    }),

    getTransactionsByHeight: builder.query({
      query: ({ height, page = 1, per_page = 25 }) => {
        const url = `/transactions/by-height?height=${height}&page=${page}&per_page=${per_page}`;
        console.log("🔵 API Call - getTransactionsByHeight:", url);
        return url;
      },
      providesTags: ["Transactions"],
    }),

    getInternalTransactions: builder.query({
      query: ({ address, contract, page = 1, per_page = 25 }) => {
        const url = `/transactions/internal?address=${address}&page=${page}&per_page=${per_page}`;
        console.log("🔵 API Call - getInternalTransactions:", url);
        return url;
      },
      providesTags: ["Transactions"],
    }),

    getInternalTransactionsByHash: builder.query({
      query: (hash) => {
        const url = `/transactions/internal/hash/${hash}`;
        console.log("🔵 API Call - getInternalTransactionsByHash:", url);
        return url;
      },
      providesTags: (result, error, hash) => [{ type: "Transactions", id: `internal-${hash}` }],
    }),

    getRecentTransactions: builder.query({
      query: ({ per_page = 25 } = {}) => {
        const url = `/transactions/recent?per_page=${per_page}`;
        console.log("🔵 API Call - getRecentTransactions:", url);
        return url;
      },
      providesTags: ["Transactions"],
    }),

    searchTransactions: builder.query({
      query: ({ hash, page = 1, per_page = 25 }) => {
        const url = `/transactions/search?hash=${hash}&page=${page}&per_page=${per_page}`;
        console.log("🔵 API Call - searchTransactions:", url);
        return url;
      },
      providesTags: ["Transactions"],
    }),

    getTransactionEvents: builder.query({
      query: (hash) => {
        const url = `/transactions/${hash}/events`;
        console.log("🔵 API Call - getTransactionEvents:", url);
        return url;
      },
      providesTags: (result, error, hash) => [{ type: "Transactions", id: `events-${hash}` }],
    }),

    getTransactionLogs: builder.query({
      query: (hash) => {
        const url = `/transactions/${hash}/logs`;
        console.log("🔵 API Call - getTransactionLogs:", url);
        return url;
      },
      providesTags: (result, error, hash) => [{ type: "Transactions", id: `logs-${hash}` }],
    }),

    getTransactionMessages: builder.query({
      query: (hash) => {
        const url = `/transactions/${hash}/messages`;
        console.log("🔵 API Call - getTransactionMessages:", url);
        return url;
      },
      providesTags: (result, error, hash) => [{ type: "Transactions", id: `messages-${hash}` }],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByHashQuery,
  useGetTransactionsByAddressQuery,
  useGetTransactionsByHeightQuery,
  useGetInternalTransactionsQuery,
  useGetInternalTransactionsByHashQuery,
  useGetRecentTransactionsQuery,
  useSearchTransactionsQuery,
  useGetTransactionEventsQuery,
  useGetTransactionLogsQuery,
  useGetTransactionMessagesQuery,
} = transactionsApi;