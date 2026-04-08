// src/pages/nft/NFTLatestMints.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, RefreshCw } from "lucide-react";
import { useGetNFTTransfersQuery } from "./nftApiSlice";
import { truncateAddress, timeAgo } from "../../hooks/formats";
import { useTheme } from "../../context/ThemeContext";

import ActionBadge from "../../ui/ActionBadge";
import EmptyState from "../../ui/EmptyState";
import ErrorState from "../../ui/ErrorState";
import Pagination from "../../ui/Pagination";
import LoadingSkeleton from "../../ui/LoadingSkeleton";
import AddressCell from "../../ui/AddressCell";
import TxHashCell from "../../ui/TxHashCell";
import Table from "../../ui/Table";

const PER_PAGE = 20;

const NFTLatestMints = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetNFTTransfersQuery({
      page,
      per_page: PER_PAGE,
      action: "mint",
    });

  const mints = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

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
      render: (value) => (
        <div className="">
          <span className="text-gray-800 text-xs font-medium">
            {timeAgo(value)}
          </span>

        </div>
      ),
    },
    {
      key: "to_address",
      header: "Minter",
      align: "center",
      render: (value) => <AddressCell address={value} />,
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

    {
      key: "token_id",
      header: "Token",
      align: "center",
      render: (value, row) => (
        <Link
          to={`/nft/collection/${row.contract_address}`}
          className="hover:opacity-80 transition-opacity"
        >
          <div className=" gap-1 cursor-pointer">
            <span
              className={`inline-block px-2 py-1 rounded-lg border text-xs font-semibold ${row.action === "mint"
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



  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <div className="flex items-center gap-4">

          <div>
            <h1 className="text-[22px] font-bold text-black tracking-tight m-0">
              NFT Latest Mints
            </h1>
            <p className="text-[13px] text-slate-500 mt-1 m-0">
              Real-time analysis of the most active digital collections on-chain.
            </p>
          </div>
        </div>

      </div>

      {/* ── Content ────────────────────────────────────── */}
      {isLoading ? (
        <LoadingSkeleton rows={10} cols={7} />
      ) : isError ? (
        <div className="rounded-2xl bg-slate-900/60 border border-white/6 backdrop-blur-xl overflow-hidden p-6">
          <ErrorState
            message={error?.data?.message || "Failed to load mints"}
            onRetry={refetch}
          />
        </div>
      ) : mints.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/60 border border-white/6 backdrop-blur-xl overflow-hidden p-6">
          <EmptyState
            title="No mints found"
            subtitle="New NFT mints will appear here"
          />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={mints}
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

export default NFTLatestMints;