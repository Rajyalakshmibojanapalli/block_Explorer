// src/pages/blocks/BlockTransactions.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetBlockTransactionsQuery } from './blockApiSlice';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Blocks,
  Activity,
  AlertCircle,
  FileText,
} from 'lucide-react';
import Table from '../../ui/Table';
import CopyBtn from '../../ui/CopyButton';
import { formatJMC } from '../../hooks/formats';

const BlockTransactions = () => {
  const { theme } = useTheme();
  const { height } = useParams();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const blockHeight = parseInt(height, 10);

  const { 
    data: txData, 
    error, 
    isLoading 
  } = useGetBlockTransactionsQuery(blockHeight);

  const handleTransactionClick = (tx) => {
    navigate(`/transactions/${tx.hash}`);
  };

  const handleBackToBlock = () => {
    navigate(`/blocks/${blockHeight}`);
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const truncateAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const getMethod = (msgTypes) => {
    if (msgTypes && msgTypes.length > 0) {
      const msgType = msgTypes[0];
      return msgType.split('.').pop();
    }
    return 'Unknown';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Define table columns
  const columns = [
    {
      key: 'success',
      header: '',
      width: 'w-12',
      align: 'center',
      render: (value) => (
        value ? (
          <FileText className="w-5 h-5 text-[#006666]" />
        ) : (
          <FileText className="w-5 h-5 text-red-500" />
        )
      ),
    },
    {
      key: 'hash',
      header: 'Txn Hash',
      render: (value) => (
        <div className="flex items-center gap-2">
          <code className={`text-xs font-semibold ${isDark ? 'text-[#006666]' : 'text-[#006666]'}`}>
            {truncateHash(value)}
          </code>
          <CopyBtn text={value} isDark={isDark} />
        </div>
      ),
    },
    {
      key: 'msg_types',
      header: 'Method',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isDark 
            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
            : 'bg-purple-50 text-purple-700 border border-purple-200'
        }`}>
          {getMethod(value)}
        </span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Time',
      render: (value) => (
        <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatTimestamp(value)}
        </span>
      ),
    },
    {
      key: 'transfers',
      header: 'From',
      render: (value, row) => {
        const transfer = value && value.length > 0 ? value[0] : null;
        if (!transfer) return <span className="text-xs text-gray-500 ">-</span>;
        
        return (
          <Link
            to={`/address/${transfer.from_address}`}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs font-semibold ${isDark ? 'text-[#00b2bd]' : 'text-[#006666]'} hover:underline`}
          >
            {truncateAddress(transfer.from_address)}
          </Link>
        );
      },
    },
    {
      key: 'transfers',
      header: 'To',
      render: (value) => {
        const transfer = value && value.length > 0 ? value[0] : null;
        if (!transfer) return <span className="text-xs text-gray-500">-</span>;
        
        return (
          <Link
            to={`/address/${transfer.to_address}`}
            onClick={(e) => e.stopPropagation()}
            className={`text-xs font-semibold ${isDark ? 'text-[#00b2bd]' : 'text-[#006666]'} hover:underline`}
          >
            {truncateAddress(transfer.to_address)}
          </Link>
        );
      },
    },
    {
      key: 'amount_value',
      header: 'Value',
      align: 'right',
      render: (value) => {
        const transfer = value && value.length > 0 ? value[0] : null;
        if (!transfer || !transfer.amount_value) {
          return <span className="text-xs font-semibold text-gray-500">0</span>;
        }
        
        return (
          <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {(total_transfers)} JMC
          </span>
        );
      },
    },
    {
      key: 'gas_used',
      header: 'Gas',
      align: 'right',
      render: (value, row) => (
        <div className="text-xs">
          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
            {value?.toLocaleString()}
          </span>
          <span className={`text-xs head font-semibold ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
            {' '}/ {row.gas_wanted?.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'fee',
      header: 'Txn Fee',
      align: 'right',
      render: (value) => (
        <span className={`text-xs head font-semibold ${isDark ? 'text-gray-400' : 'text-gray-800'}`}>
          {formatJMC(value)} JMC
        </span>
      ),
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0d1117]' : 'bg-[#f6f8fa]'}`}>
      {/* Top Navigation */}
      <div className={`border-b ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#d0d7de]'}`}>
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          <button
            onClick={handleBackToBlock}
            className={`flex items-center gap-2 text-sm hover:text-[#00b2bd] transition-colors ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Block #{blockHeight?.toLocaleString()}
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {/* <Blocks className="w-6 h-6 text-[#00b2bd]" /> */}
            <h1 className={`text-[21px] font-normal ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
              Transactions for Block <span className="font-medium">#{blockHeight?.toLocaleString()}</span>
            </h1>
          </div>
          {txData && (
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#57606a]'}`}>
              A total of {txData.tx_count || 0} transaction{txData.tx_count !== 1 ? 's' : ''} found
            </p>
          )}
        </div>



        {/* Table */}
        {isLoading ? (
          <LoadingSkeleton isDark={isDark} />
        ) : error ? (
          <ErrorState isDark={isDark} />
        ) : txData?.transactions && txData.transactions.length > 0 ? (
          <div className={`rounded-lg border overflow-hidden ${
            isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'
          }`}>
            

            <Table
              data={txData.transactions}
              columns={columns}
              isDark={isDark}
              hoverable
              striped
              onRowClick={handleTransactionClick}
              rowKey="hash"
            />
          </div>
        ) : (
          <EmptyState isDark={isDark} />
        )}
      </div>
    </div>
  );
};

// Stat Box Component
const StatBox = ({ label, value, isDark }) => (
  <div className={`p-4 rounded-lg ${isDark ? 'bg-[#161b22]' : 'bg-gray-50'}`}>
    <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      {label}
    </p>
    <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
      {value || '0'}
    </p>
  </div>
);

// Loading Skeleton
const LoadingSkeleton = ({ isDark }) => (
  <div className={`rounded-lg border ${
    isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'
  }`}>
    <div className={`px-6 py-4 border-b ${isDark ? 'border-[#30363d]' : 'border-[#d0d7de]'}`}>
      <div className={`h-5 w-32 rounded animate-pulse ${isDark ? 'bg-[#30363d]' : 'bg-gray-200'}`} />
    </div>
    <div className="p-6 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className={`h-4 w-full rounded ${isDark ? 'bg-[#30363d]' : 'bg-gray-200'}`} />
        </div>
      ))}
    </div>
  </div>
);

// Error State
const ErrorState = ({ isDark }) => (
  <div className={`rounded-lg border p-12 text-center ${
    isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'
  }`}>
    <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
    <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
      Failed to Load Transactions
    </h3>
    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#57606a]'}`}>
      There was an error loading transactions for this block.
    </p>
  </div>
);

// Empty State
const EmptyState = ({ isDark }) => (
  <div className={`rounded-lg border p-12 text-center ${
    isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-white border-[#d0d7de]'
  }`}>
    {/* <Activity className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} /> */}
    <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-[#1f2328]'}`}>
      No Transactions
    </h3>
    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#57606a]'}`}>
      This block doesn't contain any transactions.
    </p>
  </div>
);

export default BlockTransactions;