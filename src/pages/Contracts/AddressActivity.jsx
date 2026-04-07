// src/components/CW20/AddressActivity.jsx
import React, { useState } from "react";
import { useGetAddressActivityQuery } from "../../api/cw20Api";

const AddressActivity = ({ contract }) => {
  const [page, setPage] = useState(1);
  const perPage = 20;

  const { data, isLoading, isError, error } = useGetAddressActivityQuery({
    page,
    per_page: perPage,
    contract,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading address activity...</div>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Address Activity</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transfers Sent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Sent
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data?.map((activity, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {activity.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {activity.transfers_sent}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {activity.total_sent.toLocaleString()}
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
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {data?.page} of {data?.total_pages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= data?.total_pages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AddressActivity;