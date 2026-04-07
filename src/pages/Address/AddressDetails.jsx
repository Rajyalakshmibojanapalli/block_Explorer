// src/pages/address/AddressDetails.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, RefreshCw,QrCode,ExternalLink , ChevronDown, Coins } from "lucide-react";
import {
  useGetAddressQuery,
  useGetAddressBalancesQuery,
} from "./addressApiSlice";
import { useGetHoldingsQuery } from "../Contracts/CW20ApiSlice";
import { truncateAddress } from "../../hooks/formats";
import { useTheme } from "../../context/ThemeContext";

import LoadingSkeleton from "../../ui/LoadingSkeleton";
import ErrorState from "../../ui/ErrorState";
import AddressTransactions from "./AddressTransactions";
import AddressInternalTransactions from "./AddressInternalTransactions";
import AddressCw20Transfers from "./AddressCw20Transfers";
import AddressAssets from "./AddressVotes";
import AddressNFTTransfers from "./AddressNFTTransfers";

const AddressDetails = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState("transactions");
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    data: addressData,
    isLoading: isLoadingAddress,
    isError: isErrorAddress,
    error: errorAddress,
    refetch: refetchAddress,
  } = useGetAddressQuery(address);

  const {
    data: balancesData,
    isLoading: isLoadingBalances,
    refetch: refetchBalances,
  } = useGetAddressBalancesQuery(address);

  const {
    data: cw20HoldingsData,
    isLoading: isLoadingCw20,
    refetch: refetchCw20Holdings,
  } = useGetHoldingsQuery({
    address,
    page: 1,
    per_page: 50,
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    refetchAddress();
    refetchBalances();
    refetchCw20Holdings();
  };

  const formatBalance = (balance, decimals = 6) => {
    const divisor = Math.pow(10, decimals);
    return (balance / divisor).toLocaleString();
  };

  const formatNativeBalance = (amount) => {
    const divisor = Math.pow(10, 6);
    return (parseInt(amount) / divisor).toLocaleString();
  };

  const tabs = [
    { id: "transactions", label: "Transactions" },
    { id: "internal", label: "Internal Txns" },
    { id: "cw20", label: "Token Transfers" },
    { id: "nft", label: "NFT Transfers" },
    { id: "assets", label: "Assets" },
  ];

  if (isLoadingAddress || isLoadingBalances) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-[#f5f7f9]'}`}>
        <LoadingSkeleton rows={10} cols={1} />
      </div>
    );
  }

  if (isErrorAddress) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-[#f5f7f9]'}`}>
        <div className={`max-w-7xl mx-auto px-6 py-8 rounded-lg border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <ErrorState
            message={errorAddress?.data?.message || "Failed to load address"}
            onRetry={refetchAddress}
          />
        </div>
      </div>
    );
  }

  const nativeBalances = balancesData?.balances || [];
  const cw20Holdings = cw20HoldingsData?.data || [];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-[#f5f7f9]'}`}>
      {/* Back Button Header */}
      <div className={`border-b ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
       <div className="mb-0">
  <div className="pb-1">
    {/* Label */}
   
    
    {/* Address Container */}
    <div className={`flex items-start sm:items-center gap-3 p-3 rounded-lg ${
      isDark ? 'bg-[#161b22]' : 'bg-[#f8f9fa]'
    }`}>
       {/* <s
        */}
      {/* Address */}
      <code className={`flex-1 head text-sm sm:text-sm font-semibold break-all ${
        isDark ? 'text-white' : 'text-[#006666]'
      }`}>
        <span className="text-[15px] text-black">Address: </span> {address}
      </code>
      
      {/* Action buttons */}
      <div className="flex items-center  gap-1 flex-shrink-0">
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`p-2 rounded-md transition-colors ${
            isDark 
              ? 'hover:bg-[#21262d] text-gray-500 hover:text-gray-300' 
              : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
          }`}
          title="Copy address"
        >
          {copied ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} />
          )}
        </button>
        
        
      
      </div>
    </div>
  </div>
</div>

        {/* Token Holdings Card */}
{/* Token Holdings Dropdown */}
<div className={`rounded-lg border mb-6 ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'}`}>
  {/* Dropdown Header */}
  <button
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
      isDark ? 'hover:bg-[#0d1117]' : 'hover:bg-[#f6f8fa]'
    }`}
  >
    <div className="flex items-center gap-3">
      <h2 className={`text-base font-medium ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
        Token Holdings
      </h2>
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
        isDark ? 'bg-[#21262d] text-gray-400' : 'bg-gray-100 text-gray-600'
      }`}>
        {nativeBalances.length + cw20Holdings.length}
      </span>
    </div>
    <ChevronDown 
      size={18} 
      className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''} ${
        isDark ? 'text-gray-500' : 'text-[#57606a]'
      }`}
    />
  </button>

  {/* Dropdown Content */}
  {isDropdownOpen && (
    <div className={`border-t ${isDark ? 'border-[#30363d]' : 'border-[#d0d7de]'}`}>
      <div className="divide-y divide-[#30363d]">
        {/* Native Balances */}
        {nativeBalances.map((balance, index) => (
          <div 
            key={`native-${index}`} 
            className={`px-6 py-4 ${isDark ? 'hover:bg-[#0d1117]' : 'hover:bg-[#f6f8fa]'} transition-colors`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  isDark ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-blue-400 to-blue-500'
                }`}>
                  {balance.denom.replace('u', '').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
                    {balance.denom.replace('u', '').toUpperCase()}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#57606a]'}`}>
                    Native Token
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-mono font-medium ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
                  {formatNativeBalance(balance.amount)}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#57606a]'}`}>
                  {balance.denom.replace('u', '').toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* CW20 Holdings */}
        {isLoadingCw20 ? (
          <div className={`px-6 py-8 text-center ${isDark ? 'text-gray-400' : 'text-[#57606a]'}`}>
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#00b2bd] border-t-transparent"></div>
              <span className="text-sm">Loading CW20 tokens...</span>
            </div>
          </div>
        ) : (
          cw20Holdings.map((holding, index) => (
            <div 
              key={`cw20-${index}`} 
              className={`px-6 py-4 ${isDark ? 'hover:bg-[#0d1117]' : 'hover:bg-[#f6f8fa]'} transition-colors`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    isDark ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-purple-400 to-purple-500'
                  }`}>
                    {holding.symbol.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
                      {holding.name}
                    </div>
                    <code className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-[#57606a]'}`}>
                      {truncateAddress(holding.contract_address, 6, 4)}
                    </code>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-mono font-medium ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
                    {formatBalance(holding.balance, holding.decimals)}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#57606a]'}`}>
                    {holding.symbol}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Empty State */}
        {nativeBalances.length === 0 && cw20Holdings.length === 0 && !isLoadingCw20 && (
          <div className={`px-6 py-12 text-center ${isDark ? 'text-gray-400' : 'text-[#57606a]'}`}>
            <Coins size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No tokens found</p>
          </div>
        )}
      </div>
    </div>
  )}
</div>

        {/* Tabs */}
        <div className={`border-b mb-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? `text-[#006666] border-b-2 border-[#00b2bd]`
                    : `${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "transactions" && (
            <AddressTransactions address={address} />
          )}
          {activeTab === "internal" && (
            <AddressInternalTransactions address={address} />
          )}
          {activeTab === "cw20" && <AddressCw20Transfers address={address} />}
          {activeTab === "nft" && <AddressNFTTransfers address={address} />}
          {activeTab === "assets" && <AddressAssets address={address} />}
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;