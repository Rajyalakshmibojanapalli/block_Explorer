import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetLatestBlockQuery, useGetBlockByHeightQuery } from './blockApiSlice';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  Copy,
  Check,
  ChevronRight,
  Clock,
  Box,
  ChevronLeft,
  Link as LinkIcon,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatJMC } from '../../hooks/formats';
// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

const LatestBlocks = () => {
  const { height } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Determine which query to use
  const isLatest = !height || height === 'latest';
  const blockHeight = height && height !== 'latest' ? parseInt(height, 10) : null;
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  // Use appropriate query based on route
  const {
    data: block,
    error,
    isLoading,
    refetch,
    isFetching
  } = isLatest
      ? useGetLatestBlockQuery()
      : useGetBlockByHeightQuery(blockHeight);

  if (isLoading) return <BlockSkeleton isDark={isDark} navigate={navigate} />;

  if (error || !block) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#0d1117]' : 'bg-[#f8f9fa]'}`}>
        <TopNav isDark={isDark} navigate={navigate} />
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className={`rounded border p-12 text-center ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {error?.message || 'Block not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    let ago = '';
    if (diff < 60) ago = `${diff} secs ago`;
    else if (diff < 3600) ago = `${Math.floor(diff / 60)} mins ago`;
    else if (diff < 86400) ago = `${Math.floor(diff / 3600)} hours ago`;
    else ago = `${Math.floor(diff / 86400)} days ago`;

    return {
      full: date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      ago
    };
  };

  const timestamp = formatTimestamp(block.time);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d1117]' : 'bg-[#f8f9fa]'}`}>
      <TopNav isDark={isDark} navigate={navigate} />

      <div className="max-w-[1280px] mx-auto px-4 py-5">

        {/* Page Title */}
        <div className="mb-4">
          <h1 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Box className="w-5 h-5" />
            Block <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>#{block.height?.toLocaleString()}</span>
            {isLatest && (
              <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                Latest
              </span>
            )}
          </h1>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => block.height > 1 && navigate(`/blocks/${block.height - 1}`)}
            disabled={block.height <= 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center border border-gray-400 gap-2 transition-all ${block.height <= 1
                ? 'opacity-50 cursor-not-allowed'
                : isDark
                  ? 'bg-[#21262d] hover:bg-[#30363d] text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => navigate(`/blocks/${block.height + 1}`)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex border border-gray-400 items-center gap-2 transition-all ${isDark
                ? 'bg-[#21262d] hover:bg-[#30363d] text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
          {!isLatest && (
            <button
              onClick={() => navigate('/blocks/latest')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${isDark
                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200'
                }`}
            >
              Go to Latest
            </button>
          )}
        </div>

        {/* Main Card */}
        <div className={`rounded border ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>

          {/* Overview Section */}
          <div className={`px-4 py-3 border-b ${isDark ? 'border-[#30363d]' : 'border-gray-200'}`}>
            <h2 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Overview
            </h2>
          </div>

          <div className={`divide-y ${isDark ? 'divide-[#30363d]' : 'divide-gray-100'}`}>

            {/* Block Height */}
            <DetailRow label="Block Height" isDark={isDark}>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {block.height?.toLocaleString()}
                </span>
              </div>
            </DetailRow>

            {/* Timestamp */}
            <DetailRow label="Timestamp" isDark={isDark}>
              <div className="flex items-center gap-2">
                <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {timestamp.ago}
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                  ({timestamp.full})
                </span>
              </div>
            </DetailRow>

            {/* Transactions */}
            <DetailRow label="Transactions" isDark={isDark}>
              <div className="flex items-center gap-2">
                <Link
                  to={`/blocks/${blockHeight}/transactions`}
                  className={`text-sm hover:underline ${isDark ? 'text-[#006666]' : 'text-[#006666]'}`}
                >
                  {block.tx_count?.toLocaleString()} transactions
                </Link>
                {block.internal_tx_count > 0 && (
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    ({block.internal_tx_count} internal)
                  </span>
                )}
              </div>
            </DetailRow>

            {/* Validated By */}
            <DetailRow label="Validated By" isDark={isDark}>
              <Link
                to={`/validators/leaderboard`}
                className={`text-sm hover:underline ${isDark ? 'text-[#006666]' : 'text-[#006666]'}`}
              >
                {block.validator_name || 'Unknown Validator'}
              </Link>
            </DetailRow>

            {/* Block Reward */}
            <DetailRow label="Block Reward" isDark={isDark}>
              <span
                className={`text-xs head font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
              >
                {formatJMC(block.reward)} JMC
              </span>
            </DetailRow>

            {/* Total Amount */}
            <DetailRow label="Total Amount" isDark={isDark}>
              <span className={`text-xs font-medium head ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                {(block.total_amount_sent / 1000000).toFixed(6)} JMC
              </span>
            </DetailRow>

          </div>

          {/* Gas Section */}
          <div className={`px-4 py-3 border-t border-b ${isDark ? 'border-[#30363d]' : 'border-gray-200'} mt-4`}>
            <h2 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Gas & Fees
            </h2>
          </div>

          <div className={`divide-y ${isDark ? 'divide-[#30363d]' : 'divide-gray-100'}`}>

            {/* Gas Used with Progress Bar */}
            <DetailRow label="Gas Used" isDark={isDark}>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                    {block.gas_used?.toLocaleString()}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                    ({block.gas_used && block.gas_wanted
                      ? ((block.gas_used / block.gas_wanted) * 100).toFixed(2)
                      : '0'}%)
                  </span>
                </div>
                <div className="w-1/8 bg-gray-300 dark:bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${block.gas_used && block.gas_wanted
                          ? ((block.gas_used / block.gas_wanted) * 100).toFixed(2)
                          : 0
                        }%`
                    }}
                  />
                </div>
              </div>
            </DetailRow>

            {/* Gas Limit */}
            <DetailRow label="Gas Limit" isDark={isDark}>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                {block.gas_wanted?.toLocaleString()}
              </span>
            </DetailRow>

            {/* Burnt Fees */}
            <DetailRow label="Total gas fee" isDark={isDark}>
              <span className={`text-sm head ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                {block.total_gas_fee_value / 1000000 || '0'} <span className="text-gray-500">JMC</span>
              </span>
            </DetailRow>

          </div>
          <div className={`rounded-lg border overflow-hidden mt-4 ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
            {/* Dropdown Header */}
            <button
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${isDark ? 'hover:bg-[#0d1117]' : 'hover:bg-gray-50'
                }`}
            >
              <h2 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                More Details
              </h2>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${showMoreDetails ? 'rotate-180' : 'rotate-0'} ${isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}
              />
            </button>

            {/* Dropdown Content with Smooth Animation */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${showMoreDetails ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className={`border-t ${isDark ? 'border-[#30363d]' : 'border-gray-200'}`}>
                <div className={`divide-y ${isDark ? 'divide-[#30363d]' : 'divide-gray-100'}`}>

                  {/* Hash */}
                  <DetailRow label="Hash" isDark={isDark}>
                    <div className="flex items-center gap-2">
                      <code className={`text-xs font-semibold head ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {block.hash}
                      </code>
                      <CopyBtn text={block.hash} isDark={isDark} />
                    </div>
                  </DetailRow>

                  {/* Parent Hash */}
                  <DetailRow label="Parent Hash" isDark={isDark}>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/blocks/${block.height - 1}`}
                        className={`text-xs font-semibold head hover:underline break-all ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                      >
                        {block.parent_hash}
                      </Link>
                      <CopyBtn text={block.parent_hash} isDark={isDark} />
                    </div>
                  </DetailRow>

                  {/* Proposer Address */}
                  <DetailRow label="Proposer Address" isDark={isDark}>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/address/${block.proposer_address}`}
                        className={`text-xs font-semibold head hover:underline break-all ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                      >
                        {block.proposer_address}
                      </Link>
                      <CopyBtn text={block.proposer_address} isDark={isDark} />
                    </div>
                  </DetailRow>

                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LatestBlocks;


const TopNav = ({ isDark, navigate }) => (
  <div className={`border-b ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
    <div className="max-w-[1280px] mx-auto px-4 py-3">
      <button
        onClick={() => navigate('/blocks')}
        className={`flex items-center gap-2 text-sm transition-colors ${isDark
            ? 'text-gray-400 hover:text-gray-300'
            : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blocks
      </button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// DETAIL ROW COMPONENT
// ═══════════════════════════════════════════════════════════

const DetailRow = ({ label, children, isDark }) => (
  <div className={`px-4 py-3 flex flex-row sm:flex-row sm:items-start gap-2 sm:gap-4 ${isDark ? 'hover:bg-[#0d1117]' : 'hover:bg-gray-50'
    } transition-colors`}>
    <div className="sm:w-[180px] flex-shrink-0">
      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
        {label}:
      </span>
    </div>
    <div className="flex-1 min-w-0">
      {children}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// COPY BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════

const CopyBtn = ({ text, isDark }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1 rounded transition-colors ${isDark
          ? 'hover:bg-[#21262d] text-gray-500 hover:text-gray-400'
          : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
        }`}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════
// SKELETON LOADER
// ═══════════════════════════════════════════════════════════

const BlockSkeleton = ({ isDark, navigate }) => (
  <div className={`min-h-screen ${isDark ? 'bg-[#0d1117]' : 'bg-[#f8f9fa]'}`}>
    <TopNav isDark={isDark} navigate={navigate} />

    <div className="max-w-[1280px] mx-auto px-4 py-5">
      <div className="mb-4">
        <div className={`h-6 w-48 rounded animate-pulse ${isDark ? 'bg-[#21262d]' : 'bg-gray-200'}`} />
      </div>

      <div className={`rounded border ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
        <div className={`px-4 py-3 border-b ${isDark ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <div className={`h-4 w-24 rounded animate-pulse ${isDark ? 'bg-[#21262d]' : 'bg-gray-200'}`} />
        </div>

        <div className={`divide-y ${isDark ? 'divide-[#30363d]' : 'divide-gray-100'}`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="px-4 py-3 flex gap-4">
              <div className={`w-[180px] h-4 rounded animate-pulse ${isDark ? 'bg-[#21262d]' : 'bg-gray-200'}`} />
              <div className={`flex-1 h-4 rounded animate-pulse ${isDark ? 'bg-[#21262d]' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);