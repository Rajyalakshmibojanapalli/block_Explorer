import React, { useState } from 'react';
import { useGetValidatorsQuery } from './leaderApiSlice';
import { useGetStatsQuery } from '../stats/statsApiSlice';
import { useTheme } from '../../context/ThemeContext';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Table from '../../ui/Table';
import { getTimeAgo } from '../../hooks/formats';
import ErrorState from '../../ui/ErrorState';
import LoadingState from "../../ui/LoadingSkeleton";
import EmptyState from "../../ui/EmptyState";
import { Link } from 'react-router-dom';
const ValidatorsList = ({ onSelectValidator }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [page, setPage] = useState(1);
  const [searchMoniker, setSearchMoniker] = useState('');
  const [perPage] = useState(20);

  const { data: validatorsData, isLoading, error, isFetching } = useGetValidatorsQuery({
    page,
    per_page: perPage,
    status: 'BOND_STATUS_BONDED',
  });
  const { data: statsData } = useGetStatsQuery();

  // Helper functions
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const truncateAddress = (address, startChars = 12, endChars = 8) => {
    if (!address || address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  };

  const formatTokens = (tokens) => {
    if (!tokens) return '0';
    const value = parseInt(tokens) / 1000000;
    return `${value.toLocaleString()} JMC`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  const getValidatorStatus = (validator) => {
    if (validator.jailed) {
      return {
        label: 'Jailed',
        color: 'red',
        icon: XCircle,
      };
    }

    if (validator.status === 'BOND_STATUS_BONDED') {
      return {
        label: 'Active',
        color: 'green',
        icon: CheckCircle,
      };
    }

    return {
      label: 'Inactive',
      color: 'gray',
      icon: AlertTriangle,
    };
  };

  // Format stats data
  const validatorsDataArray = validatorsData?.data || [];
  const activeValidators = validatorsDataArray.filter(
    (v) => v.status === 'BOND_STATUS_BONDED' && !v.jailed
  ).length;
  const jailedValidators = validatorsDataArray.filter((v) => v.jailed).length;
  const totalTokens = validatorsDataArray.reduce(
    (sum, v) => sum + parseInt(v.tokens || 0),
    0
  ) / 1000000;

  // Filter validators based on search
  const filteredValidators = validatorsDataArray.filter((validator) =>
    validator.moniker?.toLowerCase().includes(searchMoniker.toLowerCase())
  );

  // Sort validators by voting power
  const sortedValidators = [...filteredValidators].sort(
    (a, b) => parseInt(b.voting_power || 0) - parseInt(a.voting_power || 0)
  );

  // Format data for table with rank
  const tableData = sortedValidators.map((validator, index) => ({
    ...validator,
    rank: index + 1 + (page - 1) * perPage,
    formattedTokens: formatTokens(validator.tokens),
    formattedUpdated: formatTimestamp(validator.updated_at),
  }));

  // Define table columns
  const columns = [
    {
      key: 'rank',
      header: 'Rank',
      width: '80px',
       align:"center",
      render: (value) => {
        return (
          <div className="">
            <span
              className={`font-bold text-sm `}
            >
              {value}
            </span>
          </div>
        );
      },
     align:"center",
    },
   {
  key: 'moniker',
  header: 'Validator',
  align:"center",
  render: (value, row) => (
    <Link 
      to={`/address/${row.operator_address}`}
      className="hover:opacity-80 transition-opacity"
    >
      <div className="cursor-pointer">
        <p className={`font-semibold text-[#006666] text-sm hover:underline ${
          isDark 
            ? 'text-blue-400 hover:text-[#006666]' 
            : 'text-blue-600 hover:text-[#006666]'
        }`}>
          {value}
        </p>
      </div>
    </Link>
  ),
},
    
    {
      key: 'power',
      header: 'Voting Power',
      render: (value) => (
        <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
          {parseInt(value || 0).toLocaleString() }%
        </span>
      ),
       align:"center",
    },

    {
      key: 'blocks_proposed',
      header: 'Blocks',
      render: (value) => (
        <Link
          to={`/blocks/${value}`}
          className={`text-sm font-semibold head ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-[#006666] transition-colors`}
        >
          {parseInt(value || 0).toLocaleString()}
        </Link>
      ),
      align:"center",
    },
    {
      key: 'tokens',
      header: 'STAKE',
       align:"center",
      render: (value) => (
        <span className={`text-sm font-semibold head ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {(value/1000000)} JMC
        </span>
      ),
    },
    
    {
  key: 'updated_at',
  header: 'Last Seen',
  render: (value) => (
    <div className="">
      <div className="">
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {getTimeAgo(value)}
        </span>
       
      </div>
    </div>
  ),
  align: 'center',
},
        {
      key: 'status',
      header: 'Status',
      render: (value, row) => {
        const status = getValidatorStatus(row);
        const StatusIcon = status.icon;
        const colorClass =
          status.color === 'green'
            ? isDark
              ? 'bg-green-500/20 text-green-400'
              : 'bg-green-100 text-green-700'
            : status.color === 'red'
              ? isDark
                ? 'bg-red-500/20 text-red-400'
                : 'bg-red-100 text-red-700'
              : isDark
                ? 'bg-gray-500/20 text-gray-400'
                : 'bg-gray-100 text-gray-700';

        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        );
      },
      align: 'center',
    },
  ];

  const pagination = {
    page: validatorsData?.page || 1,
    per_page: validatorsData?.per_page || 20,
    total: validatorsData?.total || 0,
    total_pages: validatorsData?.total_pages || 1,
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < pagination.total_pages) setPage(page + 1);
  };

  if (isLoading) {
    return <LoadingState isDark={isDark} />;
  }

  if (error) {
    return <ErrorState isDark={isDark} error={error} />;
  }

  return (
    <div className={`min-h-screen `}>
      {/* Header */}
      <div className={` sticky top-0 z-40`}>
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-0">
            <h1 className={`text-3xl subheading font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Validators Top Leaderboard
            </h1>
            
          </div>
            <p className={`text-sm  head ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Real-time performance metrics for active network participants
            </p>
        
        </div>
      </div>

      {/* Content */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Validators List */}
        {sortedValidators.length > 0 ? (
          <>
            {/* Table */}
            <div className={`rounded-md border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <Table
                data={tableData}
                columns={columns}
                isDark={isDark}
                striped
                hoverable
                bordered={false}
                compact
              />
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className={`mt-6 rounded-md border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {(page - 1) * perPage + 1} to{' '}
                    {Math.min(page * perPage, pagination.total)} of {pagination.total}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1 || isFetching}
                      className={`p-2 rounded-md transition-colors ${
                        page === 1 || isFetching
                          ? isDark
                            ? 'bg-gray-700 text-gray-600'
                            : 'bg-gray-100 text-gray-400'
                          : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(5, pagination.total_pages) },
                        (_, i) => {
                          let pageNum;
                          if (pagination.total_pages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= pagination.total_pages - 2) {
                            pageNum = pagination.total_pages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              disabled={isFetching}
                              className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors ${
                                pageNum === page
                                  ? 'bg-[#00b2bd] text-white'
                                  : isDark
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={page === pagination.total_pages || isFetching}
                      className={`p-2 rounded-md transition-colors ${
                        page === pagination.total_pages || isFetching
                          ? isDark
                            ? 'bg-gray-700 text-gray-600'
                            : 'bg-gray-100 text-gray-400'
                          : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState isDark={isDark} searchMoniker={searchMoniker} />
        )}
      </div>
    </div>
  );
};
export default ValidatorsList;

