
import React, { useState } from 'react';
import {
  useGetTransactionByHashQuery,
  useGetTransactionEventsQuery,
  useGetTransactionLogsQuery,
  useGetInternalTransactionsByHashQuery
} from './transactionsApiSlice';
import { useTheme } from '../../context/ThemeContext';
import { timeAgo, getMethodColor, formatMethod, formatTime, formatTimestamp, parseFee, formatAmount } from '../../hooks/formats';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import CopyBtn from '../../ui/CopyButton';
import { Badge } from "../../ui/Table";
import Table from '../../ui/Table';

// Tooltip Component
const Tooltip = ({ text, children, isDark }) => (
  <div className="relative group/tip inline-block">
    {children}
    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded text-xs z-50
      opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible
      transition-all duration-200 whitespace-nowrap shadow-lg pointer-events-none
      ${isDark ? 'bg-gray-950 border border-gray-700 text-gray-300' : 'bg-gray-900 text-white'}
    `}>
      {text}
      <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1
        ${isDark ? 'bg-gray-950' : 'bg-gray-900'}
      `} />
    </div>
  </div>
);

// Helper Functions
const isAddress = (value) => {
  return typeof value === 'string' && (value.startsWith('jaimax') || value.startsWith('0x'));
};

const getEventTypeColor = (eventType, isDark) => {
  const colors = {
    coin_spent: isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-200',
    coin_received: isDark ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-700 border-green-200',
    transfer: isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200',
    message: isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200',
    tx: isDark ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border-yellow-200',
    execute: isDark ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200',
    wasm: isDark ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : 'bg-pink-100 text-pink-700 border-pink-200',
  };
  return colors[eventType] || colors.message;
};

// Main Component
const TransactionDetails = ({ txHash, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('overview');

  // API Queries
  const { data: txData, error: txError, isLoading: txLoading } = useGetTransactionByHashQuery(txHash, {
    skip: !txHash
  });

  const { data: logsData, error: logsError, isLoading: logsLoading } = useGetTransactionLogsQuery(txHash, {
    skip: !txHash || activeTab !== 'logs'
  });

  const { data: internalData, error: internalError, isLoading: internalLoading } = useGetInternalTransactionsByHashQuery(txHash, {
    skip: !txHash || activeTab !== 'internal'
  });

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'internal', label: 'Internal Transactions' },
    { id: 'logs', label: 'Logs' },
  ];

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-[#f5f7f9]'} min-h-screen`}>
      {/* Header Section */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <button
            onClick={onClose}
            className={`flex items-center gap-2 text-sm font-medium mb-4 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              } transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Transactions
          </button>

          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Transaction Details
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-0 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? `border-[#00b2bd] text-[#00b2bd]`
                    : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewTab data={txData} error={txError} isLoading={txLoading} isDark={isDark} />
        )}
        {activeTab === 'internal' && (
          <InternalTransactionsTab
            data={internalData}
            error={internalError}
            isLoading={internalLoading}
            isDark={isDark}
          />
        )}
        {activeTab === 'logs' && (
          <LogsTab
            data={logsData}
            error={logsError}
            isLoading={logsLoading}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;

// ═══════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════

const OverviewTab = ({ data, error, isLoading, isDark }) => {
  if (isLoading) return <OverviewSkeleton isDark={isDark} />;

  if (error) {
    return (
      <div className={`rounded-xl border p-8 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <XCircle className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
        <p className={`font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          {error?.data?.message || error?.message || 'Transaction not found'}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`rounded-xl border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>No data available</p>
      </div>
    );
  }

  const tx = data;
  const amount = tx.amount ? (parseFloat(tx.amount) / 1000000).toFixed(6) : '0.000000';
  const { full, ago } = formatTimestamp(tx.timestamp);
  // Extract transfers if available
  const transfers = tx.transfers || [];

  return (
    <div className={`rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>

        {/* Transaction Hash */}
        <DetailRow isDark={isDark} label="Transaction Hash" tooltip="Unique identifier for this transaction">
          <div className="flex items-center gap-3">
            <span className={`font-mono text-sm break-all ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
              {tx.hash}
            </span>
            <CopyBtn text={tx.hash} isDark={isDark} />
          </div>
        </DetailRow>

        {/* Status */}
        <DetailRow isDark={isDark} label="Status" tooltip="Transaction execution status">
          {tx.success ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>Success</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>Failed</span>
            </div>
          )}
        </DetailRow>

        {/* Block */}
        <DetailRow isDark={isDark} label="Block" tooltip="Block number containing this transaction">
          <a
            href={`/blocks/${tx.height}`}
            className="text-sm text-[#00b2bd] hover:underline font-medium"
          >
            {tx.height?.toLocaleString()}
          </a>
        </DetailRow>

        {/* Timestamp */}
        <DetailRow
          isDark={isDark}
          label="Timestamp"
          tooltip="Date and time of confirmation"
        >
          <div className="flex flex-row gap-1">
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-800'}`}>
              {ago}
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
              ({full})
            </span>

          </div>
        </DetailRow>

        {/* Divider */}
        <div className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

        {/* From */}
        <DetailRow isDark={isDark} label="From" tooltip="Sender address">
          <div className="flex items-center gap-3">
            <a
              href={`/address/${tx.from_address}`}
              className="text-sm text-[#00b2bd] hover:underline font-medium break-all"
            >
              {tx.from_address}
            </a>
            <CopyBtn text={tx.from_address} isDark={isDark} />
          </div>
        </DetailRow>

        {/* To */}
        <DetailRow isDark={isDark} label="To" tooltip="Receiver address">
          {tx.to_address ? (
            <div className="flex items-center gap-3">
              <a
                href={`/address/${tx.to_address}`}
                className="text-sm text-[#00b2bd] hover:underline font-medium break-all"
              >
                {tx.to_address}
              </a>
              <CopyBtn text={tx.to_address} isDark={isDark} />
            </div>
          ) : (
            <span className={`text-sm italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Contract Creation
            </span>
          )}
        </DetailRow>

        {transfers && transfers.length > 0 && (
          <DetailRow isDark={isDark} label="Token Transfers" tooltip={`${transfers.length} token transfer${transfers.length !== 1 ? 's' : ''} in this transaction`}>
            <div className="space-y-2">
              {transfers.map((transfer, index) => (
                <div key={transfer.id || index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                      #{index + 1}
                    </span>

                    <a
                      href={`/address/${transfer.from_address}`}
                      className="text-[10px] text-[#00b2bd] hover:underline font-semibold"
                      title={transfer.from_address}
                    >
                      {transfer.from_address}
                    </a>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-600/50' : 'bg-gray-200'}`}>
                      <svg
                        className={`w-2 h-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>

                    <a
                      href={`/address/${transfer.to_address}`}
                      className="text-[10px] text-[#00b2bd] hover:underline font-semibold"
                      title={transfer.to_address}
                    >
                      {transfer.to_address}
                    </a>
                  </div>

                  <div className={`text-xs font-semibold head ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                    {transfer.amount ? `${formatAmount(transfer.amount)} JMC` : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </DetailRow>
        )}

        <DetailRow isDark={isDark} label="Transaction Action" tooltip="Method executed">
          <Badge color={getMethodColor(tx.method)}>
            {formatMethod(tx.method)}
          </Badge>
        </DetailRow>

        {/* Value */}
        <DetailRow isDark={isDark} label="Value" tooltip="Amount transferred">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
            {amount} <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>JMC</span>
          </span>
        </DetailRow>

        {/* Transaction Fee */}
        <DetailRow isDark={isDark} label="Transaction Fee" tooltip="Fee paid for this transaction">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
            {parseFee(tx.fee)} <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>JMC</span>
          </span>
        </DetailRow>

        {/* Gas */}
        <DetailRow isDark={isDark} label="Gas Used / Wanted" tooltip="Gas consumed vs requested">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
              {tx.gas_used?.toLocaleString() || '0'}
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>/</span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {tx.gas_wanted?.toLocaleString() || '0'}
            </span>
            {tx.gas_used && tx.gas_wanted && (
              <span className={`text-xs px-2 py-0.5 rounded ml-2
                ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}
              `}>
                {((tx.gas_used / tx.gas_wanted) * 100).toFixed(1)}%
              </span>
            )}
          </div>
        </DetailRow>

        {/* Memo */}
        {tx.memo && (
          <DetailRow isDark={isDark} label="Memo" tooltip="Additional info">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {tx.memo}
            </span>
          </DetailRow>
        )}

      </div>
    </div>
  );
};

const DetailRow = ({ label, tooltip, children, isDark }) => (
  <div className={`px-6 py-4 flex gap-6 ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'} transition-colors`}>
    <div className="w-40 flex-shrink-0 flex items-center gap-2">
      {tooltip && (
        <Tooltip text={tooltip} isDark={isDark}>
          <HelpCircle className={`w-4 h-4 flex-shrink-0 cursor-help ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        </Tooltip>
      )}
      <label className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </label>
    </div>
    <div className="flex-1 min-w-0">
      {children}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// INTERNAL TRANSACTIONS TAB
// ═══════════════════════════════════════════════════════════

const InternalTransactionsTab = ({ data, error, isLoading, isDark }) => {
  if (isLoading) {
    return (
      <div className={`rounded-xl border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00b2bd] border-t-transparent mx-auto mb-3" />
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading internal transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <XCircle className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
        <p className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          {error?.data?.message || error?.message || 'Failed to load'}
        </p>
      </div>
    );
  }

  let transfers = [];
  if (Array.isArray(data)) {
    transfers = data;
  } else if (data && data.transfers && Array.isArray(data.transfers)) {
    transfers = data.transfers;
  } else if (data && data.count && data.count > 0) {
    transfers = data.transfers || [];
  }

  if (transfers.length === 0) {
    return (
      <div className={`rounded-xl border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          No internal transactions found
        </p>
      </div>
    );
  }

  const formattedTransfers = transfers.map((transfer, index) => {
    let displayAmount = '0.000000';
    let displayDenom = 'JMC';

    if (transfer.amount_value) {
      displayAmount = (transfer.amount_value / 1000000).toFixed(6);
    } else if (transfer.amount && typeof transfer.amount === 'string') {
      const match = transfer.amount.match(/^(\d+)(u\w+)$/);
      if (match) {
        displayAmount = (parseInt(match[1]) / 1000000).toFixed(6);
        displayDenom = match[2].toUpperCase().replace('U', '');
      }
    }

    const isOutgoing = transfer.direction === 'out';

    return {
      ...transfer,
      displayAmount,
      displayDenom,
      isOutgoing,
      index: index + 1
    };
  });

  const columns = [
    {
      key: 'index',
      header: '#',
      render: (value) => (
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
          {value}
        </span>
      ),
      width: '60px'
    },
    {
      key: 'from_address',
      header: 'From',
      render: (value) => (
        <a
          href={`/address/${value}`}
          className="text-xs text-[#00b2bd] hover:underline break-all"
          title={value}
        >
          {value}
        </a>
      ),
    },
    {
      key: 'to_address',
      header: 'To',
      render: (value) => (
        <a
          href={`/address/${value}`}
          className="text-xs text-[#00b2bd] hover:underline break-all"
          title={value}
        >
          {value}
        </a>
      ),
    },
    {
      key: 'displayAmount',
      header: 'Value',
      render: (value, row) => (
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
          {value} <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>{row.displayDenom}</span>
        </span>
      ),
      align: 'right'
    },
    {
      key: 'direction',
      header: 'Direction',
      render: (value, row) => {
        const isOutgoing = row.isOutgoing;
        return isOutgoing ? (
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
            Out
          </span>
        ) : (
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
            In
          </span>
        );
      },
      align: 'center',
      width: '80px'
    }
  ];

  return (
    <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
        <h2 className={`text-lg font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
          Internal Transactions
        </h2>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          {transfers.length} transaction{transfers.length !== 1 ? 's' : ''}
        </p>
      </div>

      <Table
        data={formattedTransfers}
        columns={columns}
        isDark={isDark}
        striped
        hoverable
        bordered={false}
        expandable={{
          render: (row) => (
            <div className="space-y-3">
              <DetailField
                label="From Address"
                value={row.from_address}
                copy={row.from_address}
                link={`/address/${row.from_address}`}
                isDark={isDark}
              />
              <DetailField
                label="To Address"
                value={row.to_address}
                copy={row.to_address}
                link={`/address/${row.to_address}`}
                isDark={isDark}
              />
              <DetailField
                label="Amount"
                value={`${row.displayAmount} ${row.displayDenom}`}
                isDark={isDark}
              />
              {row.denom && (
                <DetailField
                  label="Token"
                  value={row.denom}
                  isDark={isDark}
                />
              )}
              <DetailField
                label="Direction"
                value={row.isOutgoing ? 'Outgoing' : 'Incoming'}
                isDark={isDark}
              />
              {row.amount && (
                <DetailField
                  label="Raw Amount"
                  value={row.amount}
                  mono
                  isDark={isDark}
                />
              )}
            </div>
          )
        }}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// LOGS TAB
// ═══════════════════════════════════════════════════════════

const LogsTab = ({ data, error, isLoading, isDark }) => {
  if (isLoading) {
    return (
      <div className={`rounded-lg border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#00b2bd] border-t-transparent mx-auto mb-3" />
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <XCircle className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
        <p className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          {error?.data?.message || error?.message || 'Failed to load logs'}
        </p>
      </div>
    );
  }

  let logs = [];
  if (Array.isArray(data)) {
    logs = data;
  } else if (data && data.logs && Array.isArray(data.logs)) {
    logs = data.logs;
  } else if (data && data.count && data.count > 0) {
    logs = data.logs || [];
  }

  if (logs.length === 0) {
    return (
      <div className={`rounded-lg border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          No logs found
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            Transaction Logs ({logs.length})
          </h3>
          <div className="flex gap-4 text-xs">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Event Types: {new Set(logs.map(l => l.event_type)).size}
            </span>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className={`grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold border-b ${isDark ? 'border-gray-700 bg-gray-800/50 text-gray-400' : 'border-gray-200 bg-gray-100 text-gray-700'}`}>
        <div className="col-span-1">Index</div>
        <div className="col-span-2">Event</div>
        <div className="col-span-4">Topics</div>
        <div className="col-span-5">Data</div>
      </div>

      {/* Logs */}
      <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
        {logs.map((log, index) => (
          <div key={index} className={`grid grid-cols-12 gap-4 px-4 py-3 text-xs ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'} transition-colors`}>

            {/* Index */}
            <div className="col-span-1">
              <span className={`px-2 py-1 rounded text-xs font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                {log.index}
              </span>
            </div>

            {/* Event Type */}
            <div className="col-span-2">
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getEventTypeColor(log.event_type, isDark)}`}>
                {log.event_type}
              </span>
            </div>

            {/* Topics */}
            <div className="col-span-4">
              {log.topics && log.topics.length > 0 ? (
                <div className="space-y-1">
                  {log.topics.map((topic, i) => (
                    <div key={i} className="flex gap-2">
                      <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {topic.key}:
                      </span>
                      {isAddress(topic.value) ? (
                        <a
                          href={`/address/${topic.value}`}
                          className="text-[#00b2bd] hover:underline font-mono break-all"
                          title={topic.value}
                        >
                          {topic.value.slice(0, 20)}...{topic.value.slice(-8)}
                        </a>
                      ) : (
                        <span className={`font-mono break-all ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {topic.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className={`italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>—</span>
              )}
            </div>

            {/* Data */}
            <div className="col-span-5">
              {log.data && log.data.length > 0 ? (
                <div className="space-y-1">
                  {log.data.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <span className={`font-semibold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                        {item.key}:
                      </span>
                      {isAddress(item.value) ? (
                        <a
                          href={`/address/${item.value}`}
                          className="text-[#00b2bd] hover:underline font-mono break-all"
                          title={item.value}
                        >
                          {item.value.slice(0, 20)}...{item.value.slice(-8)}
                        </a>
                      ) : (
                        <span className={`font-mono break-all ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className={`italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>—</span>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={`px-4 py-2 border-t text-xs ${isDark ? 'border-gray-700 bg-gray-900 text-gray-500' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
        Showing {logs.length} log{logs.length !== 1 ? 's' : ''} for transaction {data.tx_hash}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════

const DetailField = ({ label, value, mono, copy, link, isDark }) => (
  <div className="flex flex-col gap-1">
    <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      {label}
    </p>
    <div className="flex items-center gap-2">
      {link ? (
        <a
          href={link}
          className={`text-xs ${mono ? 'font-mono' : ''} text-[#00b2bd] hover:underline break-all`}
        >
          {value}
        </a>
      ) : (
        <span className={`text-xs ${mono ? 'font-mono' : ''} ${isDark ? 'text-gray-400' : 'text-gray-600'} break-all`}>
          {value}
        </span>
      )}
      {copy && <CopyBtn text={copy} isDark={isDark} />}
    </div>
  </div>
);

const OverviewSkeleton = ({ isDark }) => (
  <div className={`rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
    <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
      {[...Array(12)].map((_, i) => (
        <div key={i} className={`px-6 py-4 flex gap-6 animate-pulse ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`}>
          <div className={`w-40 h-4 rounded flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-4 rounded flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
            style={{ maxWidth: `${200 + Math.random() * 300}px` }}
          />
        </div>
      ))}
    </div>
  </div>
);