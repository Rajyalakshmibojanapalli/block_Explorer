// src/pages/nft/NFTTrades.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, RefreshCw, Filter } from "lucide-react";
import { useGetNFTTransfersQuery } from "./nftApiSlice";
import { truncateAddress, timeAgo } from "../../hooks/formats";

import ActionBadge from "../../ui/ActionBadge";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import Pagination from "../../ui/Pagination";
import LoadingSkeleton from "../../ui/LoadingSkeleton";
import AddressCell from "../../ui/AddressCell";
import TxHashCell from "../../ui/TxHashCell";
import Table, { TimeAgo } from "../../ui/Table";

const PER_PAGE = 20;

const FILTER_OPTIONS = [
  { label: "All Activity", value: undefined },
  { label: "Transfers", value: "transfer_nft" },
  { label: "Mints", value: "mint" },
];

const NFTTrades = () => {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState(undefined);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetNFTTransfersQuery({
      page,
      per_page: PER_PAGE,
      action: actionFilter,
    });

  const trades = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  const handleFilterChange = (value) => {
    setActionFilter(value);
    setPage(1);
  };

  // ─── Table Configuration ──────────────────────────────────────
  const columns = [
    {
      key: "tx_hash",
      header: "Tx Hash",
      align: "center",
      render: (value) => <TxHashCell hash={value} />,
    },
     {
      key: "height",
      header: "Block",
      align: "center",
      render: (value) => (
        <Link
          to={`/blocks/${value}`}
          className="text-[#006666] hover:text-cyan-400 font-semibold text-[13px] font-medium transition-colors no-underline"
        >
          {value?.toLocaleString()}
        </Link>
      ),
    },
     {
      key: "timestamp",
      header: "Age",
      align: "center",
      render: (value) => (<TimeAgo timestamp={(value)}/>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (value) => <ActionBadge action={value} />,
    },
    {
      key: "from_address",
      header: "Buyer",
      align: "center",
      render: (value, row) => (
        <AddressCell
          address={value}
          label={row.action === "mint" ? " Null:00x00000" : "—"}
        />
      ),
    },
     {
      key: "arrow",
      header: "",
      render: (value, row) => (
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            row.action === "mint"
              ? "bg-emerald-500/15"
              : "bg-emerald-500/15"
          }`}
        >
          <ArrowRight
            size={12}
            className={row.action === "mint" ? "text-[#006666]" : "text-[#006666]"}
          />
        </div>
      ),
    },
    {
      key: "to_address",
      header: "Sellar",
      align: "center",
      render: (value,row) => (
        <AddressCell
          address={value}
          label={row.action === "mint" ? " Minted" : "—"}
        />
      ),
    },


{
  key: "token_id",
  header: "Token",
  align: "center",
  render: (value, row) => (
    <Link 
      to={`/nft/collection/${row.contract_address}`}
      className="hover:opacity-80 transition-opacity"
    >
      <div className="flex flex-col gap-1 cursor-pointer">
        <span
          className={`inline-block px-2 py-1 rounded-lg border text-xs font-semibold ${
            row.action === "mint"
              ? "bg-[#e5f7f8] border-[#006666] text-[#006666] hover:bg-[#d0f0f2]"
              : "bg-[#e5f7f8] border-[#006666] text-[#006666] hover:bg-[#d0f0f2]"
          } transition-colors`}
        >
          {value || "—"}
        </span>
        <p 
          className={`text-[10px] font-semibold m-0 truncate hover:text-blue-600 transition-colors `}
          title={row.contract_address}
        >
          {truncateAddress(row.contract_address, 6, 4)}
        </p>
      </div>
    </Link>
  ),
},
 {
      key: "type",
      header: "Type",
      align: "center",
      render: (value) => (
        <span
          className="text-gray-700 font-semibold head text-xs "
          title={value}
        >
          JMC-{(value)}
        </span>
      ),
    },
    

   
   
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
        <div className="flex items-center gap-4">
        
          <div>
            <h1 className="text-[22px] font-bold text-black tracking-tight m-0">
              NFT Trades
            </h1>
            <p className="text-[13px] text-slate-500 mt-1 m-0">
              All NFT transactions including mints, transfers & trades
            </p>
          </div>
        </div>
        
      </div>

      {/* ── Filter Tabs ───────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-white border border-white/6">
        {/* <Filter size={14} className="text-slate-500" /> */}
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => handleFilterChange(opt.value)}
            className={`px-4 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all ${
              actionFilter === opt.value
                ? " border-[#006666] text-[#006666] bg-[#e5f7f8] "
                : "border-white/6 bg-white/3 text-slate-500 hover:bg-white/5 hover:text-slate-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Content ────────────────────────────────────── */}
      {isLoading ? (
        <LoadingSkeleton rows={10} cols={8} />
      ) : isError ? (
        <div className="rounded-2xl bg-slate-900/60 border border-white/6 backdrop-blur-xl overflow-hidden p-6">
          <ErrorState
            message={error?.data?.message || "Failed to load activity"}
            onRetry={refetch}
          />
        </div>
      ) : trades.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/60 border border-white/6 backdrop-blur-xl overflow-hidden p-6">
          <EmptyState
            title="No activity found"
            subtitle="NFT activity will appear here as transactions are processed"
          />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={trades}
            rowKey="id"
            hoverable={true}
            striped={true}
            bordered={true}
            rounded={true}
          />
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              perPage={PER_PAGE}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NFTTrades;