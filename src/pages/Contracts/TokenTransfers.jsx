// src/components/CW20/TokenTransfers.jsx
import React, { useState } from "react";
import { useGetTransfersQuery } from "../../api/cw20Api";

const TokenTransfers = ({ contract }) => {
  const [page, setPage] = useState(1);
  const perPage = 20;

  const { data, isLoading, isError, error } = useGetTransfersQuery({
    page,
    per_page: perPage,
    contract,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading transfers...</div>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Token Transfers</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-orange-500 to-red-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                TX Hash
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data?.map((transfer) => (
              <tr key={transfer.id} className="hover:bg-orange-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {transfer.tx_hash.substring(0, 10)}...
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                    {transfer.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-600">
                  {transfer.from_address.substring(0, 15)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-600">
                  {transfer.to_address.substring(0, 15)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600">
                  {transfer.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                  {new Date(transfer.timestamp).toLocaleDateString()}
                  <br />
                  <span className="text-gray-500">
                    {new Date(transfer.timestamp).toLocaleTimeString()}
                  </span>
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
          className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-600 font-medium">
          Page {data?.page} of {data?.total_pages} • Total: {data?.total}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= data?.total_pages}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TokenTransfers;