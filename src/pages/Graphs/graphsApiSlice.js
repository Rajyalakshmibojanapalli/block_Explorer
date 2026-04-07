// src/api/chartsApi.js
import { apiSlice } from "../../api/apiSlice";

export const chartsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Block & Transaction Charts
    getAvgBlockTime: builder.query({
      query: (days = 15) => {
        const url = `/charts/avg-block-time?days=${days}`;
        console.log("🔵 API Call - getAvgBlockTime:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getDailyBlocks: builder.query({
      query: (days = 30) => {
        const url = `/charts/daily-blocks?days=${days}`;
        console.log("🔵 API Call - getDailyBlocks:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getDailyTransactions: builder.query({
      query: (days = 30) => {
        const url = `/charts/daily-transactions?days=${days}`;
        console.log("🔵 API Call - getDailyTransactions:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getDailyTxStatus: builder.query({
      query: (days = 30) => {
        const url = `/charts/daily-tx-status?days=${days}`;
        console.log("🔵 API Call - getDailyTxStatus:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getDailyGas: builder.query({
      query: (days = 30) => {
        const url = `/charts/daily-gas?days=${days}`;
        console.log("🔵 API Call - getDailyGas:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    // Account Charts
    getCumulativeAccounts: builder.query({
      query: (days = 90) => {
        const url = `/charts/cumulative-accounts?days=${days}`;
        console.log("🔵 API Call - getCumulativeAccounts:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getDailyActiveAccounts: builder.query({
      query: (days = 30) => {
        const url = `/charts/daily-active-accounts?days=${days}`;
        console.log("🔵 API Call - getDailyActiveAccounts:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getTopAddressesByTx: builder.query({
      query: (limit = 20) => {
        const url = `/charts/top-addresses-by-tx?limit=${limit}`;
        console.log("🔵 API Call - getTopAddressesByTx:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getTopAddressesByVolume: builder.query({
      query: ({ limit = 20, denom = "uJMC" }) => {
        const url = `/charts/top-addresses-by-volume?limit=${limit}&denom=${denom}`;
        console.log("🔵 API Call - getTopAddressesByVolume:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    // Transfer & Volume Charts
    getDailyTransferVolume: builder.query({
      query: ({ days = 30, denom = "uJMC" }) => {
        const url = `/charts/daily-transfer-volume?days=${days}&denom=${denom}`;
        console.log("🔵 API Call - getDailyTransferVolume:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getTokenSupply: builder.query({
      query: () => {
        const url = `/charts/token-supply`;
        console.log("🔵 API Call - getTokenSupply:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getTopHolders: builder.query({
      query: ({ denom = "uJMC", limit = 20 }) => {
        const url = `/charts/top-holders?denom=${denom}&limit=${limit}`;
        console.log("🔵 API Call - getTopHolders:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    // Contract & WASM Charts
    getDailyWasmExecutions: builder.query({
      query: (days = 30) => {
        const url = `/charts/daily-wasm-executions?days=${days}`;
        console.log("🔵 API Call - getDailyWasmExecutions:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getTopContracts: builder.query({
      query: (limit = 20) => {
        const url = `/charts/top-contracts?limit=${limit}`;
        console.log("🔵 API Call - getTopContracts:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    // CW20 Token Charts
    getDailyCw20Volume: builder.query({
      query: ({ days = 30, contract }) => {
        const url = `/charts/daily-cw20-volume?days=${days}&contract=${contract}`;
        console.log("🔵 API Call - getDailyCw20Volume:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getTopCw20Tokens: builder.query({
      query: (limit = 20) => {
        const url = `/charts/top-cw20-tokens?limit=${limit}`;
        console.log("🔵 API Call - getTopCw20Tokens:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getTopCw20TokensByCount: builder.query({
      query: (limit = 20) => {
        const url = `/charts/top-cw20-tokens-by-count?limit=${limit}`;
        console.log("🔵 API Call - getTopCw20TokensByCount:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    // NFT Charts
    getTopNftContracts: builder.query({
      query: (limit = 20) => {
        const url = `/charts/top-nft-contracts?limit=${limit}`;
        console.log("🔵 API Call - getTopNftContracts:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    // Validator & Governance Charts
    getTopValidators: builder.query({
      query: (limit = 20) => {
        const url = `/charts/top-validators?limit=${limit}`;
        console.log("🔵 API Call - getTopValidators:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getValidatorStatus: builder.query({
      query: () => {
        const url = `/charts/validator-status`;
        console.log("🔵 API Call - getValidatorStatus:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getVotingPowerDistribution: builder.query({
      query: () => {
        const url = `/charts/voting-power-distribution`;
        console.log("🔵 API Call - getVotingPowerDistribution:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    getProposalStatus: builder.query({
      query: () => {
        const url = `/charts/proposal-status`;
        console.log("🔵 API Call - getProposalStatus:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),

    // Summary
    getSummary: builder.query({
      query: () => {
        const url = `/charts/summary`;
        console.log("🔵 API Call - getSummary:", url);
        return url;
      },
      providesTags: ["Charts"],
    }),
  }),
});

export const {
  useGetAvgBlockTimeQuery,
  useGetDailyBlocksQuery,
  useGetDailyTransactionsQuery,
  useGetDailyTxStatusQuery,
  useGetDailyGasQuery,
  useGetCumulativeAccountsQuery,
  useGetDailyActiveAccountsQuery,
  useGetTopAddressesByTxQuery,
  useGetTopAddressesByVolumeQuery,
  useGetDailyTransferVolumeQuery,
  useGetTokenSupplyQuery,
  useGetTopHoldersQuery,
  useGetDailyWasmExecutionsQuery,
  useGetTopContractsQuery,
  useGetDailyCw20VolumeQuery,
  useGetTopCw20TokensQuery,
  useGetTopCw20TokensByCountQuery,
  useGetTopNftContractsQuery,
  useGetTopValidatorsQuery,
  useGetValidatorStatusQuery,
  useGetVotingPowerDistributionQuery,
  useGetProposalStatusQuery,
  useGetSummaryQuery,
} = chartsApi;