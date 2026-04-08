// // src/api/validatorsApiSlice.js
// import { apiSlice } from "../../api/apiSlice";

// export const validatorsApi = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getValidators: builder.query({
//       query: ({ page = 1, per_page = 20, status = "BOND_STATUS_BONDED" } = {}) => {
//         const url = `/validator-stats?page=${page}&per_page=${per_page}&status=${status}`;
//         console.log("🔵 API Call - getValidators:", url);
//         return url;
//       },
//       providesTags: ["Validators"],
//     }),
    
//     getValidatorDetails: builder.query({
//       query: (operatorAddress) => {
//         const url = `/validators/${operatorAddress}`;
//         console.log("🔵 API Call - getValidatorDetails:", url);
//         return url;
//       },
//       providesTags: (result, error, operatorAddress) => [
//         { type: "ValidxatorDetails", id: operatorAddress },
//       ],
//     }),
//   }),
// });

// export const {
//   useGetValidatorsQuery,
//   useGetValidatorDetailsQuery,
// } = validatorsApi;


// src/api/validatorsApiSlice.js
import { apiSlice } from "../../api/apiSlice";

export const validatorsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getValidators: builder.query({
      query: ({ page = 1, per_page = 20, status = "BOND_STATUS_BONDED" } = {}) => {
        const url = `/validator-stats?page=${page}&per_page=${per_page}&status=${status}`;
        console.log("🔵 API Call - getValidators:", url);
        return url;
      },
      providesTags: (result) => [
        "Validators",
        ...(result?.data?.map(({ operator_address }) => ({
          type: "Validator",
          id: operator_address,
        })) ?? []),
      ],
    }),

   getValidatorDetails: builder.query({
  query: ({ page = 1, per_page = 25 }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
    });
    const url = `/validators/set-info?${params.toString()}`;
    console.log("🔵 API Call - getValidatorDetails:", url);
    return url;
  },
  providesTags: (result, error, { page }) => [
    { type: "Validator", id: `SET_INFO_${page}` },
  ],
}),

    getValidatorByOperatorAddress: builder.query({
      query: (operatorAddress) => {
        const url = `/validators/${operatorAddress}`;
        console.log("🔵 API Call - getValidatorByOperatorAddress:", url);
        return url;
      },
      providesTags: (result, error, operatorAddress) => [
        { type: "Validator", id: operatorAddress },
      ],
    }),
  }),
});

export const {
  useGetValidatorsQuery,
  useGetValidatorDetailsQuery,
  useGetValidatorByOperatorAddressQuery,
} = validatorsApi;