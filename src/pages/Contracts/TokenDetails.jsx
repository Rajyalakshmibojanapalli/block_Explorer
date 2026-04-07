// src/components/CW20/TokenDetails.jsx
import React from "react";
import { useGetTokenDetailsQuery } from "../../api/cw20Api";

const TokenDetails = ({ contractAddress }) => {
  const { data, isLoading, isError, error } = useGetTokenDetailsQuery(contractAddress);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading token details...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error: {error?.message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Token Details</h2>
        <span className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded-full font-semibold">
          {data?.symbol}
        </span>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-xl p-6">
        <h3 className="text-3xl font-bold text-gray-800 mb-6">{data?.name}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Contract Address</p>
            <p className="text-sm font-mono text-gray-900 break-all">{data?.contract_address}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Creator</p>
            <p className="text-sm font-mono text-gray-900 break-all">{data?.creator}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Supply</p>
            <p className="text-2xl font-bold text-green-600">{data?.total_supply?.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Decimals</p>
            <p className="text-2xl font-bold text-teal-600">{data?.decimals}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Code ID</p>
            <p className="text-lg font-semibold text-gray-700">{data?.code_id}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Deployed At</p>
            <p className="text-sm text-gray-700">{new Date(data?.deployed_at).toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
            <p className="text-xs text-gray-500 mb-1">Deploy TX Hash</p>
            <p className="text-sm font-mono text-gray-900 break-all">{data?.deploy_tx_hash}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;