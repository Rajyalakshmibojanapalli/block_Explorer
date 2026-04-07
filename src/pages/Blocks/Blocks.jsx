// // // // src/pages/Blocks/BlocksList.jsx
// // import React, { useState } from 'react';
// // import { useGetBlocksQuery } from './blockApiSlice';
// // import { useGetStatsQuery } from '../stats/statsApiSlice';
// // import { useTheme } from '../../context/ThemeContext';
// // import { useNavigate } from 'react-router-dom';
// // import Table from '../../ui/Table';
// // import { 
// //   Clock, 
// //   Blocks,
// //   Zap,
// //   Users,
// //   ChevronLeft,
// //   ChevronRight,
// // } from 'lucide-react';
// // import { getTimeAgo } from '../../hooks/formats';
// // import ErrorState from '../../ui/ErrorState';
// // import LoadingState from '../../ui/LoadingSkeleton';
// // import EmptyState from '../../ui/EmptyState';
// // import StatCard from '../../ui/HomeStat';
// // import Pagination from '../../ui/Pagination';
// // import BlockStatsModal from './BlockStatsModal';
// // import { Link } from 'react-router-dom';
// // import AddressCell from '../../ui/AddressCell';
// // const BlocksList = () => {
// //   const { theme } = useTheme();
// //   const isDark = theme === 'dark';
// //   const navigate = useNavigate();
// //   const [page, setPage] = useState(1);
// //   const [perPage] = useState(20);
// //   const [searchHeight, setSearchHeight] = useState('');

// //   // Fetch blocks and stats data
// //   const { data: blocksData, error, isLoading, isFetching } = useGetBlocksQuery({ 
// //     page, 
// //     per_page: perPage 
// //   });
// //   const { data: statsData } = useGetStatsQuery();

// //   // Modal State
// //   const [modalState, setModalState] = useState({
// //     isOpen: false,
// //     statType: null,
// //     title: '',
// //   });

// //   // Helper functions
// //   const truncateHash = (hash, startChars = 8, endChars = 6) => {
// //     if (!hash || hash.length <= startChars + endChars) return hash;
// //     return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
// //   };

// //   const handleBlockClick = (height) => {
// //     navigate(`/blocks/${height}`);
// //   };

// //   const handleStatCardClick = (type, title) => {
// //     console.log('🎯 Block stat clicked:', type, title);
// //     setModalState({
// //       isOpen: true,
// //       statType: type,
// //       title: title,
// //     });
// //   };

// //   const handleCloseModal = () => {
// //     console.log('🔒 Closing modal');
// //     setModalState({
// //       isOpen: false,
// //       statType: null,
// //       title: '',
// //     });
// //   };

// //   const blockStats = statsData ? [
// //     {
// //       title: "Latest Block",
// //       value: statsData.latest_block_height?.toLocaleString() || "0",
// //       icon: Blocks,
// //       color: "#3b82f6",
// //       subtitle: `${statsData.total_blocks?.toLocaleString() || 0} total`,
// //       onClick: () => handleStatCardClick('latest-block', 'Daily Blocks'),
// //     },
// //     {
// //       title: "Avg Block Time",
// //       value: `${parseFloat(statsData.avg_block_time_seconds || 0).toFixed(2)}s`,
// //       icon: Clock,
// //       color: "#10b981",
// //       subtitle: "per block",
// //       onClick: () => handleStatCardClick('avg-block-time', 'Average Block Time'),
// //     },
// //     {
// //       title: "Total Transactions",
// //       value: statsData.total_transactions?.toLocaleString() || "0",
// //       icon: Users,
// //       color: "#8b5cf6",
// //       subtitle: "all time",
// //       onClick: () => handleStatCardClick('total-validators', 'Daily Transactions'),
// //     },
// //     {
// //       title: "Average Gas",
// //       value: parseInt(statsData.avg_gas_used || 0).toLocaleString(),
// //       icon: Zap,
// //       color: "#f59e0b",
// //       subtitle: "gas per block",
// //       onClick: () => handleStatCardClick('avg-gas', 'Average Gas Usage'),
// //     }
// //   ] : null;

// //   // Format data for table
// //   const blocksDataArray = blocksData?.data || [];
// //   const pagination = blocksData?.pagination || { total: 0, total_pages: 1 };

// //   const tableData = blocksDataArray.map((block) => ({
// //     ...block,
// //     displayHeight: block.height?.toLocaleString() || '0',
// //     displayHash: truncateHash(block.hash, 10, 6),
// //     displayGasUsed: block.gas_used?.toLocaleString() || '0',
// //     displayGasWanted: block.gas_wanted?.toLocaleString() || '0',
// //     displayTxCount: block.tx_count || 0,
// //   }));

// //   // Define table columns
// //   const columns = [
// //     {
// //       key: 'displayHeight',
// //       header: 'Block',
// //       render: (value, row) => (
// //         <button
// //           onClick={() => handleBlockClick(row.height)}
// //           className="text-[#006666] hover:text-[#008a95] font-semibold text-sm"
// //         >
// //           {value}
// //         </button>
// //       ),
// //       width: '100px',
// //     },
// //     {
// //       key: 'time',
// //       header: 'Age',
// //       render: (value) => (
// //         <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
// //           <div>{getTimeAgo(value)}</div>
// //         </div>
// //       ),
// //     },
// //     {
// //   key: 'proposer_address',
// //   header: 'Validator',
// //   render: (value, row) => (
// //     <Link 
// //       to={`/address/${row.proposer_address}`}
// //       className="hover:opacity-80 transition-opacity"
// //     >
// //       <div>
// //         <p className={`text-sm font-medium font-semibold hover:underline ${
// //           isDark 
// //             ? 'text-blue-400 hover:text-blue-300' 
// //             : 'text-blue-600 hover:text-blue-700'
// //         }`}>
// //           <AddressCell address={value || 'Unknown'} />
// //         </p>
// //       </div>
// //     </Link>
// //   ),
// // },
// //     {
// //       key: 'displayTxCount',
// //       header: 'Txs',
// //       render: (value) => (
// //         <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
// //           {value}
// //         </span>
// //       ),
// //       align: 'center',
// //       width: '70px',
// //     },
// //     {
// //       key: 'displayGasUsed',
// //       header: 'Gas Used',
// //       render: (value) => (
// //         <div>
// //           <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
// //             {value}
// //           </p>
// //         </div>
// //       ),
// //       align: 'right',
// //     },
// //     {
// //       key: 'total_amount_sent',
// //       header: 'Amount',
// //       render: (value) => (
// //         <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
// //           <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
// //             {value || '0'} JMC
// //           </span>
// //         </div>
// //       ),
// //       align: 'right',
// //     },
// //     {
// //       key: 'reward',
// //       header: 'Reward',
// //       render: (value) => (
// //         <span className={`text-sm head font-semibold text-[#006666] ${isDark ? 'text-green-400' : 'text-green-600'}`}>
// //           {value || '0'}
// //         </span>
// //       ),
// //       align: 'right',
// //     },
// //   ];

// //   const handlePrevPage = () => {
// //     if (page > 1) setPage(page - 1);
// //   };

// //   const handleNextPage = () => {
// //     if (page < pagination.total_pages) setPage(page + 1);
// //   };

// //   if (isLoading) {
// //     return <LoadingState isDark={isDark} />;
// //   }

// //   if (error) {
// //     return <ErrorState isDark={isDark} error={error} />;
// //   }

// //   return (
// //     <div className={`min-h-screen`}>
// //       {/* ⭐ ADD MODAL HERE - THIS WAS MISSING ⭐ */}
// //       <BlockStatsModal
// //         isOpen={modalState.isOpen}
// //         onClose={handleCloseModal}
// //         statType={modalState.statType}
// //         title={modalState.title}
// //         isDark={isDark}
// //       />

// //       {/* Header */}
// //       <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
// //         <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //           <div className="flex items-center gap-3 mb-0">
// //             <h1 className={`text-3xl font-bold subheading ${isDark ? 'text-white' : 'text-gray-900'}`}>
// //               Blocks
// //             </h1>
// //           </div>
// //           <p className={`text-sm head ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
// //             Real-time blockchain block data and network statistics
// //           </p>
// //         </div>
// //       </div>

// //       <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
// //         {/* Block Stats */}
// //         {blockStats && (
// //           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// //             {blockStats.map((stat, index) => (
// //               <StatCard
// //                 key={index}
// //                 title={stat.title}
// //                 value={stat.value}
// //                 subtitle={stat.subtitle}
// //                 icon={stat.icon}
// //                 isDark={isDark}
// //                 color={stat.color}
// //                 onClick={stat.onClick}
// //               />
// //             ))}
// //           </div>
// //         )}

// //         {/* Blocks Table */}
// //         {blocksDataArray.length > 0 ? (
// //           <>
// //             <div className={`rounded-md border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
// //               <Table
// //                 data={tableData}
// //                 columns={columns}
// //                 isDark={isDark}
// //                 striped
// //                 hoverable
// //                 bordered={false}
// //                 compact
// //               />
// //             </div>

// //             {/* Pagination */}
// //             {pagination.total_pages > 1 && (
// //               <div className={`mt-6 rounded-md border p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
// //                 <div className="flex items-center justify-between">
// //                   <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
// //                     Showing {(page - 1) * perPage + 1} to{' '}
// //                     {Math.min(page * perPage, pagination.total)} of {pagination.total}
// //                   </div>

// //                   <div className="flex items-center gap-2">
// //                     <button
// //                       onClick={handlePrevPage}
// //                       disabled={page === 1 || isFetching}
// //                       className={`p-2 rounded-md transition-colors ${
// //                         page === 1 || isFetching
// //                           ? isDark
// //                             ? 'bg-gray-700 text-gray-600'
// //                             : 'bg-gray-100 text-gray-400'
// //                           : isDark
// //                             ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
// //                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                       }`}
// //                     >
// //                       <ChevronLeft className="w-5 h-5" />
// //                     </button>

// //                     {/* Page Numbers */}
// //                     <div className="flex gap-1">
// //                       {Array.from(
// //                         { length: Math.min(5, pagination.total_pages) },
// //                         (_, i) => {
// //                           let pageNum;
// //                           if (pagination.total_pages <= 5) {
// //                             pageNum = i + 1;
// //                           } else if (page <= 3) {
// //                             pageNum = i + 1;
// //                           } else if (page >= pagination.total_pages - 2) {
// //                             pageNum = pagination.total_pages - 4 + i;
// //                           } else {
// //                             pageNum = page - 2 + i;
// //                           }

// //                           return (
// //                             <button
// //                               key={pageNum}
// //                               onClick={() => setPage(pageNum)}
// //                               disabled={isFetching}
// //                               className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors ${
// //                                 pageNum === page
// //                                   ? 'bg-[#00b2bd] text-white'
// //                                   : isDark
// //                                     ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
// //                                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                               }`}
// //                             >
// //                               {pageNum}
// //                             </button>
// //                           );
// //                         }
// //                       )}
// //                     </div>

// //                     <button
// //                       onClick={handleNextPage}
// //                       disabled={page === pagination.total_pages || isFetching}
// //                       className={`p-2 rounded-md transition-colors ${
// //                         page === pagination.total_pages || isFetching
// //                           ? isDark
// //                             ? 'bg-gray-700 text-gray-600'
// //                             : 'bg-gray-100 text-gray-400'
// //                           : isDark
// //                             ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
// //                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                       }`}
// //                     >
// //                       <ChevronRight className="w-5 h-5" />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         ) : (
// //           <EmptyState isDark={isDark} searchMoniker={searchHeight} />
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default BlocksList;



// // src/pages/Blocks/BlocksList.jsx
// import React, { useState } from 'react';
// import { useGetBlocksQuery } from './blockApiSlice';
// import { useGetStatsQuery } from '../stats/statsApiSlice';
// import { useTheme } from '../../context/ThemeContext';
// import { useNavigate } from 'react-router-dom';
// import Table from '../../ui/Table';
// import { 
//   Clock, 
//   Blocks,
//   Zap,
//   Users,
// } from 'lucide-react';
// import { getTimeAgo } from '../../hooks/formats';
// import ErrorState from '../../ui/ErrorState';
// import LoadingState from '../../ui/LoadingSkeleton';
// import EmptyState from '../../ui/EmptyState';
// import StatCard from '../../ui/HomeStat';
// import BlockStatsModal from './BlockStatsModal';
// import { Link } from 'react-router-dom';
// import AddressCell from '../../ui/AddressCell';

// const BlocksList = () => {
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';
//   const navigate = useNavigate();
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(20);
//   const [searchHeight, setSearchHeight] = useState('');

//   // Fetch blocks and stats data
//   const { data: blocksData, error, isLoading, isFetching } = useGetBlocksQuery({ 
//     page, 
//     per_page: perPage 
//   });
//   const { data: statsData } = useGetStatsQuery();

//   // Modal State
//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     statType: null,
//     title: '',
//   });

//   const handleBlockClick = (height) => {
//     navigate(`/blocks/${height}`);
//   };

//   const handleStatCardClick = (type, title) => {
//     setModalState({
//       isOpen: true,
//       statType: type,
//       title: title,
//     });
//   };

//   const handleCloseModal = () => {
//     setModalState({
//       isOpen: false,
//       statType: null,
//       title: '',
//     });
//   };

//   const blockStats = statsData ? [
//     {
//       title: "Latest Block",
//       value: statsData.latest_block_height?.toLocaleString() || "0",
//       icon: Blocks,
//       color: "#3b82f6",
//       subtitle: `${statsData.total_blocks?.toLocaleString() || 0} total`,
//       onClick: () => handleStatCardClick('latest-block', 'Daily Blocks'),
//     },
//     {
//       title: "Avg Block Time",
//       value: `${parseFloat(statsData.avg_block_time_seconds || 0).toFixed(2)}s`,
//       icon: Clock,
//       color: "#10b981",
//       subtitle: "per block",
//       onClick: () => handleStatCardClick('avg-block-time', 'Average Block Time'),
//     },
//     {
//       title: "Total Transactions",
//       value: statsData.total_transactions?.toLocaleString() || "0",
//       icon: Users,
//       color: "#8b5cf6",
//       subtitle: "all time",
//       onClick: () => handleStatCardClick('total-validators', 'Daily Transactions'),
//     },
//     {
//       title: "Average Gas",
//       value: parseInt(statsData.avg_gas_used || 0).toLocaleString(),
//       icon: Zap,
//       color: "#f59e0b",
//       subtitle: "gas per block",
//       onClick: () => handleStatCardClick('avg-gas', 'Average Gas Usage'),
//     }
//   ] : null;

//   // Format data for table
//   const blocksDataArray = blocksData?.data || [];
//   const pagination = blocksData?.pagination || { 
//     total: 0, 
//     total_pages: 1,
//     current_page: page,
//     per_page: perPage
//   };

//   const tableData = blocksDataArray.map((block) => ({
//     ...block,
//     displayHeight: block.height?.toLocaleString() || '0',
//     displayHash: block.hash,
//     displayGasUsed: block.gas_used?.toLocaleString() || '0',
//     displayGasWanted: block.gas_wanted?.toLocaleString() || '0',
//     displayTxCount: block.tx_count || 0,
//   }));

//   // Define table columns
//   const columns = [
//     {
//       key: 'displayHeight',
//       header: 'Block',
//       render: (value, row) => (
//         <button
//           onClick={() => handleBlockClick(row.height)}
//           className="text-[#006666] hover:text-[#008a95] font-semibold text-sm"
//         >
//           {value}
//         </button>
//       ),
//       width: '100px',
//     },
//     {
//       key: 'time',
//       header: 'Age',
//       render: (value) => (
//         <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//           {getTimeAgo(value)}
//         </div>
//       ),
//     },
//     {
//       key: 'proposer_address',
//       header: 'Validator',
//       render: (value, row) => (
//         <Link 
//           to={`/address/${row.proposer_address}`}
//           className="hover:opacity-80 transition-opacity"
//         >
//           <p className={`text-sm font-medium font-semibold hover:underline ${
//             isDark 
//               ? 'text-blue-400 hover:text-blue-300' 
//               : 'text-blue-600 hover:text-blue-700'
//           }`}>
//             <AddressCell address={value || 'Unknown'} />
//           </p>
//         </Link>
//       ),
//     },
//     {
//       key: 'displayTxCount',
//       header: 'Txs',
//       render: (value) => (
//         <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
//           {value}
//         </span>
//       ),
//       align: 'center',
//       width: '70px',
//     },
//     {
//       key: 'displayGasUsed',
//       header: 'Gas Used',
//       render: (value) => (
//         <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
//           {value}
//         </p>
//       ),
//       align: 'right',
//     },
//     {
//       key: 'total_amount_sent',
//       header: 'Amount',
//       render: (value) => (
//         <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
//           {value || '0'} JMC
//         </span>
//       ),
//       align: 'right',
//     },
//     {
//       key: 'reward',
//       header: 'Reward',
//       render: (value) => (
//         <span className={`text-sm head font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
//           {value || '0'}
//         </span>
//       ),
//       align: 'right',
//     },
//   ];

//   // ✅ PAGINATION HANDLER
//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // ✅ PER PAGE HANDLER
//   const handlePerPageChange = (newPerPage) => {
//     setPerPage(newPerPage);
//     setPage(1); // Reset to first page when changing per page
//   };

//   if (isLoading) {
//     return <LoadingState isDark={isDark} />;
//   }

//   if (error) {
//     return <ErrorState isDark={isDark} error={error} />;
//   }

//   return (
//     <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
//       <BlockStatsModal
//         isOpen={modalState.isOpen}
//         onClose={handleCloseModal}
//         statType={modalState.statType}
//         title={modalState.title}
//         isDark={isDark}
//       />

//       {/* Header */}
//       <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
//         <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex items-center gap-3 mb-0">
//             <h1 className={`text-3xl font-bold subheading ${isDark ? 'text-white' : 'text-gray-900'}`}>
//               Blocks
//             </h1>
//           </div>
//           <p className={`text-sm head ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//             Real-time blockchain block data and network statistics
//           </p>
//         </div>
//       </div>

//       <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Block Stats */}
//         {blockStats && (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             {blockStats.map((stat, index) => (
//               <StatCard
//                 key={index}
//                 title={stat.title}
//                 value={stat.value}
//                 subtitle={stat.subtitle}
//                 icon={stat.icon}
//                 isDark={isDark}
//                 color={stat.color}
//                 onClick={stat.onClick}
//               />
//             ))}
//           </div>
//         )}

//         {/* ✅ BLOCKS TABLE WITH BUILT-IN PAGINATION */}
//         <Table
//           // Data
//           data={tableData}
//           columns={columns}
//           isLoading={isFetching && !isLoading}
//           error={null}
//           rowKey="height"
          
//           // Header
//           title="Latest Blocks"
//           subtitle={`${pagination.total?.toLocaleString() || 0} total`}
          
//           // Pagination - Built into Table component
//           pagination={{
//             page: page,
//             totalPages: pagination.total_pages,
//             totalItems: pagination.total,
//             onPageChange: handlePageChange,
//           }}
          
//           // Per page selector
//           perPage={perPage}
//           perPageOptions={[10, 20, 50, 100]}
//           onPerPageChange={handlePerPageChange}
          
//           // Search (optional)
//           searchable={false}
          
//           // Sorting (optional)
//           sortable={false}
          
//           // Styling
//           compact={false}
//           striped={true}
//           hoverable={true}
//           bordered={true}
//           rounded={true}
          
//           // Empty state
//           emptyTitle="No blocks found"
//           emptyMessage="No blockchain blocks available at the moment."
//         />
//       </div>
//     </div>
//   );
// };

// export default BlocksList;



// src/pages/Blocks/BlocksList.jsx
import React, { useState } from 'react';
import { useGetBlocksQuery } from './blockApiSlice';
import { useGetStatsQuery } from '../stats/statsApiSlice';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Table from '../../ui/Table';
import { 
  Clock, 
  Blocks,
  Zap,
  Users,
} from 'lucide-react';
import { getTimeAgo } from '../../hooks/formats';
import ErrorState from '../../ui/ErrorState';
import LoadingState from '../../ui/LoadingSkeleton';
import EmptyState from '../../ui/EmptyState';
import StatCard from '../../ui/HomeStat';
import Pagination from '../../ui/Pagination';
import BlockStatsModal from './BlockStatsModal';
import { Link } from 'react-router-dom';
import AddressCell from '../../ui/AddressCell';

const BlocksList = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);

  // Fetch blocks and stats data
  const { data: blocksData, error, isLoading, isFetching } = useGetBlocksQuery({ 
    page, 
    per_page: perPage 
  });
  const { data: statsData } = useGetStatsQuery();

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    statType: null,
    title: '',
  });

  const handleBlockClick = (height) => {
    navigate(`/blocks/${height}`);
  };

  const handleStatCardClick = (type, title) => {
    setModalState({
      isOpen: true,
      statType: type,
      title: title,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      statType: null,
      title: '',
    });
  };

  const blockStats = statsData ? [
    {
      title: "Latest Block",
      value: statsData.latest_block_height?.toLocaleString() || "0",
      icon: Blocks,
      color: "#3b82f6",
      subtitle: `${statsData.total_blocks?.toLocaleString() || 0} total`,
      onClick: () => handleStatCardClick('latest-block', 'Daily Blocks'),
    },
    {
      title: "Avg Block Time",
      value: `${parseFloat(statsData.avg_block_time_seconds || 0).toFixed(2)}s`,
      icon: Clock,
      color: "#10b981",
      subtitle: "per block",
      onClick: () => handleStatCardClick('avg-block-time', 'Average Block Time'),
    },
    {
      title: "Total Transactions",
      value: statsData.total_transactions?.toLocaleString() || "0",
      icon: Users,
      color: "#8b5cf6",
      subtitle: "all time",
      onClick: () => handleStatCardClick('total-validators', 'Daily Transactions'),
    },
    {
      title: "Average Gas",
      value: parseInt(statsData.avg_gas_used || 0).toLocaleString(),
      icon: Zap,
      color: "#f59e0b",
      subtitle: "gas per block",
      onClick: () => handleStatCardClick('avg-gas', 'Average Gas Usage'),
    }
  ] : null;

  // Format data for table
  const blocksDataArray = blocksData?.data || [];
  const pagination = blocksData || { 
    total: 0, 
    total_pages: 1,
    page: page,
    per_page: perPage
  };

  const tableData = blocksDataArray.map((block) => ({
    ...block,
    displayHeight: block.height?.toLocaleString() || '0',
    displayGasUsed: block.gas_used?.toLocaleString() || '0',
    displayTxCount: block.tx_count || 0,
  }));

  // Define table columns
  const columns = [
    {
      key: 'displayHeight',
      header: 'Block',
      render: (value, row) => (
        <button
          onClick={() => handleBlockClick(row.height)}
          className="text-[#006666] hover:text-[#008a95] font-semibold text-sm"
        >
          {value}
        </button>
      ),
      width: '100px',
    },
    {
      key: 'time',
      header: 'Age',
      render: (value) => (
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {getTimeAgo(value)}
        </div>
      ),
    },
    {
      key: 'proposer_address',
      header: 'Validator',
      render: (value, row) => (
        <Link 
          to={`/address/${row.proposer_address}`}
          className="hover:opacity-80 transition-opacity"
        >
          <p className={`text-sm font-medium font-semibold hover:underline ${
            isDark 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-blue-600 hover:text-blue-700'
          }`}>
            <AddressCell address={value || 'Unknown'} />
          </p>
        </Link>
      ),
    },
    {
      key: 'displayTxCount',
      header: 'Txs',
      render: (value) => (
        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </span>
      ),
      align: 'center',
      width: '70px',
    },
    {
      key: 'displayGasUsed',
      header: 'Gas Used',
      render: (value) => (
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {value}
        </p>
      ),
      align: 'right',
    },
    {
      key: 'total_amount_sent',
      header: 'Amount',
      render: (value) => (
        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {value/1000000 || '0'} JMC
        </span>
      ),
      align: 'right',
    },
    {
      key: 'reward',
      header: 'Reward',
      render: (value) => (
        <span className={`text-sm head font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
          {value || '0'}
        </span>
      ),
      align: 'right',
    },
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <LoadingState isDark={isDark} />;
  }

  if (error) {
    return <ErrorState isDark={isDark} error={error} />;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <BlockStatsModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        statType={modalState.statType}
        title={modalState.title}
        isDark={isDark}
      />

      {/* Header */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-0">
            <h1 className={`text-3xl font-bold subheading ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Blocks
            </h1>
          </div>
          <p className={`text-sm head ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Real-time blockchain block data and network statistics
          </p>
        </div>
      </div>

      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Block Stats */}
        {blockStats && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {blockStats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                icon={stat.icon}
                isDark={isDark}
                color={stat.color}
                onClick={stat.onClick}
              />
            ))}
          </div>
        )}

        {/* Blocks Table */}
        {blocksDataArray.length > 0 ? (
          <>
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
{console.log('Pagination Info:', pagination.total_pages) }            {/* ✅ PAGINATION - Now using correct prop name */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.per_page}
              onPageChange={handlePageChange}
              isDark={isDark}
              isLoading={isFetching}
            />
          </>
        ) : (
          <EmptyState isDark={isDark} />
        )}
      </div>
    </div>
  );
};

export default BlocksList;