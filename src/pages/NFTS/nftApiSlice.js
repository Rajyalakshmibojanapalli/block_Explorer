  // // src/api/nftApi.js
  // import { apiSlice } from "../../api/apiSlice";

  // export const nftApi = apiSlice.injectEndpoints({
  //   endpoints: (builder) => ({
  //     // Get all NFT collections with pagination
  //     getNFTCollections: builder.query({
  //       query: ({ page = 1, per_page = 20 } = {}) => {
  //         const url = `/nft/collections?page=${page}&per_page=${per_page}`;
  //         console.log("🟣 API Call - getNFTCollections:", url);
  //         return url;
  //       },
  //       providesTags: ["NFTCollections"],
  //     }),

  //     // Get single collection by contract address
  //     getNFTCollection: builder.query({
  //       query: (contractAddress) => {
  //         const url = `/nft/collections/${contractAddress}`;
  //         console.log("🟣 API Call - getNFTCollection:", url);
  //         console.log("Contract Address received:", contractAddress);
  //         return url;
  //       },
  //       providesTags: (result, error, contractAddress) => [
  //         { type: "NFTCollections", id: contractAddress }
  //       ],
  //     }),

  //     // Get collection summary (includes unique_holders)
  //     getNFTCollectionSummary: builder.query({
  //       query: (contractAddress) => {
  //         const url = `/nft/collections/${contractAddress}/summary`;
  //         console.log("🟣 API Call - getNFTCollectionSummary:", url);
  //         return url;
  //       },
  //       providesTags: (result, error, contractAddress) => [
  //         { type: "NFTCollections", id: `summary-${contractAddress}` }
  //       ],
  //     }),
  //   }),
  // });

  // export const {
  //   useGetNFTCollectionsQuery,
  //   useGetNFTCollectionQuery,
  //   useGetNFTCollectionSummaryQuery,
  // } = nftApi;


  // src/api/nftApi.js
  import { apiSlice } from "../../api/apiSlice";

  export const nftApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      // Get all NFT collections with pagination
      getNFTCollections: builder.query({
        query: ({ page = 1, per_page = 20 } = {}) => {
          const url = `/nft/collections?page=${page}&per_page=${per_page}`;
          console.log("🟣 API Call - getNFTCollections:", url);
          return url;
        },
        providesTags: ["NFTCollections"],
      }),

      // Get single collection by contract address
      getNFTCollection: builder.query({
        query: (contractAddress) => {
          const url = `/nft/collections/${contractAddress}`;
          console.log("🟣 API Call - getNFTCollection:", url);
          return url;
        },
        providesTags: (result, error, contractAddress) => [
          { type: "NFTCollections", id: contractAddress },
        ],
      }),

      // Get collection summary (includes unique_holders)
      getNFTCollectionSummary: builder.query({
        query: (contractAddress) => {
          const url = `/nft/collections/${contractAddress}/summary`;
          console.log("🟣 API Call - getNFTCollectionSummary:", url);
          return url;
        },
        providesTags: (result, error, contractAddress) => [
          { type: "NFTCollections", id: `summary-${contractAddress}` },
        ],
      }),

      // Get NFT transfers with optional action filter
      // action can be: "transfer_nft", "mint", or undefined (all)
      getNFTTransfers: builder.query({
        query: ({ page = 1, per_page = 20, action, address } = {}) => {
          let url = `/nft/transfers?page=${page}&per_page=${per_page}`;
          if (action) {
            url += `&action=${action}`;
          }
          if (address) {
            url += `&address=${address}`;
          }
          console.log("🟣 API Call - getNFTTransfers:", url);
          return url;
        },
        providesTags: (result, error, arg) => [
          { 
            type: "NFTTransfers", 
            id: arg?.address ? `${arg.address}-${arg.action || 'all'}` : (arg?.action || "all")
          },
        ],
      }),

      getNFTHoldings: builder.query({
      query: ({ address, page = 1, per_page = 20 }) => {
        if (!address) {
          throw new Error("Address is required for NFT holdings");
        }
        const url = `/nft/holdings/${address}?page=${page}&per_page=${per_page}`;
        console.log("🟣 API Call - getNFTHoldings:", url);
        return url;
      },
      providesTags: (result, error, arg) => [
        { type: "NFTHoldings", id: arg?.address },
      ],
    })
    }),
  });

  export const {
    useGetNFTCollectionsQuery,
    useGetNFTCollectionQuery,
    useGetNFTCollectionSummaryQuery,
    useGetNFTTransfersQuery,
    useGetNFTHoldingsQuery,
  } = nftApi;