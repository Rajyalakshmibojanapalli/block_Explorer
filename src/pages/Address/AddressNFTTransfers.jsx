// src/pages/address/AddressNFTTransfers.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Image } from "lucide-react";
import { useGetNFTTransfersQuery } from "../NFTS/nftApiSlice";
import { timeAgo } from "../../hooks/formats";

import Table from "../../ui/Table";
import Pagination from "../../ui/Pagination";
import LoadingSkeleton from "../../ui/LoadingSkeleton";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";
import AddressCell from "../../ui/AddressCell";
import TxHashCell from "../../ui/TxHashCell";
import ActionBadge from "../../ui/ActionBadge";
import {truncateAddress} from "../../hooks/formats";
const PER_PAGE = 25;

const AddressNFTTransfers = ({ address }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useGetNFTTransfersQuery({
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
      key: "action",
      header: "Action",
      render: (value) => <ActionBadge action={value} />,
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
      header: "Time",
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
      render: (value) => (
        <AddressCell address={value} label={!value ? "Mint" : ""} />
      ),
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
              key: "type",
              header: "Type",
              align: "right",
              render: (value) => (
                <Link
                  to={`/block/${value}`}
                  className="text-[#006666]  head hover:text-[#00ffc8] font-mono text-[13px] font-medium transition-colors"
                >
                 JMC- {value?.toLocaleString()}
                </Link>
              ),
            },
     {
  key: "token_id",
  header: "Token",
  render: (value, row) => (
    <Link 
      to={`/nft/collection/${row.contract_address}`}
      className="hover:opacity-80 transition-opacity"
    >
      <div className="flex flex-col gap-1">
        <span
          className={`inline-block px-2 py-1 rounded-lg border text-xs font-semibold ${
            row.action === "mint"
              ? "bg-[#e5f7f8] border-[#006666] text-[#006666]"
              : "bg-[#e5f7f8] border-[#006666] text-[#006666]"
          }`}
        >
          {value || "—"}
        </span>
        <p 
          className="text-[10px] text-gray-700 font-semibold m-0 truncate hover:text-blue-600" 
          title={row.contract_address}
        >
          {truncateAddress(row.contract_address, 6, 4)}
        </p>
      </div>
    </Link>
  ),
} 
    
    
  ];

  if (isLoading) {
    return <LoadingSkeleton rows={10} cols={8} />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
        <ErrorState
          message={error?.data?.message || "Failed to load NFT transfers"}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
        <EmptyState
          icon={Image}
          title="No NFT transfers found"
          subtitle="This address hasn't made any NFT transfers yet"
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

export default AddressNFTTransfers;