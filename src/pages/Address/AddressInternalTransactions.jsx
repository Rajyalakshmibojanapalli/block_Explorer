// src/pages/address/AddressInternalTransactions.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, CheckCircle, XCircle } from "lucide-react";
import { useGetInternalTransactionsQuery } from "../Transactions/transactionsApiSlice";
import { timeAgo, formatJMC } from "../../hooks/formats";
import { useTheme } from "../../context/ThemeContext";

import Table from "../../ui/Table";
import Pagination from "../../ui/Pagination";
import LoadingSkeleton from "../../ui/LoadingSkeleton";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";
import AddressCell from "../../ui/AddressCell";
import TxHashCell from "../../ui/TxHashCell";

const AddressInternalTransactions = ({ address }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  
  const { data, isLoading, isError, error, isFetching, refetch } =
    useGetInternalTransactionsQuery({
      address,
      page,
      per_page: perPage,
    });

  // Extract transactions and pagination from API response
  const transactions = data?.data || [];
  const paginationData = {
    page: data?.page || page,
    per_page: data?.per_page || perPage,
    total: data?.total || 0,
    total_pages: data?.total_pages || 1,
  };

  const columns = [
    {
      key: "tx_hash",
      header: "Tx Hash",
      align:'center',
      render: (value) => <TxHashCell hash={value} />,
    },
    {
      key: "height",
      header: "Height",
      align:'center',
      render: (value) => (
        <Link
          to={`/blocks/${value}`}
          className="text-[#006666] hover:text-[#00ffc8] font-semibold text-[13px] transition-colors"
        >
          {value?.toLocaleString()}
        </Link>
      ),
    },
    {
      key: "timestamp",
      header: "Age",
      align: "right",
      render: (value) => (
        <span
          className={`text-xs whitespace-nowrap ${
            isDark ? "text-gray-400" : "text-slate-500"
          }`}
          title={value}
        >
          {timeAgo(value)}
        </span>
      ),
    },
    {
      key: "from_address",
      header: "From",
      align:'center',
      render: (value) => <AddressCell address={value} />,
    },
    {
      key: "arrow",
      header: "",
      render: () => (
        <div className="flex items-center justify-center">
          <ArrowRight
            size={14}
            className={isDark ? "text-gray-600" : "text-slate-600"}
          />
        </div>
      ),
    },
    {
      key: "to_address",
      header: "To",
      align:'center',
      render: (value) => <AddressCell address={value} />,
    },
    {
      key: "amount",
      header: "Amount",
      align:'center',
      render: (value) => (
        <span className="text-xs head font-semibold text-[#006666] font-mono">
          {formatJMC(value)} JMC
        </span>
      ),
    },
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <LoadingSkeleton rows={10} cols={7} isDark={isDark} />;
  }

  if (isError) {
    return (
      <div
        className={`rounded-2xl p-6 border ${
          isDark
            ? "bg-gray-800/60 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <ErrorState
          message={
            error?.data?.message || "Failed to load internal transactions"
          }
          onRetry={refetch}
          isDark={isDark}
        />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div
        className={`rounded-2xl p-6 border ${
          isDark
            ? "bg-gray-800/60 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <EmptyState
          icon={Layers}
          title="No internal transactions found"
          subtitle="This address hasn't made any internal transactions yet"
          isDark={isDark}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div
        className={`rounded-lg border overflow-hidden ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <Table
          columns={columns}
          data={transactions}
          rowKey="tx_hash"
          hoverable
          striped
          bordered={false}
          rounded={false}
          isDark={isDark}
        />
      </div>

      {/* Pagination */}
      {paginationData.total_pages > 1 && (
        <Pagination
          currentPage={paginationData.page}
          totalPages={paginationData.total_pages}
          totalItems={paginationData.total}
          itemsPerPage={paginationData.per_page}
          onPageChange={handlePageChange}
          isDark={isDark}
          isLoading={isFetching}
        />
      )}
    </div>
  );
};

export default AddressInternalTransactions;