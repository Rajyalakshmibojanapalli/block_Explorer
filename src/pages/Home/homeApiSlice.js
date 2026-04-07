// // src/api/homeApi.js
// import { apiSlice } from "../../api/apiSlice";

// export const homeApi = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getHomeData: builder.query({
//       query: () => "/home",
//       providesTags: ["Home"],
//     }),
//     search: builder.query({
//       query: ({ q, limit = 1 }) => ({
//         url: "/search",
//         params: { q, limit },
//       }),
//       providesTags: (result, error, { q }) => [{ type: "Search", id: q }],
//     }),
//   }),
// });

// export const { useGetHomeDataQuery, useSearchQuery, useLazySearchQuery } = homeApi;

// src/api/homeApi.js
import { apiSlice } from "../../api/apiSlice";
import websocketService from "../socket/socketApiSlice";

export const homeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHomeData: builder.query({
      query: () => "/home",
      providesTags: ["Home"],
      transformResponse: (response) => response.data || response,

      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;

          if (!websocketService.isConnected()) {
            websocketService.connect();
          }

          const unsubscribeAll = websocketService.on("*", (data) => {
            updateCachedData((draft) => {
              const type = data.type || data.event;

              switch (type) {
                case "block":
                case "new_block":
                  if (data.payload && draft.latest_blocks) {
                    draft.latest_blocks = [data.payload, ...draft.latest_blocks].slice(0, 10);
                  }
                  if (data.payload?.height && draft.stats) {
                    draft.stats.block_height = data.payload.height;
                  }
                  break;

                case "transaction":
                case "new_transaction":
                  if (data.payload && draft.latest_transactions) {
                    draft.latest_transactions = [data.payload, ...draft.latest_transactions].slice(0, 10);
                  }
                  if (draft.stats) {
                    draft.stats.total_transactions = (draft.stats.total_transactions || 0) + 1;
                  }
                  break;

                default:
                  break;
              }
            });
          });

          await cacheEntryRemoved;
          unsubscribeAll();
        } catch (error) {
          console.error("Cache entry error:", error);
        }
      },
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