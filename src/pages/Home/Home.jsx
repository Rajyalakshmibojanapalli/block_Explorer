// import { useGetHomeDataQuery, useLazySearchQuery } from "./homeApiSlice.js";
// import { useTheme } from "../../context/ThemeContext";
// import { Search, Images, Box, Newspaper, UserRoundCheck, Captions, CircleDollarSign, Wallet, Menu, TrendingUp, Timer } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import StatCard from "../../ui/HomeStat.jsx";
// import { formatTime, timeAgo, truncateHash, truncateAddress, formatMethod } from "../../hooks/formats.js";
// import LoadingSkeleton from "../../ui/LoadingSkeleton.jsx";
// import ErrorState from "../../ui/ErrorState.jsx";
// import FeatureCard from "../../ui/FeatureCard.jsx";

// const Home = () => {
//   const { data, isLoading, isError, refetch } = useGetHomeDataQuery();
//   const [triggerSearch, { data: searchResult, isLoading: isSearching, error: searchError }] = useLazySearchQuery();
//   const { theme } = useTheme();
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const isDark = theme === "dark";

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       try {
//         const result = await triggerSearch({ q: searchQuery, limit: 1 }).unwrap();

//         if (result?.results && result.results.length > 0) {
//           const firstResult = result.results[0];
//           const { type } = result;
//           if (type.is_a_user_address || type.is_a_contract_address) {
//             navigate(`/address/${firstResult.value}`);
//           } else if (type.is_a_transaction_hash) {
//             navigate(`/transactions/${firstResult.value}`);
//           } else if (type.is_a_block_number) {
//             navigate(`/blocks/${firstResult.value}`);
//           } else {
//             navigate(`/address/${firstResult.value}`);
//           }
//         } else {
//           navigate(`/address/${firstResult.value}`);
//         }

//       } catch (err) {
//         console.error("Search failed:", err);
//       }
//     }
//   };
//   if (isLoading) return <LoadingSkeleton isDark={isDark} />;
//   if (isError) return <ErrorState onRetry={refetch} isDark={isDark} />;

//   const { stats, latest_blocks, latest_transactions } = data || {};

//   return (
//     <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-[#f5f7f9]"} transition-colors`}>
//       <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-6">

//         {/* ── Hero + Search ── */}
//         <div className="text-center max-w-3xl mx-auto mb-6">
//           <h1 className={`text-xl sm:text-3xl head lg:text-4xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
//             JMC Coin Smart Chain Explorer
//           </h1>
//           <form onSubmit={handleSearch} className="relative flex items-center max-w-2xl mx-auto">
//           <input
//   type="text"
//   value={searchQuery}
//   onChange={(e) => setSearchQuery(e.target.value)}
//   placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
//   className="w-full pl-5 bg-white text-black pr-16 py-3 text-sm rounded-full shadow-[0_2px_8px_rgba(0,178,189,0.1)] transition-all focus:outline-none focus:ring-2 placeholder-gray-500 focus:ring-[#00b2bd]/20 focus:shadow-[0_4px_12px_rgba(0,178,189,0.15)]"
// />
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="absolute right-1.5 w-9 h-9 flex items-center justify-center bg-[#00b2bd] text-white rounded-full transition-colors hover:bg-[#009da7] disabled:opacity-50"
//             >
//               <Search size={15} className={isLoading ? "animate-spin" : ""} />
//             </button>
//           </form>
//         </div>

//         {/* ── Stat Cards ── */}
//         <div className="grid  sm:grid-cols-2 lg:grid-cols-4 gap-3">
//           <StatCard
//             title="Total Transactions"
//             value={stats?.total_transactions?.toLocaleString() || "—"}
//             badge="LIVE"
//             icon={<Wallet />}
//             isDark={isDark}
//           />
//           <StatCard
//             title="Block Height"
//             value={stats?.block_height?.toLocaleString() || "—"}
//             badge="LIVE"
//             icon={<Menu />}
//             isDark={isDark}
//           />
//           <StatCard
//             title="Transactions/Day"
//             value={stats?.tps ? (stats.tps * 86400).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0"}
//             badge="24H"
//             icon={<TrendingUp />}
//             isDark={isDark}
//           />
//           <StatCard
//             title="Avg Block Time"
//             value={stats?.avg_block_time ? `${stats.avg_block_time}s` : "—"}
//             badge="24H"
//             icon={<Timer />}
//             isDark={isDark}
//           />
//         </div>

//         {/* ── Latest Blocks + Latest Transactions (side by side) ── */}
//         <div className="grid  xl:grid-cols-2 lg:grid-cols-2 gap-4 rounded-lg">

//           {/* Latest Blocks */}
//           <div className={`rounded-lg border overflow-hidden shadow-sm ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
//             <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
//               <h2 className={`text-base font-semibold flex items-center head gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
//                 {/* <span className="w-2 h-2 rounded-full bg-[#00b2bd] animate-pulse" /> */}
//                 Latest Blocks
//               </h2>
//               <a href="/blocks" className="text-sm text-[#006666] hover:underline font-semibold flex items-center gap-1">
//                 View All

//               </a>
//             </div>

//             <div className="divide-y divide-gray-100 dark:divide-gray-100">
//               {latest_blocks && latest_blocks.length > 0 ? (
//                 latest_blocks.slice(0, 6).map((block, i) => (
//                   <div
//                     key={block.hash || i}
//                     className={`flex items-center gap-3 px-5 py-3 transition-colors ${isDark ? "hover:bg-gray-700/40" : "hover:bg-gray-50"
//                       }`}
//                   >
//                     {/* Block icon */}
//                     <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-[#00b2bd]/10" : "bg-[#00b2bd]/10"
//                       }`}>
//                       <Box className="w-4 h-4 text-[#006666]" />
//                     </div>

//                     {/* Block # + validator */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-3">
//                         <a
//                           href={`/blocks/${block.height}`}
//                           className="text-[#006666] text-sm font-semibold hover:underline"
//                         >
//                           {block.height?.toLocaleString()}
//                         </a>

//                         <p
//                           className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}
//                         >
//                           {formatTime(block.time)}
//                         </p>
//                       </div>
//                       <p className={`text-sm font-base  ${isDark ? "text-[#545b6d]" : "text-[#545b6d]"}`}>
//                         Validated by{" "}
//                         <span className={isDark ? "text-[#006666]" : "text-[#006666]"}>
//                           {block.validator_name || "Unknown"}
//                         </span>
//                       </p>
//                     </div>



//                     {/* Amount if available */}
//                     {block.reward && (
//                       <div className="text-right shrink-0 head min-w-[80px]">
//                         <span className={`text-[12px] font-bold bg-[#e4fcfc] p-2 rounded-full font-semibold ${isDark ? "text-[#006666" : "text-[#006666]"}`}>
//                           {(block.reward)}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className={`px-5 py-10 text-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
//                   No blocks found
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Latest Transactions */}
//           <div className={`rounded-lg border overflow-hidden shadow-sm ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
//             <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
//               <h2 className={`text-base font-semibold flex head items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
//                 {/* <span className="w-2 h-2 rounded-full bg-[#00b2bd] animate-pulse" /> */}
//                 Latest Transactions
//               </h2>
//               <a href="/transactions" className="text-sm text-[#006666] hover:underline font-semibold flex items-center gap-1">
//                 View All
//               </a>
//             </div>

//             <div className="divide-y divide-gray-50 dark:divide-gray-100">
//               {latest_transactions && latest_transactions.length > 0 ? (
//                 latest_transactions.slice(0, 6).map((tx, i) => (
//                   <div
//                     key={tx.hash || i}
//                     className={`flex items-center gap-3 px-5 py-3 transition-colors ${isDark ? "hover:bg-gray-700/40" : "hover:bg-gray-50"
//                       }`}
//                   >
//                     <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-[#00b2bd]/10" : "bg-[#00b2bd]/10"
//                       }`}>
//                       <Newspaper className="w-4 h-4 text-[#006666]" />
//                     </div>

//                     {/* Hash + from→to */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-1">
//                         <a
//                           href={`/transactions/${tx.hash}`}
//                           className="text-[#006666] text-xs font-semibold hover:underline"
//                           title={tx.hash}
//                         >
//                           {truncateHash(tx.hash, 10, 4)}
//                         </a>
//                         <p className={`text-xs mb-1 ${isDark ? "text-gray-600" : "text-gray-600"}`}>
//                           {timeAgo(tx.timestamp)}
//                         </p>

//                       </div>
//                       <p className={`text-xs mt-0.5 font-regular ${isDark ? "text-gray-600" : "text-gray-600"}`}>
//                         From{" "}
//                         <a href={`/address/${tx.from_address}`} className="text-[#006666] hover:underline font-medium">
//                           {truncateAddress(tx.from_address)}
//                         </a>
//                         {tx.to_address && (
//                           <>
//                             {" "}To{" "}
//                             <a href={`/address/${tx.to_address}`} className="text-[#006666] hover:underline font-medium">
//                               {truncateAddress(tx.to_address)}
//                             </a>
//                           </>
//                         )}
//                       </p>
//                     </div>

//                     {/* Time + amount */}
//                     <div className="text-right shrink-0 flex flex-col items-end gap-1">
//                       <span
//                         className={`text-xs font-semibold head ${isDark ? "text-[#006666]" : "text-[#006666]"
//                           }`}
//                       >
//                         {(tx.amount_value / 1_000_000).toFixed(2)} JMC
//                       </span>

//                       <span
//                         className={`text-[8px] px-1.5 head py-0.5 rounded font-bold ${isDark
//                           ? "bg-gray-700 text-gray-400"
//                           : "bg-gray-100 text-gray-500"
//                           }`}
//                       >
//                         {formatMethod(tx.method)}
//                       </span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className={`px-5 py-10 text-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
//                   No transactions found
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── Feature Cards ── */}
//         <div className="grid  lg:grid-cols-4 gap-3">
//           <FeatureCard
//             icon={<UserRoundCheck className="w-6 h-6 text-[#006666]" />}
//             title="Validators"
//             description="Network nodes and consensus"
//             href="/validators"
//             isDark={isDark}
//           />
//           <FeatureCard
//             icon={<Images className="w-6 h-6 text-[#006666]" />}
//             title="NFTs"
//             description="Collectibles and assets"
//             href="/nfts"
//             isDark={isDark}
//           />
//           <FeatureCard
//             icon={<Captions className="w-6 h-6 text-[#006666]" />}
//             title="Proposals"
//             description="Governance and voting"
//             href="/proposals"
//             isDark={isDark}
//           />
//           <FeatureCard
//             icon={<CircleDollarSign className="w-6 h-6 text-[#006666]" />}
//             title="Tokens"
//             description="Native and bridged tokens"
//             href="/tokens"
//             isDark={isDark}
//           />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Home;

import { useGetHomeDataQuery, useLazySearchQuery } from "./homeApiSlice.js";
import { useTheme } from "../../context/ThemeContext";
import { Search, Images, Box, Newspaper, UserRoundCheck, Captions, CircleDollarSign, Wallet, Menu, TrendingUp, Timer, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link import
import StatCard from "../../ui/HomeStat.jsx";
import { formatTime, timeAgo, truncateHash, truncateAddress, formatMethod } from "../../hooks/formats.js";
import LoadingSkeleton from "../../ui/LoadingSkeleton.jsx";
import ErrorState from "../../ui/ErrorState.jsx";
import FeatureCard from "../../ui/FeatureCard.jsx";

const Home = () => {
  // Enable refetching with pollingInterval
  const { 
    data, 
    isLoading, 
    isError, 
    isFetching,
    refetch 
  } = useGetHomeDataQuery(undefined, {
    pollingInterval: 30000, // Auto-refetch every 30 seconds
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const [triggerSearch, { isLoading: isSearching }] = useLazySearchQuery();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const isDark = theme === "dark";

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const result = await triggerSearch({ q: searchQuery, limit: 1 }).unwrap();

        if (result?.results && result.results.length > 0) {
          const firstResult = result.results[0];
          const { type } = result;
          if (type.is_a_user_address || type.is_a_contract_address) {
            navigate(`/address/${firstResult.value}`);
          } else if (type.is_a_transaction_hash) {
            navigate(`/transactions/${firstResult.value}`);
          } else if (type.is_a_block_number) {
            navigate(`/blocks/${firstResult.value}`);
          } else {
            navigate(`/address/${firstResult.value}`);
          }
        } else {
          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
        setSearchQuery(""); // Clear after search
      } catch (err) {
        console.error("Search failed:", err);
      }
    }
  };

  if (isLoading) return <LoadingSkeleton isDark={isDark} />;
  if (isError) return <ErrorState onRetry={refetch} isDark={isDark} />;

  const { stats, latest_blocks, latest_transactions } = data || {};

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-[#f5f7f9]"} transition-colors`}>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-6">

        {/* ── Hero + Search ── */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className={`text-xl sm:text-3xl head lg:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              JMC Coin Smart Chain Explorer
            </h1>
            {/* Manual Refresh Button */}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className={`p-2 rounded-lg transition-all ${
                isDark 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              } ${isFetching ? 'opacity-50' : ''}`}
              title="Refresh data"
            >
              <RefreshCw size={20} className={isFetching ? "animate-spin" : ""} />
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative flex items-center max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
              disabled={isSearching}
              className="w-full pl-5 bg-white text-black pr-16 py-3 text-sm rounded-full shadow-[0_2px_8px_rgba(0,178,189,0.1)] transition-all focus:outline-none focus:ring-2 placeholder-gray-500 focus:ring-[#00b2bd]/20 focus:shadow-[0_4px_12px_rgba(0,178,189,0.15)] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1.5 w-9 h-9 flex items-center justify-center bg-[#00b2bd] text-white rounded-full transition-colors hover:bg-[#009da7] disabled:opacity-50"
            >
              <Search size={15} className={isSearching ? "animate-spin" : ""} />
            </button>
          </form>
        </div>

        {/* Loading indicator when fetching in background */}
        {isFetching && !isLoading && (
          <div className="fixed top-20 right-4 z-50">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <RefreshCw size={14} className="animate-spin text-[#00b2bd]" />
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Updating...
              </span>
            </div>
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Total Transactions"
            value={stats?.total_transactions?.toLocaleString() || "—"}
            badge="LIVE"
            icon={<Wallet />}
            isDark={isDark}
          />
          <StatCard
            title="Block Height"
            value={stats?.block_height?.toLocaleString() || "—"}
            badge="LIVE"
            icon={<Menu />}
            isDark={isDark}
          />
          <StatCard
            title="Transactions/Day"
            value={stats?.tps ? (stats.tps * 86400).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0"}
            badge="24H"
            icon={<TrendingUp />}
            isDark={isDark}
          />
          <StatCard
            title="Avg Block Time"
            value={stats?.avg_block_time ? `${stats.avg_block_time}s` : "—"}
            badge="24H"
            icon={<Timer />}
            isDark={isDark}
          />
        </div>

        {/* ── Latest Blocks + Latest Transactions ── */}
        <div className="grid xl:grid-cols-2 lg:grid-cols-2 gap-4 rounded-lg">

          {/* Latest Blocks */}
          <div className={`rounded-lg border overflow-hidden shadow-sm ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <h2 className={`text-base font-semibold flex items-center head gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                Latest Blocks
                {isFetching && (
                  <span className="w-2 h-2 rounded-full bg-[#00b2bd] animate-pulse" />
                )}
              </h2>
              <Link to="/blocks" className="text-sm text-[#006666] hover:underline font-semibold flex items-center gap-1">
                View All
              </Link>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-100">
              {latest_blocks && latest_blocks.length > 0 ? (
                latest_blocks.slice(0, 6).map((block, i) => (
                  <div
                    key={block.hash || i}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                      isDark ? "hover:bg-gray-700/40" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isDark ? "bg-[#00b2bd]/10" : "bg-[#00b2bd]/10"
                    }`}>
                      <Box className="w-4 h-4 text-[#006666]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/blocks/${block.height}`}
                          className="text-[#006666] text-sm font-semibold hover:underline"
                        >
                          {block.height?.toLocaleString()}
                        </Link>
                        <p className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                          {formatTime(block.time)}
                        </p>
                      </div>
                      <p className={`text-sm font-base ${isDark ? "text-[#545b6d]" : "text-[#545b6d]"}`}>
                        Validated by{" "}
                        <span className={isDark ? "text-[#006666]" : "text-[#006666]"}>
                          {block.validator_name || "Unknown"}
                        </span>
                      </p>
                    </div>

                    {block.reward && (
                      <div className="text-right shrink-0 head min-w-[80px]">
                        <span className={`text-[12px] font-bold bg-[#e4fcfc] p-2 rounded-full font-semibold ${
                          isDark ? "text-[#006666]" : "text-[#006666]"
                        }`}>
                          {block.reward}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={`px-5 py-10 text-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  No blocks found
                </div>
              )}
            </div>
          </div>

          {/* Latest Transactions */}
          <div className={`rounded-lg border overflow-hidden shadow-sm ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <h2 className={`text-base font-semibold flex head items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                Latest Transactions
                {isFetching && (
                  <span className="w-2 h-2 rounded-full bg-[#00b2bd] animate-pulse" />
                )}
              </h2>
              <Link to="/transactions" className="text-sm text-[#006666] hover:underline font-semibold flex items-center gap-1">
                View All
              </Link>
            </div>

            <div className="divide-y divide-gray-50 dark:divide-gray-100">
              {latest_transactions && latest_transactions.length > 0 ? (
                latest_transactions.slice(0, 6).map((tx, i) => (
                  <div
                    key={tx.hash || i}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                      isDark ? "hover:bg-gray-700/40" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isDark ? "bg-[#00b2bd]/10" : "bg-[#00b2bd]/10"
                    }`}>
                      <Newspaper className="w-4 h-4 text-[#006666]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/transactions/${tx.hash}`}
                          className="text-[#006666] text-xs font-semibold hover:underline"
                          title={tx.hash}
                        >
                          {truncateHash(tx.hash, 10, 4)}
                        </Link>
                        <p className={`text-xs mb-1 ${isDark ? "text-gray-600" : "text-gray-600"}`}>
                          {timeAgo(tx.timestamp)}
                        </p>
                      </div>
                      <p className={`text-xs mt-0.5 font-regular ${isDark ? "text-gray-600" : "text-gray-600"}`}>
                        From{" "}
                        <Link to={`/address/${tx.from_address}`} className="text-[#006666] hover:underline font-medium">
                          {truncateAddress(tx.from_address)}
                        </Link>
                        {tx.to_address && (
                          <>
                            {" "}To{" "}
                            <Link to={`/address/${tx.to_address}`} className="text-[#006666] hover:underline font-medium">
                              {truncateAddress(tx.to_address)}
                            </Link>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className={`text-xs font-semibold head ${isDark ? "text-[#006666]" : "text-[#006666]"}`}>
                        {(tx.amount_value / 1_000_000).toFixed(2)} JMC
                      </span>
                      <span className={`text-[8px] px-1.5 head py-0.5 rounded font-bold ${
                        isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
                      }`}>
                        {formatMethod(tx.method)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`px-5 py-10 text-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  No transactions found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid lg:grid-cols-4 gap-3">
          <FeatureCard
            icon={<UserRoundCheck className="w-6 h-6 text-[#006666]" />}
            title="Validators"
            description="Network nodes and consensus"
            href="/validators/leaderboard"
            isDark={isDark}
          />
          <FeatureCard
            icon={<Images className="w-6 h-6 text-[#006666]" />}
            title="NFTs"
            description="Collectibles and assets"
            href="/nft/top"
            isDark={isDark}
          />
          <FeatureCard
            icon={<Captions className="w-6 h-6 text-[#006666]" />}
            title="Proposals"
            description="Governance and voting"
            href="/governance"
            isDark={isDark}
          />
          <FeatureCard
            icon={<CircleDollarSign className="w-6 h-6 text-[#006666]" />}
            title="Tokens"
            description="Native and bridged tokens"
            href="/tokens"
            isDark={isDark}
          />
        </div>

      </div>
    </div>
  );
};

export default Home;