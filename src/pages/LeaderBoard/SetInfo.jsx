// // src/pages/Validators/LeaderBoard.jsx
// import React, { useState } from 'react';
// import { useGetValidatorDetailsQuery } from './leaderApiSlice';
// import { useGetStatsQuery } from '../stats/statsApiSlice';
// import { useTheme } from '../../context/ThemeContext';
// import { useNavigate ,Link} from 'react-router-dom';
// import {
//   Shield,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   Zap,
//   TrendingUp,
//   Activity,
//   Users,
//   Box,
//   Award,

// } from 'lucide-react';
// import Table from '../../ui/Table';
// import { getTimeAgo } from '../../hooks/formats';
// import ErrorState from '../../ui/ErrorState';
// import LoadingState from "../../ui/LoadingSkeleton";
// import EmptyState from "../../ui/EmptyState";
// import StatCard from '../../ui/HomeStat';
// import { Badge } from '../../ui/Table';
// import Pagination from '../../ui/Pagination';
// const ValidatorsDetails = () => {
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';
//   const navigate = useNavigate();
//   const [page, setPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [perPage] = useState(25);

//   // Fetch blocks data
//   const { data: blocksData, isLoading, error, isFetching } = useGetValidatorDetailsQuery({
//     page,
//     per_page: perPage,
//   });

//   const { data: statsData, isLoading: statsLoading } = useGetStatsQuery();

//   // Helper functions
// const formatBlockReward = (val) => {
//   if (!val) return "0.00";

//   const str = String(val).trim();

//   // Handle uJMC
//   if (str.includes("uJMC")) {
//     const num = Number(str.replace("uJMC", ""));
//     if (isNaN(num)) return "0.00";
//     return (num / 1_000_000).toLocaleString(undefined, {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 6,
//     });
//   }

//   // Handle already in JMC
//   if (str.includes("JMC")) {
//     const num = Number(str.replace("JMC", ""));
//     if (isNaN(num)) return "0.00";
//     return num.toLocaleString(undefined, {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 6,
//     });
//   }

//   // Fallback (raw number)
//   const num = Number(str);
//   if (isNaN(num)) return "0.00";

//   return num.toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 6,
//   });
// };

//   const formatBlockTime = (time) => {
//     if (!time) return 'N/A';
//     const date = new Date(time);
//     return date.toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     });
//   };

//   const blocksDataArray = blocksData?.data || [];
//   const activeValidators = blocksData?.active_validators || 0;
//   const jailedValidators = blocksData?.inactive_validators || 0;
//   const latestBlockHeight = blocksData?.latest_block_height || 0;
//   const totalVotingPower = blocksData?.total_voting_power || 0;

//   // Filter blocks based on search (by height or age)
//   const filteredBlocks = blocksDataArray.filter((block) =>
//     block.height?.toString().includes(searchQuery) ||
//     block.age?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Define table columns for blocks
//   const columns = [
    
//     {
//       key: 'age',
//       header: 'Age',
//       render: (value) => (
//         <span className={`text-sm font-regular ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//           {value}
//         </span>
//       ),
//     },
//     {
//       key: 'height',
//       header: 'Block Height',
//       width: '120px',
//       render: (value) => (
//         <Link
//           to={`/blocks/${value}`}
//           className={`text-sm font-semibold text-[#006666] head ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-[#006666] transition-colors`}
//         >
//           {value?.toLocaleString()}
//         </Link>
     
//       ),
//     },
//     {
//   key: 'validators',
//   header: 'Validators',
//   render: (value) => (
//     <Link 
//       to="/validators/leaderboard"
//       className="hover:opacity-80 transition-opacity"
//     >
//       <div className="">
//         <span className={`text-sm font-semibold hover:underline ${
//           isDark 
//             ? 'text-[#006666] hover:text-[#004d4d]' 
//             : 'text-[#006666] hover:text-[#004d4d]'
//         }`}>
//           {value}
//         </span>
//       </div>
//     </Link>
//   ),
//   align: 'center',
// },
//     {
//       key: 'total_voting_power',
//       header: 'Total Voting Power',
//       render: (value) => (
//         <div className="">
//           <span className={`text-sm font-regular ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
//             {value}
//           </span>
//         </div>
//       ),
//       align: 'center',
//     },
//     {
//       key: 'total_jailed',
//       header: 'Total Jailed',
//       render: (value) => {
//         return (
//           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold `}>
//             {value}
//           </span>
//         );
//       },
//       align: 'center',
//     },
//    {
//   key: 'block_reward',
//   header: 'Block Reward',
//   render: (value) => (
//     <div>
//       <Badge className="font-semibold rounded-md text-[12px] text-[#006666]">
//         {formatBlockReward(value)} JMC
//       </Badge>
//     </div>
//   ),
//   align: 'center',
// }
//   ];


//   const handlePrevPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (page < Pagination.total_pages) setPage(page + 1);
//   };

//   if (isLoading) {
//     return <LoadingState isDark={isDark} />;
//   }

//   if (error) {
//     return <ErrorState isDark={isDark} error={error} />;
//   }

//   return (
//     <div className={`min-h-screen `}>
//       {/* Header */}
//       <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
//         <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex items-center gap-3 mb-0">
//             <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
//               Validators set-info
//             </h1>
//           </div>
//           <p className={`text-sm head ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//            One row per block — validator count and voting power reflect current live state.
//           </p>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Stats Cards - First Row */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
//           <StatCard
//             title="Active Validators"
//             value={activeValidators}
//             icon={Users}
//             color="green"
//             isDark={isDark}
//             trend={{
//               value: "Active Validators",
//               direction: "up",
//               // label: "vs last month"
//             }}
//           />
//           <StatCard
//             title="Jailed Validators"
//             value={jailedValidators}
//             icon={XCircle}
//             color="red"
//             isDark={isDark}
//             trend={{
//               value: "Inactive Validators",
//               direction: "up",
//               // label: "vs last month"
//             }}
             
//           />
//           <StatCard
//             title="Total Voting Power"
//             value={totalVotingPower?.toLocaleString() || 0}
//             icon={Zap}
//             color="yellow"
//             isDark={isDark}
//             trend={{
//               value: "Combined Power",
//               direction: "up",
//               // label: "vs last month"
//             }}
//           />
//           <StatCard
//             title="Latest Block"
//             value={latestBlockHeight?.toLocaleString() || 0}
//             icon={Box}
//             color="blue"
//             isDark={isDark}
//             trend={{
//               value: "Currently Validating",
//               // direction: "up",
//               // label: "vs last month"
//             }}
//           />
//         </div>




//         {/* Blocks List */}
//         {filteredBlocks.length > 0 ? (
//           <>
//             {/* Table */}
//             <div className={`rounded-md border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//               <Table
//                 data={filteredBlocks}
//                 columns={columns}
//                 isDark={isDark}
//                 striped
//                 hoverable
//                 bordered={false}
//                 compact
//               />
//             </div>

//             {/* Pagination */}
//             {Pagination.total_pages > 1 && (
//               <div className={`mt-6 rounded-md border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//                 <div className="flex items-center justify-between flex-wrap gap-4">
//                   <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//                     Showing {(page - 1) * perPage + 1} to{' '}
//                     {Math.min(page * perPage, Pagination.total)} of {Pagination.total.toLocaleString()} blocks
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={handlePrevPage}
//                       disabled={page === 1 || isFetching}
//                       className={`p-2 rounded-md transition-colors ${page === 1 || isFetching
//                           ? isDark
//                             ? 'bg-gray-700 text-gray-600 cursor-not-allowed'
//                             : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : isDark
//                             ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>

//                     {/* Page Numbers */}
//                     <div className="flex gap-1">
//                       {Array.from(
//                         { length: Math.min(5, Pagination.total_pages) },
//                         (_, i) => {
//                           let pageNum;
//                           if (Pagination.total_pages <= 5) {
//                             pageNum = i + 1;
//                           } else if (page <= 3) {
//                             pageNum = i + 1;
//                           } else if (page >= Pagination.total_pages - 2) {
//                             pageNum = Pagination.total_pages - 4 + i;
//                           } else {
//                             pageNum = page - 2 + i;
//                           }

//                           return (
//                             <button
//                               key={pageNum}
//                               onClick={() => setPage(pageNum)}
//                               disabled={isFetching}
//                               className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors ${pageNum === page
//                                   ? 'bg-[#00b2bd] text-white'
//                                   : isDark
//                                     ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50'
//                                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
//                                 }`}
//                             >
//                               {pageNum}
//                             </button>
//                           );
//                         }
//                       )}
//                     </div>

//                     <button
//                       onClick={handleNextPage}
//                       disabled={page === Pagination.total_pages || isFetching}
//                       className={`p-2 rounded-md transition-colors ${page === Pagination.total_pages || isFetching
//                           ? isDark
//                             ? 'bg-gray-700 text-gray-600 cursor-not-allowed'
//                             : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                           : isDark
//                             ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className={`rounded-md border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//             <Box className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
//             <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
//               No blocks found
//             </h3>
//             <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
//               {searchQuery ? 'Try adjusting your search query' : 'No blocks available at the moment'}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ValidatorsDetails;

import React, { useState, useEffect } from 'react';
import { useGetValidatorDetailsQuery } from './leaderApiSlice';
import { useGetStatsQuery } from '../stats/statsApiSlice';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  Zap,
  TrendingUp,
  Activity,
  Users,
  Box,
  Award,
} from 'lucide-react';
import Table from '../../ui/Table';
import { getTimeAgo } from '../../hooks/formats';
import ErrorState from '../../ui/ErrorState';
import LoadingState from "../../ui/LoadingSkeleton";
import EmptyState from "../../ui/EmptyState";
import StatCard from '../../ui/HomeStat';
import { Badge } from '../../ui/Table';
import Pagination from "../../ui/Pagination"

const ValidatorsDetails = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [perPage] = useState(25);

  // Fetch blocks data
  const { data: blocksData, isLoading, error, isFetching } = useGetValidatorDetailsQuery({
    page,
    per_page: perPage,
  });

  const { data: statsData, isLoading: statsLoading } = useGetStatsQuery();





  // Helper functions
  const formatBlockReward = (val) => {
    if (!val) return "0.00";

    const str = String(val).trim();

    // Handle uJMC
    if (str.includes("uJMC")) {
      const num = Number(str.replace("uJMC", ""));
      if (isNaN(num)) return "0.00";
      return (num / 1_000_000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      });
    }

    // Handle already in JMC
    if (str.includes("JMC")) {
      const num = Number(str.replace("JMC", ""));
      if (isNaN(num)) return "0.00";
      return num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      });
    }

    // Fallback (raw number)
    const num = Number(str);
    if (isNaN(num)) return "0.00";

    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const formatBlockTime = (time) => {
    if (!time) return 'N/A';
    const date = new Date(time);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const blocksDataArray = blocksData?.data || [];
  const activeValidators = blocksData?.active_validators || 0;
  const jailedValidators = blocksData?.inactive_validators || 0;
  const latestBlockHeight = blocksData?.latest_block_height || 0;
  const totalVotingPower = blocksData?.total_voting_power || 0;

  // Extract pagination from API response
  const paginationData = {
    page: blocksData?.page || page,
    per_page: blocksData?.per_page || perPage,
    total: blocksData?.total || 0,
    total_pages: blocksData?.total_pages || 1,
  };

  // Filter blocks based on search (by height or age)
  const filteredBlocks = blocksDataArray.filter((block) =>
    block.height?.toString().includes(searchQuery) ||
    block.age?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns for blocks
  const columns = [
    {
      key: 'age',
      header: 'Age',
      render: (value) => (
        <span className={`text-sm font-regular ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'height',
      header: 'Block Height',
      width: '120px',
      render: (value) => (
        <Link
          to={`/blocks/${value}`}
          className={`text-sm font-semibold text-[#006666] head ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:text-[#006666] transition-colors`}
        >
          {value?.toLocaleString()}
        </Link>
      ),
    },
    {
      key: 'validators',
      header: 'Validators',
      render: (value) => (
        <Link
          to="/validators/leaderboard"
          className="hover:opacity-80 transition-opacity"
        >
          <div className="">
            <span className={`text-sm font-semibold hover:underline ${isDark
              ? 'text-[#006666] hover:text-[#004d4d]'
              : 'text-[#006666] hover:text-[#004d4d]'
              }`}>
              {value}
            </span>
          </div>
        </Link>
      ),
      align: 'center',
    },
    {
      key: 'total_voting_power',
      header: 'Total Voting Power',
      render: (value) => (
        <div className="">
          <span className={`text-sm font-regular ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {value}
          </span>
        </div>
      ),
      align: 'center',
    },
    {
      key: 'total_jailed',
      header: 'Total Jailed',
      render: (value) => {
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold `}>
            {value}
          </span>
        );
      },
      align: 'center',
    },
    {
      key: 'block_reward',
      header: 'Block Reward',
      render: (value) => (
        <div>
          <Badge className="font-semibold rounded-md text-[12px] text-[#006666]">
            {formatBlockReward(value)} JMC
          </Badge>
        </div>
      ),
      align: 'center',
    }
  ];

  const handlePageChange = (newPage) => {
    console.log('handlePageChange called with:', newPage);
    console.log('Current page before change:', page);
    
    if (newPage !== page && newPage >= 1 && newPage <= paginationData.total_pages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log('Page set to:', newPage);
    } else {
      console.log('Page change rejected. NewPage:', newPage, 'Current:', page, 'TotalPages:', paginationData.total_pages);
    }
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
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-0">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Validators set-info
            </h1>
          </div>
          <p className={`text-sm head ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            One row per block — validator count and voting power reflect current live state.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Debug Info - Remove this after fixing */}
        
        {/* Stats Cards - First Row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Active Validators"
            value={activeValidators}
            icon={Users}
            color="green"
            isDark={isDark}
            trend={{
              value: "Active Validators",
              direction: "up",
            }}
          />
          <StatCard
            title="Jailed Validators"
            value={jailedValidators}
            icon={XCircle}
            color="red"
            isDark={isDark}
            trend={{
              value: "Inactive Validators",
              direction: "up",
            }}
          />
          <StatCard
            title="Total Voting Power"
            value={totalVotingPower?.toLocaleString() || 0}
            icon={Zap}
            color="yellow"
            isDark={isDark}
            trend={{
              value: "Combined Power",
              direction: "up",
            }}
          />
          <StatCard
            title="Latest Block"
            value={latestBlockHeight?.toLocaleString() || 0}
            icon={Box}
            color="blue"
            isDark={isDark}
            trend={{
              value: "Currently Validating",
            }}
          />
        </div>

        {/* Blocks List */}
        {filteredBlocks.length > 0 ? (
          <>
            {/* Table */}
            <div className={`rounded-md border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <Table
                data={filteredBlocks}
                columns={columns}
                isDark={isDark}
                striped
                hoverable
                bordered={false}
                compact
              />
            </div>

            {/* Pagination */}
            {paginationData.total_pages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={page}
                  totalPages={paginationData.total_pages}
                  totalItems={paginationData.total}
                  itemsPerPage={paginationData.per_page}
                  onPageChange={handlePageChange}
                  isDark={isDark}
                  isLoading={isFetching}
                />
              </div>
            )}
          </>
        ) : (
          <div className={`rounded-md border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <Box className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
              No blocks found
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {searchQuery ? 'Try adjusting your search query' : 'No blocks available at the moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidatorsDetails;