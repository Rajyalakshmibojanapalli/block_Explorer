
import React, { useState } from 'react';
import {
  useGetBlockByHeightQuery,
  useGetBlockTransactionsQuery,
  useGetBlockTransfersQuery
} from './blockApiSlice';
import { useTheme } from '../../context/ThemeContext';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import CopyBtn from '../../ui/CopyButton';
import { Link } from 'react-router-dom';
const BlockDetail = () => {
  const { theme } = useTheme();
  const { height } = useParams();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [showTransactions, setShowTransactions] = useState(false);

  const blockHeight = height ? parseInt(height, 10) : null;

  if (!blockHeight || isNaN(blockHeight)) {
    return <Navigate to="/blocks" replace />;
  }

  const {
    data: blockData,
    error: blockError,
    isLoading: blockLoading
  } = useGetBlockByHeightQuery(blockHeight);

  // Fetch transactions when needed
  const {
    data: txData,
    error: txError,
    isLoading: txLoading
  } = useGetBlockTransactionsQuery(blockHeight, {
    skip: !showTransactions
  });

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

  const handleTransactionClick = (txHash) => {
    navigate(`/transactions/${txHash}`);
  };

  if (blockLoading) return <LoadingSkeleton isDark={isDark} />;
  if (blockError) return <ErrorState onBack={() => navigate('/blocks')} isDark={isDark} />;

  const block = blockData;
  const timestamp = formatTimestamp(block.time);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d1117]' : 'bg-[#f6f8fa]'}`}>
      {/* Top Navigation */}
      <div className={`border-b ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'}`}>
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/blocks')}
            className={`flex items-center gap-2 text-sm hover:text-[#00b2bd] transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blocks
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className={`text-[21px] font-normal mb-2 ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
            Block <span className="font-medium">#{blockHeight?.toLocaleString()}</span>
          </h1>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => blockHeight > 1 && navigate(`/blocks/${blockHeight - 1}`)}
              disabled={blockHeight <= 1}
              className={`px-3 py-1.5 rounded-md border text-sm flex items-center gap-1 ${blockHeight <= 1
                  ? 'opacity-50 cursor-not-allowed'
                  : isDark
                    ? 'border-[#30363d] hover:border-[#8b949e] text-gray-300'
                    : 'border-[#d0d7de] hover:border-gray-400 text-gray-700'
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => navigate(`/blocks/${blockHeight + 1}`)}
              className={`px-3 py-1.5 rounded-md border text-sm flex items-center gap-1 ${isDark
                  ? 'border-[#30363d] hover:border-[#8b949e] text-gray-300'
                  : 'border-[#d0d7de] hover:border-gray-400 text-gray-700'
                }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className={`rounded-lg border ${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'
          }`}>
          <div className={`px-6 py-4 border-b ${isDark ? 'border-[#30363d]' : 'border-[#d0d7de]'}`}>
            <h2 className={`text-base font-medium ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
              Overview
            </h2>
          </div>

          <div className="divide-y divide-[#30363d]">
            {/* Block Height */}
            <DataRow
              label="Block Height"
              value={blockHeight?.toLocaleString()}
              isDark={isDark}
            />

            {/* Timestamp */}
            <DataRow
              label="Timestamp"
              value={
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span>{timestamp.ago}</span>
                  <span className={`${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                    ({timestamp.full})
                  </span>
                </div>
              }
              isDark={isDark}
            />


            <DataRow
              label="Transactions"
              value={
                <button
                  onClick={() => navigate(`/blocks/${blockHeight}/transactions`)}
                  className="text-[#00b2bd] hover:underline flex items-center gap-1"
                >
                  {block.tx_count || 0} transaction{block.tx_count !== 1 ? 's' : ''} in this block
                  <ExternalLink className="w-3 h-3" />
                </button>
              }
              isDark={isDark}
            />

            {/* Validator */}
            <DataRow
              label="Validated By"
              value={
                <div className="flex items-center gap-2">
                  <span className={isDark ? 'text-white' : 'text-[#1f2328]'}>
                    {block.validator_name || 'Unknown'}
                  </span>
                </div>
              }
              isDark={isDark}
            />

            {/* Block Reward */}
            <DataRow
              label="Block Reward"
              value={
                <span className={isDark ? 'text-white' : 'text-[#1f2328]'}>
                  {block.reward || '0'}
                </span>
              }
              isDark={isDark}
            />

            {/* Gas Used */}
            {/* <DataRow
              label="Gas Used"
              value={
                <div className="flex items-center gap-2">
                  <span>{block.gas_used?.toLocaleString() || '0'}</span>
                  <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>
                    ({block.gas_used && block.gas_wanted
                      ? ((block.gas_used / block.gas_wanted) * 100).toFixed(2)
                      : '0'}%)
                  </span>
                </div>
              }
              isDark={isDark}
            /> */}
            <DataRow
  label="Gas Used"
  value={
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span>{block.gas_used?.toLocaleString() || '0'}</span>
        <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>
          ({block.gas_used && block.gas_wanted
            ? ((block.gas_used / block.gas_wanted) * 100).toFixed(2)
            : '0'}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${
              block.gas_used && block.gas_wanted
                ? ((block.gas_used / block.gas_wanted) * 100).toFixed(2)
                : 0
            }%`
          }}
        />
      </div>
    </div>
  }
  isDark={isDark}
/>

            {/* Gas Limit */}
            <DataRow
              label="Gas Limit"
              value={block.gas_wanted?.toLocaleString() || '0'}
              isDark={isDark}
            />

            {/* Divider */}
            <div className={`h-2 ${isDark ? 'bg-[#161b22]' : 'bg-[#f6f8fa]'}`}></div>

            {/* Hash */}
            <DataRow
              label="Hash"
              value={
                <div className="flex items-center gap-2">
                  <code className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {block.hash}
                  </code>
                  <CopyBtn text={block.hash} isDark={isDark} />
                </div>
              }
              isDark={isDark}
            />

            {/* Parent Hash */}
            <DataRow
  label="Parent Hash"
  value={
    <div className="flex items-center gap-2">
      <Link 
        to={`/blocks/${block.height - 1}`}
        className={`text-sm hover:underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
      >
        <code className={isDark ? 'text-blue-400' : 'text-blue-600'}>
          {block.parent_hash}
        </code>
      </Link>
      <CopyBtn text={block.parent_hash} isDark={isDark} />
    </div>
  }
  isDark={isDark}
/>

            {/* Proposer Address */}
            <DataRow
              label="Proposer"
              value={
                <div className="flex items-center gap-2">
                  <code className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {block.proposer_address}
                  </code>
                  <CopyBtn text={block.proposer_address} isDark={isDark} />
                </div>
              }
              isDark={isDark}
            />
          </div>
        </div>

        {/* Transactions List */}
        {showTransactions && block.tx_count > 0 && (
          <div className={`rounded-lg border mt-4 ${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'
            }`}>
            <div className={`px-6 py-4 border-b ${isDark ? 'border-[#30363d]' : 'border-[#d0d7de]'}`}>
              <h2 className={`text-base font-medium ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
                Transactions
              </h2>
            </div>

            {txLoading ? (
              <div className="p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00b2bd] border-t-transparent"></div>
              </div>
            ) : txError ? (
              <div className="p-6">
                <div className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  Error loading transactions
                </div>
              </div>
            ) : txData?.transactions && txData.transactions.length > 0 ? (
              <div className="divide-y divide-[#30363d]">
                {txData.transactions.map((tx, index) => (
                  <TransactionRow
                    key={tx.hash || index}
                    tx={tx}
                    index={index}
                    isDark={isDark}
                    onClick={() => handleTransactionClick(tx.hash)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6">
                <div className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No transactions found
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Transaction Row Component
const TransactionRow = ({ tx, index, isDark, onClick }) => {
  const truncateHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div
      onClick={onClick}
      className={`px-6 py-4 cursor-pointer transition-colors ${isDark ? 'hover:bg-[#161b22]' : 'hover:bg-[#f6f8fa]'
        }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {tx.success ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>

          {/* Transaction Hash */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <code className={`text-sm font-mono ${isDark ? 'text-[#00b2bd]' : 'text-[#00b2bd]'}`}>
                {truncateHash(tx.hash)}
              </code>
            </div>
            <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {tx.method || 'Unknown Method'}
            </div>
          </div>

          {/* From/To */}
          <div className="hidden md:flex items-center gap-2">
            <div className="text-sm">
              <span className={isDark ? 'text-gray-500' : 'text-gray-600'}>From:</span>
              <code className={`ml-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                {truncateHash(tx.from_address)}
              </code>
            </div>
            <ArrowRight className="w-3 h-3 text-gray-500" />
            <div className="text-sm">
              <span className={isDark ? 'text-gray-500' : 'text-gray-600'}>To:</span>
              <code className={`ml-1 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                {truncateHash(tx.to_address)}
              </code>
            </div>
          </div>

          {/* Amount */}
          {tx.amount && (
            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
              {(parseFloat(tx.amount) / 1000000).toFixed(6)} JMC
            </div>
          )}
        </div>

        {/* External Link Icon */}
        <ExternalLink className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
      </div>
    </div>
  );
};

// Data Row Component
const DataRow = ({ label, value, isDark }) => (
  <div className={`px-6 py-4 border border-[#ffff] ${isDark ? 'hover:bg-[#161b22]' : 'hover:bg-[#f6f8fa]'} transition-colors`}>
    <div className="flex flex-row sm:flex-row sm:items-start gap-2">
      <div className={`sm:w-[200px] flex-shrink-0 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-[#57606a]'
        }`}>
        {label}:
      </div>
      <div className={`flex-1 text-sm ${isDark ? 'text-gray-300' : 'text-[#1f2328]'}`}>
        {value}
      </div>
    </div>
  </div>
);

// Loading Skeleton
const LoadingSkeleton = ({ isDark }) => (
  <div className={`min-h-screen ${isDark ? 'bg-[#0d1117]' : 'bg-[#f6f8fa]'}`}>
    <div className={`border-b ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'}`}>
      <div className="max-w-[1280px] mx-auto px-6 py-4">
        <div className={`h-5 w-32 rounded animate-pulse ${isDark ? 'bg-[#30363d]' : 'bg-gray-200'}`} />
      </div>
    </div>
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className={`h-8 w-48 rounded mb-6 animate-pulse ${isDark ? 'bg-[#30363d]' : 'bg-gray-200'}`} />
      <div className={`rounded-lg border ${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'}`}>
        <div className={`px-6 py-4 border-b ${isDark ? 'border-[#30363d]' : 'border-[#d0d7de]'}`}>
          <div className={`h-5 w-24 rounded animate-pulse ${isDark ? 'bg-[#30363d]' : 'bg-gray-200'}`} />
        </div>
        <div className="p-6 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className={`h-4 w-40 rounded animate-pulse ${isDark ? 'bg-[#30363d]' : 'bg-gray-200'}`} />
              <div className={`h-4 flex-1 rounded animate-pulse ${isDark ? 'bg-[#30363d]' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Error State
const ErrorState = ({ onBack, isDark }) => (
  <div className={`min-h-screen ${isDark ? 'bg-[#0d1117]' : 'bg-[#f6f8fa]'}`}>
    <div className={`border-b ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'}`}>
      <div className="max-w-[1280px] mx-auto px-6 py-4">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-sm hover:text-[#00b2bd] transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blocks
        </button>
      </div>
    </div>
    <div className="max-w-[1280px] mx-auto px-6 py-20">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDark ? 'bg-red-500/10' : 'bg-red-50'
          }`}>
          <AlertCircle className={`w-8 h-8 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
        </div>
        <h2 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
          Block not found
        </h2>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#57606a]'}`}>
          The block you're looking for doesn't exist or couldn't be loaded.
        </p>
      </div>
    </div>
  </div>
);

export default BlockDetail;