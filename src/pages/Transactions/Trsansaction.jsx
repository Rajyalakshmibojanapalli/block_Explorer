import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetTransactionsQuery, useSearchTransactionsQuery } from './transactionsApiSlice';
import { useGetStatsQuery } from '../stats/statsApiSlice';
import { useTheme } from '../../context/ThemeContext';
import { formatAmount, parseFee, formatMethod, getMethodColor } from '../../hooks/formats';
import StatCard from '../../ui/HomeStat';
import StatCardModal from './StatCardModal'; // ADD THIS IMPORT
import Pagination from '../../ui/Pagination';
import Table, {
  HashLink,
  AddressLink,
  Badge,
  ValueBox,
  TimeAgo,
  DirectionArrow,
} from '../../ui/Table';

// Icons
import {
  Activity,
  AlertCircle,
  XCircle,
  Database,
  CircleCheck,
  Banknote,
  Fuel,
} from 'lucide-react';

const TransactionsList = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  // State Management
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [searchHash, setSearchHash] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    statType: null,
    title: '',
  });

  // API Queries
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useGetStatsQuery(undefined, {
    pollingInterval: 30000,
  });

  const {
    data: transactionsData,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetTransactionsQuery(
    { page, per_page: perPage },
    {
      skip: searchMode,
      pollingInterval: 10000,
    }
  );

  const {
    data: searchResults,
    error: searchError,
    isLoading: isSearching,
    isFetching: isSearchFetching,
  } = useSearchTransactionsQuery(
    { hash: searchHash, page, per_page: perPage },
    { skip: !searchMode || !searchHash }
  );

  // Current data based on mode
  const currentData = searchMode ? searchResults : transactionsData;
  const currentError = searchMode ? searchError : error;
  const currentIsLoading = searchMode ? isSearching : isLoading;
  const currentIsFetching = searchMode ? isSearchFetching : isFetching;

  // Calculate total pages
  const totalPages = currentData?.total_pages ||
    Math.ceil((currentData?.total || 0) / perPage) ||
    1;

  const handleClearSearch = () => {
    setSearchHash('');
    setSearchMode(false);
    setPage(1);
  };

  // Navigate to transaction detail page
  const handleTransactionClick = (hash) => {
    navigate(`/transactions/${hash}`);
  };

  const handleStatCardClick = (type, title) => {
    console.log('Stat card clicked:', type, title); // Debug log
    setModalState({
      isOpen: true,
      statType: type,
      title: title,
    });
  };

  const handleCloseModal = () => {
    console.log('Closing modal'); // Debug log
    setModalState({
      isOpen: false,
      statType: null,
      title: '',
    });
  };

  const getStatsCards = () => {
    if (!statsData) return [];
    return [
      {
        title: "Total Transactions",
        value: statsData.total_transactions?.toLocaleString() || "0",
        icon: Database,
        color: '#006666',
        badge: `GLOBAL`,
        subtitle: "All Time",
        onClick: () => handleStatCardClick('transactions', 'Total Transactions'),
      },
      {
        title: "Success Rate",
        value: `${statsData.tx_success_rate_pct || 0}%`,
        icon: CircleCheck,
        color: "green",
        badge: `LIVE`,
        subtitle: "Last 24h",
        onClick: () => handleStatCardClick('success-rate', 'Success Rate'),
      },
      {
        title: "Total Fees",
        value: `${parseFloat(statsData.total_fees_jmc || 0).toFixed(4)} JMC`,
        icon: Banknote,
        color: "emerald",
        badge: "VOLUME",
        subtitle: "Last 24h",
        onClick: () => handleStatCardClick('total-fees', 'Total Fees'),
      },
      {
        title: "Gas Price",
        value: `${parseFloat(statsData.gas_price || 0).toFixed(6)} JMC`,
        icon: Fuel,
        color: "red",
        badge: `NETWORK`,
        subtitle: "Avg",
        onClick: () => handleStatCardClick('gas-price', 'Gas Price'),
      },
    ];
  };

  const statsCards = getStatsCards();

  const columns = [
    {
      key: 'hash',
      header: 'Txn Hash',
      align:"center",
      render: (value, row) => (
        <HashLink
          hash={value}
          showStatus
          success={row.success}
          truncateStart={10}
          truncateEnd={6}
          onClick={(e) => {
            e.stopPropagation();
            handleTransactionClick(value);
          }}
        />
      ),
    },
    {
      key: 'method',
      header: 'Method',
      render: (value) => (
        <Badge color={getMethodColor(value)}>
          {formatMethod(value)}
        </Badge>
      ),
    },
    {
      key: 'height',
      header: 'Block',
      render: (value) => (
        <Link
          to={`/blocks/${value}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[12px] text-[#006666] font-semibold hover:text-[#00b2bd] hover:underline"
        >
          {value?.toLocaleString()}
        </Link>
      ),
    },
    {
      key: 'timestamp',
      header: 'Age',
      align:"center",
      render: (value) => <TimeAgo timestamp={value} />,
    },
    {
      key: 'from_address',
      header: 'From',
      align:"center",
      render: (value) => (
        <AddressLink address={value} truncateStart={8} truncateEnd={5} />
      ),
    },
    {
      key: 'direction',
      header: '',
      align: 'center',
      width: 'w-8',
      sortable: false,
      render: () => <DirectionArrow />,
    },
    {
      key: 'to_address',
      header: 'To',
      align:"center",
      render: (value) =>
        value ? (
          <AddressLink address={value} truncateStart={8} truncateEnd={5} />
        ) : (
          <span className={`text-[11px] italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Contract Creation
          </span>
        ),
    },
    {
      key: 'amount',
      header: 'Value',
      align:"center",
      render: (value) => <ValueBox value={formatAmount(value)} symbol="JMC" />,
    },
    {
      key: 'fee',
      header: 'Txn Fee',
      align:"center",
      render: (value) => <ValueBox value={parseFee(value)} symbol="JMC" size="sm" />,
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-[#f5f7f9]'}`}>
      {/* ADD MODAL HERE - BEFORE THE MAIN CONTENT */}
      <StatCardModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        statType={modalState.statType}
        title={modalState.title}
        isDark={isDark}
      />

      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <div>
            <h1 className={`text-[30px] sm:text-3xl font-extrabold subhead ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Transactions
            </h1>
            <p className={`text-[14px] font-regular mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Real-time overview of the Cyan Ledger activity
            </p>
          </div>
        </div>

        {/* Stats Cards Section */}
        {statsLoading ? (
          <StatsCardsSkeleton isDark={isDark} />
        ) : statsError ? (
          <StatsErrorState isDark={isDark} error={statsError} onRetry={refetchStats} />
        ) : statsCards.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsCards.map((stat) => (
              <StatCard key={stat.title} {...stat} isDark={isDark} />
            ))}
          </div>
        ) : null}

        {/* Main Content Card */}
        <div className={`
          rounded-xl border overflow-hidden shadow-sm
          ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        `}>
          {/* Toolbar */}
          <div className={`
            px-5 py-4 border-b flex flex-col lg:flex-row gap-4
            ${isDark ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <div className="flex items-center gap-3 flex-1">
              <span className={`text-sm font-semibold whitespace-nowrap ${isDark ? 'text-gray-200' : 'text-gray-800'
                }`}>
                {searchMode ? 'Search Results' : 'All Transactions'}
              </span>
              {currentIsFetching && (
                <div className="animate-spin h-3.5 w-3.5 border-2 border-[#00b2bd] border-t-transparent rounded-full" />
              )}
            </div>
          </div>

          {/* Table */}
          {currentIsLoading ? (
            <TableSkeleton isDark={isDark} rows={perPage} />
          ) : currentError ? (
            <TableErrorState
              isDark={isDark}
              error={currentError}
              onRetry={() => searchMode ? null : refetch()}
            />
          ) : currentData?.data?.length > 0 ? (
            <>
              <Table
                columns={columns}
                data={currentData.data}
                rowKey="hash"
                onRowClick={(row) => handleTransactionClick(row.hash)}
                hoverable
                isDark={isDark}
                className="border-0"
              />

              {/* Pagination */}
              <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={currentData?.total || currentData?.data?.length || 0}
                  perPage={perPage}
                  onPageChange={setPage}
                  isDark={isDark}
                />
              </div>
            </>
          ) : (
            <EmptyState
              isDark={isDark}
              searchMode={searchMode}
              onClear={handleClearSearch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsList;


// Keep all your skeleton components...
const StatsCardsSkeleton = ({ isDark }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className={`rounded-xl border p-5 animate-pulse ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`h-3 w-20 rounded mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-6 w-16 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-2 w-12 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>
          <div className={`w-10 h-10 rounded-lg flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
      </div>
    ))}
  </div>
);

const StatsErrorState = ({ isDark, error, onRetry }) => (
  <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
    }`}>
    <div className="flex items-center gap-3">
      <AlertCircle className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
      <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
        Failed to load stats: {error?.message || 'Unknown error'}
      </p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${isDark
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'bg-red-100 text-red-600 hover:bg-red-200'
          }`}
      >
        Retry
      </button>
    )}
  </div>
);

const TableSkeleton = ({ isDark, rows = 10 }) => (
  <div>
    <div className={`px-5 py-3 ${isDark ? 'bg-[#141627]' : 'bg-[#f8f9fa]'}`}>
      <div className={`h-4 w-full rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
    </div>
    {[...Array(rows)].map((_, i) => (
      <div
        key={i}
        className={`px-5 py-3.5 ${i < rows - 1 ? (isDark ? 'border-b border-gray-700/40' : 'border-b border-gray-100') : ''
          }`}
      >
        <div className="flex items-center gap-3 animate-pulse">
          <div className={`w-[18px] h-[18px] rounded-full flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-3.5 w-24 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-5 w-16 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-3.5 w-14 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-3.5 w-20 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-3.5 flex-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`w-5 h-5 rounded-full flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-3.5 flex-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-6 w-20 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`h-5 w-16 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
      </div>
    ))}
  </div>
);

const TableErrorState = ({ isDark, error, onRetry }) => (
  <div className="p-12 text-center">
    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-red-900/20' : 'bg-red-50'
      }`}>
      <XCircle className={`w-7 h-7 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
    </div>
    <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      Failed to Load Transactions
    </h3>
    <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
      {error?.message || 'Something went wrong. Please try again.'}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        Try Again
      </button>
    )}
  </div>
);

const EmptyState = ({ isDark, searchMode, onClear }) => (
  <div className="p-16 text-center">
    <Activity className={`w-10 h-10 mx-auto mb-3 opacity-30 ${isDark ? 'text-gray-500' : 'text-gray-400'
      }`} />
    <h3 className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {searchMode ? 'No Results Found' : 'No Transactions Found'}
    </h3>
    <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
      {searchMode
        ? 'Try searching with a different transaction hash.'
        : 'Try adjusting your search or wait for new transactions.'}
    </p>
    {searchMode && onClear && (
      <button
        onClick={onClear}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        Clear Search
      </button>
    )}
  </div>
);