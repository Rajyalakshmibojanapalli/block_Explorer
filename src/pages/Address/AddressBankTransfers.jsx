// src/pages/address/AddressBankTransfers.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Send } from "lucide-react";
import { useGetAddressBankTransfersQuery } from "./addressApiSlice";
import { timeAgo } from "../../hooks/formats";

import Table from "../../ui/Table";
import Pagination from "../../ui/Pagination";
import LoadingSkeleton from "../../ui/LoadingSkeleton";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";
import AddressCell from "../../ui/AddressCell";
import TxHashCell from "../../ui/TxHashCell";

const PER_PAGE = 20;

const AddressBankTransfers = ({ address }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } =
    useGetAddressBankTransfersQuery({
      address,
      page,
      per_page: PER_PAGE,
    });

  const transfers = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  const columns = [
    {
      key: "tx_hash",
      header: "Tx Hash",
      render: (value) => <TxHashCell hash={value} />,
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
      render: (value, row) => (
        <div className="text-right">
          <p className="text-sm font-semibold text-emerald-400 font-mono">
            {row.amount_value?.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{row.denom}</p>
        </div>
      ),
    },
    {
      key: "height",
      header: "Height",
      align: "right",
      render: (value) => (
        <Link
          to={`/block/${value}`}
          className="text-[#00d4aa] hover:text-[#00ffc8] font-mono text-[13px] font-medium transition-colors"
        >
          {value?.toLocaleString()}
        </Link>
      ),
    },
    {
      key: "timestamp",
      header: "Time",
      align: "right",
      render: (value) => (
        <span className="text-slate-500 text-xs whitespace-nowrap" title={value}>
          {timeAgo(value)}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingSkeleton rows={10} cols={7} />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
        <ErrorState
          message={error?.data?.message || "Failed to load bank transfers"}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
        <EmptyState
          icon={Send}
          title="No bank transfers found"
          subtitle="This address hasn't made any bank transfers yet"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={transfers}
        rowKey="id"
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

export default AddressBankTransfers;