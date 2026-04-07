// src/pages/address/AddressInternalTransactions.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, CheckCircle, XCircle } from "lucide-react";
import { useGetInternalTransactionsQuery } from "../Transactions/transactionsApiSlice";
import { timeAgo } from "../../hooks/formats";

import Table from "../../ui/Table";
import Pagination from "../../ui/Pagination";
import LoadingSkeleton from "../../ui/LoadingSkeleton";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";
import AddressCell from "../../ui/AddressCell";
import TxHashCell from "../../ui/TxHashCell";

const PER_PAGE = 20;

const AddressInternalTransactions = ({ address }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } =
    useGetInternalTransactionsQuery({
      address,
      page,
      per_page: PER_PAGE,
    });

  const transactions = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  const columns = [
    {
      key: "tx_hash",
      header: "Tx Hash",
      render: (value) => <TxHashCell hash={value} />,
    },
    {
      key: "height",
      header: "Height",
      align: "right",
      render: (value) => (
        <Link
          to={`/blocks/${value}`}
          className="text-[#006666] hover:text-[#00ffc8] font-semibold text-[13px] font-medium transition-colors"
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
          className="text-slate-500 text-xs whitespace-nowrap"
          title={value}
        >
          {timeAgo(value)}
        </span>
      ),
    },
   
    {
      key: "from_address",
      header: "From",
      render: (value) => <AddressCell address={value} />,
    },
    {
      key: "arrow",
      header: "",
      render: () => (
        <div className="flex items-center justify-center">
          <ArrowRight size={14} className="text-slate-600" />
        </div>
      ),
    },
    {
      key: "to_address",
      header: "To",
      render: (value) => <AddressCell address={value} />,
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (value) => (
        <span className="text-sm font-semibold text-blue-400 font-mono">
          {value ? value.toLocaleString() : "—"}
        </span>
      ),
    },
   
    
  
  ];

  if (isLoading) {
    return <LoadingSkeleton rows={10} cols={9} />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
        <ErrorState
          message={
            error?.data?.message || "Failed to load internal transactions"
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
        <EmptyState
          icon={Layers}
          title="No internal transactions found"
          subtitle="This address hasn't made any internal transactions yet"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={transactions}
        rowKey="tx_hash"
        hoverable
        striped
        bordered
        rounded
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        perPage={PER_PAGE}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AddressInternalTransactions;