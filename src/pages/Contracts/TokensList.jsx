// src/components/CW20/TokensList.jsx
import React, { useState } from "react";
import { useGetTokensQuery } from "../../api/cw20Api";

const TokensList = () => {
  const [page, setPage] = useState(1);
  const perPage = 20;

  const { data, isLoading, isError, error } = useGetTokensQuery({
    page,
    per_page: perPage,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading tokens...</div>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All CW20 Tokens</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Total Supply
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Creator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Deployed At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data?.map((token) => (
              <tr key={token.contract_address} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{token.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {token.symbol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                  {token.total_supply.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                  {token.creator.substring(0, 20)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(token.deployed_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-600 font-medium">
          Page {data?.page} of {data?.total_pages} • Total: {data?.total}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= data?.total_pages}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TokensList;