
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Coins, Package, TrendingUp, TrendingDown, Wallet, Image, Grid3x3, Hash } from "lucide-react";
import { useGetHoldingsQuery } from "../Contracts/CW20ApiSlice";
import { useGetNFTHoldingsQuery } from "../NFTS/nftApiSlice";
import Table from "../../ui/Table";
import Pagination from "../../ui/Pagination";
import LoadingSkeleton from "../../ui/LoadingSkeleton";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";
import { truncateAddress } from "../../hooks/formats";
import TxHashCell from "../../ui/TxHashCell";

const AddressAssets = ({ address }) => {
  const [tokenPage, setTokenPage] = useState(1);
  const [nftPage, setNftPage] = useState(1);
  const [activeTab, setActiveTab] = useState("tokens");
  const perPage = 20;
  
  // CW20 Token Holdings Query
  const { 
    data: tokenData, 
    isLoading: isTokenLoading, 
    isError: isTokenError, 
    error: tokenError, 
    refetch: refetchTokens 
  } = useGetHoldingsQuery(
    { 
      address: address,
      page: tokenPage,
      per_page: perPage 
    },
    { skip: !address }
  );

  // NFT Holdings Query
  const { 
    data: nftData, 
    isLoading: isNftLoading, 
    isError: isNftError, 
    error: nftError, 
    refetch: refetchNfts 
  } = useGetNFTHoldingsQuery(
    {
      address: address,
      page: nftPage,
      per_page: perPage
    },
    { skip: !address }
  );

  const tokenHoldings = tokenData?.data || [];
  const nftHoldings = nftData?.data || [];
  
  const tokenTotal = tokenData?.total || 0;
  const tokenTotalPages = tokenData?.total_pages || 1;
  
  const nftTotal = nftData?.total || 0;
  const nftTotalPages = nftData?.total_pages || 1;

  // Helper function to format balance
  const formatBalance = (balance, decimals) => {
    if (!balance || !decimals) return "0";
    const value = balance / Math.pow(10, decimals);
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  };

  // Calculate total value (if price data available)
  const calculateTotalValue = () => {
    return tokenHoldings.reduce((acc, holding) => {
      const balance = holding.balance / Math.pow(10, holding.decimals);
      const value = holding.price_usd ? balance * holding.price_usd : 0;
      return acc + value;
    }, 0);
  };

  // Token columns
  const tokenColumns = [
    {
      key: "rank",
      header: "#",
       align:'center',
      render: (_, __, index) => (
        <span className="text-slate-500 text-xs font-medium">
          {(tokenPage - 1) * perPage + index + 1}
        </span>
      ),
    },
    {
      key: "token",
      header: "Token",
       align:'center',
      render: (_, row) => (
        <div className="inline-flex items-center gap-3">
          {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500/20 to-gray-500/20 border border-gray-500/30 flex items-center justify-center">
            <Coins size={16} className="text-gray-600" />
          </div> */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">
                {row.symbol}
              </span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                CW20
              </span>
            </div>
            <p className="text-xs text-slate-500">{row.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contract_address",
      header: "Contract",
      align:'center',
      render: (value) => (
        <Link
          to={`/contract/${value}`}
          className="text-[#006666] font-semibold text-xs transition-colors"
        >
          {truncateAddress(value, 10, 10)}
        </Link>
      ),
    },
    {
      key: "balance",
      header: "Balance",
       align:'center',
      render: (value, row) => (
        <div className="">
          <p className="text-sm head font-semibold text-gray-700">
            {formatBalance(value, row.decimals)} {row.symbol}
          </p>
        </div>
      ),
    },
    {
      key: "value",
      header: "Value",
       align:'center',
      render: (_, row) => {
        if (row.price_usd) {
          const balance = row.balance / Math.pow(10, row.decimals);
          const value = balance * row.price_usd;
          return (
            <span className="text-sm font-bold text-emerald-600 font-mono">
              ${value.toLocaleString(undefined, { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </span>
          );
        }
        return <span className="text-xs text-slate-600">—</span>;
      },
    },
  ];

  // NFT columns
  const nftColumns = [
    {
      key: "rank",
      header: "s.no",
       align:'center',
      render: (_, __, index) => (
        <span className="text-slate-500 text-xs font-medium">
          {(nftPage - 1) * perPage + index + 1}
        </span>
      ),
    },
    {
      key: "collection",
      header: "Collection",
       align:'center',
      render: (_, row) => (
        <div className="inline-flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-gray-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Image size={18} className="text-indigo-600" />
          </div> */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">
                {row.collection_name}
              </span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700">
                NFT
              </span>
            </div>
            <p className="text-xs text-slate-500">{row.collection_symbol}</p>
          </div>
        </div>
      ),
    },
    {
      key: "token_id",
      header: "Token ID",
       align:'center',
      render: (value) => (
        <div className="flex items-center gap-2">
          {/* <Hash size={14} className="text-slate-400" /> */}
          <span className="font-semibold text-sm text-gray-700">{value}</span>
        </div>
      ),
    },
    {
      key: "contract_address",
      header: "Contract",
       align:'center',
      render: (value) => (
        <Link
          to={`/contract/${value}`}
          className="text-[#006666] font-semibold text-xs transition-colors"
        >
          {truncateAddress(value, 10, 10)}
        </Link>
      ),
    },
    {
      key: "minted_height",
      header: "Minted At",
       align:'center',
      render: (value) => (
        <Link
          to={`/blocks/${value}`}
          className="text-[#006666]  font-semibold text-xs transition-colors"
        >
          {value?.toLocaleString()}
        </Link>
      ),
    },
    {
      key: "mint_tx",
      header: "Mint Transaction",
       align:'center',
      render: (value) => <TxHashCell hash={value} />,
    },
  ];

  if (!address) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-white/6 p-6">
        <div className="text-slate-400 text-center">No address provided</div>
      </div>
    );
  }

  const totalValue = calculateTotalValue();

  return (
    <div className="space-y-6">


      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("tokens")}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
            activeTab === "tokens"
              ? "border-gray-600 text-gray-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <Coins size={16} />
            Token Holdings ({tokenTotal})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("nfts")}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
            activeTab === "nfts"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <Image size={16} />
            NFT Holdings ({nftTotal})
          </div>
        </button>
      </div>

      {/* Token Holdings Tab */}
      {activeTab === "tokens" && (
        <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Coins size={20} className="text-gray-600" />
              CW20 Token Holdings
            </h3>
          </div>
          
          {isTokenLoading ? (
            <LoadingSkeleton rows={5} cols={5} />
          ) : isTokenError ? (
            <div className="p-6">
              <ErrorState
                message={tokenError?.message || "Failed to load tokens"}
                onRetry={refetchTokens}
              />
            </div>
          ) : tokenHoldings.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Package}
                title="No token holdings found"
                subtitle="This address doesn't hold any CW20 tokens"
              />
            </div>
          ) : (
            <>
              <Table
                columns={tokenColumns}
                data={tokenHoldings}
                rowKey={(row, index) => row.contract_address || index}
                hoverable
                striped
                bordered={false}
                rounded={false}
              />
              
              {tokenTotalPages > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <Pagination
                    page={tokenPage}
                    totalPages={tokenTotalPages}
                    total={tokenTotal}
                    perPage={perPage}
                    onPageChange={setTokenPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* NFT Holdings Tab */}
      {activeTab === "nfts" && (
        <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Image size={20} className="text-indigo-600" />
              NFT Holdings
            </h3>
          </div>
          
          {isNftLoading ? (
            <LoadingSkeleton rows={5} cols={6} />
          ) : isNftError ? (
            <div className="p-6">
              <ErrorState
                message={nftError?.message || "Failed to load NFTs"}
                onRetry={refetchNfts}
              />
            </div>
          ) : nftHoldings.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Image}
                title="No NFT holdings found"
                subtitle="This address doesn't hold any NFTs"
              />
            </div>
          ) : (
            <>
              <Table
                columns={nftColumns}
                data={nftHoldings}
                rowKey={(row, index) => `${row.contract_address}-${row.token_id}` || index}
                hoverable
                striped
                bordered={false}
                rounded={false}
              />
              
              {nftTotalPages > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <Pagination
                    page={nftPage}
                    totalPages={nftTotalPages}
                    total={nftTotal}
                    perPage={perPage}
                    onPageChange={setNftPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressAssets;