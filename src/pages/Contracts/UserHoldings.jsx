// src/components/CW20/UserHoldings.jsx
import React, { useState } from "react";
import { useGetHoldingsQuery } from "../../api/cw20Api";

const UserHoldings = ({ address }) => {
  const [page, setPage] = useState(1);
  const perPage = 20;

  const { data, isLoading, isError, error } = useGetHoldingsQuery({
    address,
    page,
    per_page: perPage,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading holdings...</div>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Holdings</h2>
      <p className="text-sm text-gray-600 mb-6 font-mono break-all">{address}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((holding, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{holding.symbol}</h3>
              <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">
                {holding.name}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Balance</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(holding.balance / Math.pow(10, holding.decimals)).toLocaleString(undefined, {
                    maximumFractionDigits: 6
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Contract</p>
                <p className="text-xs font-mono text-gray-700 break-all">
                  {holding.contract_address}
                </p>
              </div>

              <div className="flex justify-between text-xs">
                <div>
                  <p className="text-gray-500">Decimals</p>
                  <p className="font-semibold text-gray-700">{holding.decimals}</p>
                </div>
                <div>
                  <p className="text-gray-500">Height</p>
                  <p className="font-semibold text-gray-700">{holding.updated_height}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {data?.page} of {data?.total_pages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= data?.total_pages}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserHoldings;