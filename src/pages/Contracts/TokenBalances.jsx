// src/components/CW20/TokenBalances.jsx
import React from "react";
import { useGetBalancesQuery } from "../../api/cw20Api";

const TokenBalances = ({ contract, address }) => {
  const { data, isLoading, isError, error } = useGetBalancesQuery({
    page: 1,
    per_page: 20,
    contract,
    address,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading balances...</div>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Token Balances</h2>
      
      <div className="space-y-4">
        {data?.data?.map((balance, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Contract</p>
                <p className="text-sm font-mono text-gray-900 break-all">
                  {balance.contract_address}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm font-mono text-gray-900 break-all">
                  {balance.address}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Balance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {balance.balance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Updated Height</p>
                <p className="text-sm text-gray-700">{balance.updated_height}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenBalances;