// // src/features/nft/NFTCollectionDetails.jsx
// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useGetNFTCollectionQuery, useGetNFTCollectionSummaryQuery } from './nftApiSlice';
// import { useTheme } from '../../context/ThemeContext';
// import nft from "/nft.svg";
// import {
//   ArrowLeft,
//   Package,
//   Image,
//   Users,
//   Flame,
//   Copy,
//   Check,
//   Clock,
//   Hash,
//   ExternalLink,
//   HelpCircle,
// } from 'lucide-react';

// // ═══════════════════════════════════════════
// // Helpers
// // ═══════════════════════════════════════════

// function timeAgo(timestamp) {
//   const now = new Date();
//   const then = new Date(timestamp);
//   const seconds = Math.floor((now - then) / 1000);
//   if (seconds < 60) return `${seconds}s ago`;
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   return `${days}d ago`;
// }

// // ═══════════════════════════════════════════
// // Main Component
// // ═══════════════════════════════════════════

// const NFTCollectionDetails = () => {
//   const { contractAddress } = useParams();
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';
//   const navigate = useNavigate();

//   const { data: collection, isLoading, error } = useGetNFTCollectionQuery(contractAddress);
//   const { data: summary } = useGetNFTCollectionSummaryQuery(contractAddress);

//   if (isLoading) return <DetailsSkeleton isDark={isDark} navigate={navigate} />;

//   if (error || !collection) {
//     return (
//       <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-[#f5f7f9]'}`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <button onClick={() => navigate(-1)} className={`flex items-center gap-2 mb-6 text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
//             <ArrowLeft className="w-4 h-4" /> Back
//           </button>
//           <div className={`rounded-lg border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//             <Package className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
//             <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Collection Not Found</h3>
//             <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{error?.message || 'The collection does not exist.'}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-[#f5f7f9]'}`}>

//       {/* Back Button */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <button
//           onClick={() => navigate(-1)}
//           className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back
//         </button>
//       </div>

//       {/* Content */}
//       <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
//         {/* Main Layout: Image Left, Data Right */}
//         <div className="grid  lg:grid-cols-3 gap-6">

//           {/* LEFT SIDE - Image & Basic Info */}
//           <div className="lg:col-span-1">
//             <div className={`rounded-lg border p-6 sticky top-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//               {/* Collection Image */}
//               <div className={`w-full aspect-square rounded-lg flex items-center justify-center mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                 <img src={nft} alt={collection.name} className="w-32 h-32" />
//               </div>

//               {/* Collection Name */}
//               <h1 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                 {collection.name}
//               </h1>

//               {/* Symbol Badge */}
//               <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-4 ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
//                 {collection.symbol}
//               </span>

//               {/* Collection Type */}
//               <p className={`text-xs font-medium mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
//                 ERC-721 NFT Collection
//               </p>

//               {/* Stats Section */}
//               <div className={`space-y-3 border-t ${isDark ? 'border-gray-700 pt-6' : 'border-gray-200 pt-6'}`}>
//                 <StatItem
//                   label="Total Supply"
//                   value={collection.total_supply?.toLocaleString() || 0}
//                   isDark={isDark}
//                 />
//                 <StatItem
//                   label="Total Minted"
//                   value={collection.total_minted?.toLocaleString() || 0}
//                   isDark={isDark}
//                 />
//                 <StatItem
//                   label="Total Burned"
//                   value={collection.total_burned?.toLocaleString() || 0}
//                   isDark={isDark}
//                 />
//                 {summary?.unique_holders !== undefined && (
//                   <StatItem
//                     label="Unique Holders"
//                     value={summary.unique_holders?.toLocaleString() || 0}
//                     isDark={isDark}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDE - Detailed Data */}
//           <div className="lg:col-span-2">
//             <div className={`rounded-lg border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//               <div className={`px-6 py-4 border-b ${isDark ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
//                 <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
//                   Collection Details
//                 </h2>
//               </div>

//               <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>

//                 {/* Contract Address */}
//                 <DetailRow isDark={isDark} label="Contract Address" tooltip="Smart contract address">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <code className={`px-3 py-2 rounded-md ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900'} font-semibold text-xs `}>
//                       {collection.contract_address}
//                     </code>
//                     <CopyBtn text={collection.contract_address} isDark={isDark} />
//                     <ExternalLinkBtn url={`https://bscscan.com/address/${collection.contract_address}`} isDark={isDark} />
//                   </div>
//                 </DetailRow>

//                 {/* Name */}
//                 <DetailRow isDark={isDark} label="Name" tooltip="Collection name">
//                   <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
//                     {collection.name}
//                   </span>
//                 </DetailRow>

//                 {/* Symbol */}
//                 <DetailRow isDark={isDark} label="Symbol" tooltip="Token symbol">
//                   <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold
//                     ${isDark ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-50 text-purple-700 border border-purple-200'}
//                   `}>
//                     {collection.symbol}
//                   </span>
//                 </DetailRow>

//                 {/* Creator */}
//                 <DetailRow isDark={isDark} label="Creator" tooltip="Address that deployed this collection">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <a href={`/address/${collection.creator}`} className="font-semibold text-xs text-[#00b2bd] hover:underline break-all">
//                       {collection.creator}
//                     </a>
//                     <CopyBtn text={collection.creator} isDark={isDark} />
//                     <ExternalLinkBtn url={`https://bscscan.com/address/${collection.creator}`} isDark={isDark} />
//                   </div>
//                 </DetailRow>

//                 {/* Code ID */}
//                 <DetailRow isDark={isDark} label="Code ID" tooltip="Smart contract code ID">
//                   <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold
//                     ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
//                   `}>
//                     <Hash className="w-3.5 h-3.5" />
//                     {collection.code_id}
//                   </span>
//                 </DetailRow>

//                 {/* Deployed At */}
//                 <DetailRow isDark={isDark} label="Deployed" tooltip="Deployment date and time">
//                   <div className="flex flex-col gap-1">
//                     <div className="flex items-center gap-2">
//                       <Clock className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
//                       <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
//                         {timeAgo(collection.deployed_at)}
//                       </span>
//                     </div>
//                     <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
//                       {new Date(collection.deployed_at).toLocaleString()}
//                     </span>
//                   </div>
//                 </DetailRow>

//                 {/* Deploy Tx Hash */}
//                 <DetailRow isDark={isDark} label="Deploy Tx" tooltip="Deployment transaction hash">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <a href={`/transactions/${collection.deploy_tx_hash}`} className="font-mono text-xs text-[#00b2bd] hover:underline break-all">
//                       {collection.deploy_tx_hash}
//                     </a>
//                     <CopyBtn text={collection.deploy_tx_hash} isDark={isDark} />
//                     <ExternalLinkBtn url={`https://bscscan.com/tx/${collection.deploy_tx_hash}`} isDark={isDark} />
//                   </div>
//                 </DetailRow>

//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default NFTCollectionDetails;

// // ═══════════════════════════════════════════
// // Sub Components
// // ═══════════════════════════════════════════

// const StatItem = ({ label, value, isDark }) => (
//   <div className={`flex items-center justify-between text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
//     <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
//     <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</span>
//   </div>
// );

// const CopyBtn = ({ text, isDark }) => {
//   const [copied, setCopied] = useState(false);
//   return (
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         navigator.clipboard.writeText(text);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 1500);
//       }}
//       title="Copy to clipboard"
//       className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
//     >
//       {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
//     </button>
//   );
// };

// const ExternalLinkBtn = ({ url, isDark }) => (
//   <a
//     href={url}
//     target="_blank"
//     rel="noopener noreferrer"
//     title="View on BscScan"
//     className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
//   >
//     <ExternalLink className="w-4 h-4" />
//   </a>
// );

// const Tooltip = ({ text, children, isDark }) => (
//   <div className="relative group/tip inline-flex">
//     {children}
//     <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs
//       opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible
//       transition-all duration-200 z-50 whitespace-nowrap shadow-lg pointer-events-none
//       ${isDark ? 'bg-gray-900 border border-gray-700 text-gray-300' : 'bg-gray-800 text-white'}
//     `}>
//       {text}
//       <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1
//         ${isDark ? 'bg-gray-900 border-r border-b border-gray-700' : 'bg-gray-800'}
//       `} />
//     </div>
//   </div>
// );

// const DetailRow = ({ label, tooltip, children, isDark }) => (
//   <div className={`px-6 py-4 flex flex-row sm:flex-row sm:items-start gap-2 sm:gap-4 ${isDark ? 'hover:bg-gray-700/20' : 'hover:bg-gray-50'} transition-colors`}>
//     <div className="sm:w-[160px] flex-shrink-0 flex items-center gap-2">
//       <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
//         {label}
//       </span>
//     </div>
//     <div className="flex-1 min-w-0">
//       {children}
//     </div>
//   </div>
// );

// const DetailsSkeleton = ({ isDark, navigate }) => (
//   <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-[#f5f7f9]'}`}>
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//       <button onClick={() => navigate(-1)} className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
//         <ArrowLeft className="w-4 h-4" /> Back
//       </button>
//     </div>
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Skeleton */}
//         <div className="lg:col-span-1">
//           <div className={`rounded-lg border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//             <div className={`w-full aspect-square rounded-lg mb-6 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
//             <div className={`h-6 w-32 rounded mb-2 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
//             <div className={`h-4 w-24 rounded mb-4 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
//             <div className={`h-px mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className={`h-4 w-full rounded mb-3 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
//             ))}
//           </div>
//         </div>

//         {/* Right Skeleton */}
//         <div className="lg:col-span-2">
//           <div className={`rounded-lg border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//             <div className={`px-6 py-4 ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
//               <div className={`h-5 w-40 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
//             </div>
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className={`px-6 py-4 border-b animate-pulse ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
//                 <div className="flex gap-4">
//                   <div className={`h-4 w-32 rounded flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
//                   <div className={`h-4 rounded flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );


// src/features/nft/NFTCollectionDetails.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetNFTCollectionQuery, useGetNFTCollectionSummaryQuery } from './nftApiSlice';
import { useTheme } from '../../context/ThemeContext';
import nft from "/nft.svg";
import {
  ArrowLeft,
  Package,
  Copy,
  Check,
  Clock,
  Hash,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════

function timeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ═══════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════

const NFTCollectionDetails = () => {
  const { contractAddress } = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const { data: collection, isLoading, error } = useGetNFTCollectionQuery(contractAddress);
  const { data: summary } = useGetNFTCollectionSummaryQuery(contractAddress);

  if (isLoading) return <DetailsSkeleton isDark={isDark} navigate={navigate} />;

  if (error || !collection) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-[#f5f7f9]'}`}>
        {/* Back Button */}
        <div className={`border-b ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button 
              onClick={() => navigate(-1)} 
              className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`rounded-lg border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <Package className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
            <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Collection Not Found</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{error?.message || 'The collection does not exist.'}</p>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* Main Layout: Image Left, Data Right */}
        <div className="grid  lg:grid-cols-3 gap-6">

          {/* LEFT SIDE - Image & Basic Info */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg border p-2 sm:p-6 sticky top-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {/* Collection Image */}
              <div className={`w-full aspect-square rounded-lg flex items-center justify-center mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <img src={nft} alt={collection.name} className="w-24 sm:w-32 h-24 sm:h-32" />
              </div>

              {/* Collection Name */}
              <h1 className={`text-lg sm:text-xl font-bold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {collection.name}
              </h1>

              {/* Symbol Badge */}
              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-4 ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}>
                {collection.symbol}
              </span>

              {/* Collection Type */}
              <p className={`text-xs font-medium head mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                JMC-721 NFT Collection
              </p>


            </div>
          </div>

          {/* RIGHT SIDE - Detailed Data */}
          <div className="lg:col-span-2">
            <div className={`rounded-lg border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`px-4 sm:px-6 py-4 border-b ${isDark ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Collection Details
                </h2>
              </div>

              <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>

                {/* Contract Address */}
                <DetailRow isDark={isDark} label="Contract Address" tooltip="Smart contract address">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className={`px-3 py-2 rounded-md text-xs break-all ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900'} font-semibold`}>
                      {collection.contract_address}
                    </code>
                    <CopyBtn text={collection.contract_address} isDark={isDark} />
                    <ExternalLinkBtn url={`https://bscscan.com/address/${collection.contract_address}`} isDark={isDark} />
                  </div>
                </DetailRow>

                {/* Name */}
                <DetailRow isDark={isDark} label="Name" tooltip="Collection name">
                  <span className={`text-xs sm:text-sm font-medium break-all ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {collection.name}
                  </span>
                </DetailRow>

                {/* Symbol */}
                <DetailRow isDark={isDark} label="Symbol" tooltip="Token symbol">
                  <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold
                    ${isDark ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-50 text-purple-700 border border-purple-200'}
                  `}>
                    {collection.symbol}
                  </span>
                </DetailRow>

                {/* Creator */}
                <DetailRow isDark={isDark} label="Creator" tooltip="Address that deployed this collection">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`/address/${collection.creator}`} className="font-semibold text-xs text-[#00b2bd] hover:underline break-all">
                      {collection.creator}
                    </a>
                    <CopyBtn text={collection.creator} isDark={isDark} />
                    <ExternalLinkBtn url={`https://bscscan.com/address/${collection.creator}`} isDark={isDark} />
                  </div>
                </DetailRow>

                {/* Code ID */}
                <DetailRow isDark={isDark} label="Code ID" tooltip="Smart contract code ID">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold
                    ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
                  `}>
                    <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                    {collection.code_id}
                  </span>
                </DetailRow>

                {/* Deployed At */}
                <DetailRow isDark={isDark} label="Deployed" tooltip="Deployment date and time">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        {timeAgo(collection.deployed_at)}
                      </span>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(collection.deployed_at).toLocaleString()}
                    </span>
                  </div>
                </DetailRow>

                {/* Deploy Tx Hash */}
                <DetailRow isDark={isDark} label="Deploy Tx" tooltip="Deployment transaction hash">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`/transactions/${collection.deploy_tx_hash}`} className="font-mono text-xs text-[#00b2bd] hover:underline break-all">
                      {collection.deploy_tx_hash}
                    </a>
                    <CopyBtn text={collection.deploy_tx_hash} isDark={isDark} />
                    <ExternalLinkBtn url={`https://bscscan.com/tx/${collection.deploy_tx_hash}`} isDark={isDark} />
                  </div>
                </DetailRow>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NFTCollectionDetails;

// ═══════════════════════════════════════════
// Sub Components
// ═══════════════════════════════════════════

const StatItem = ({ label, value, isDark }) => (
  <div className={`flex items-center justify-between text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
    <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
    <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</span>
  </div>
);

const CopyBtn = ({ text, isDark }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      title="Copy to clipboard"
      className={`p-1.5 rounded transition-colors flex-shrink-0 ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

const ExternalLinkBtn = ({ url, isDark }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    title="View on BscScan"
    className={`p-1.5 rounded transition-colors flex-shrink-0 ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}
  >
    <ExternalLink className="w-4 h-4" />
  </a>
);

const Tooltip = ({ text, children, isDark }) => (
  <div className="relative group/tip inline-flex">
    {children}
    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs z-50
      opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible
      transition-all duration-200 whitespace-nowrap shadow-lg pointer-events-none
      ${isDark ? 'bg-gray-900 border border-gray-700 text-gray-300' : 'bg-gray-800 text-white'}
    `}>
      {text}
      <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 -mt-1
        ${isDark ? 'bg-gray-900 border-r border-b border-gray-700' : 'bg-gray-800'}
      `} />
    </div>
  </div>
);

const DetailRow = ({ label, tooltip, children, isDark }) => (
  <div className={`px-4 sm:px-6 py-3 sm:py-4 flex flex-row sm:flex-row sm:items-start gap-2 sm:gap-4 ${isDark ? 'hover:bg-gray-700/20' : 'hover:bg-gray-50'} transition-colors`}>
    <div className="sm:w-[160px] flex-shrink-0 flex items-center gap-2">
      {/* {tooltip && (
        <Tooltip text={tooltip} isDark={isDark}>
          <HelpCircle className={`w-4 h-4 flex-shrink-0 cursor-help ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        </Tooltip>
      )} */}
      <span className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      {children}
    </div>
  </div>
);

const DetailsSkeleton = ({ isDark, navigate }) => (
  <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-[#f5f7f9]'}`}>
    {/* Back Button Header */}
    <div className={`border-b ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button 
          onClick={() => navigate(-1)} 
          className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Skeleton */}
        <div className="lg:col-span-1">
          <div className={`rounded-lg border p-4 sm:p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`w-full aspect-square rounded-lg mb-6 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-5 sm:h-6 w-32 rounded mb-2 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-3 sm:h-4 w-24 rounded mb-4 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-px mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-3 sm:h-4 w-full rounded mb-3 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {/* Right Skeleton */}
        <div className="lg:col-span-2">
          <div className={`rounded-lg border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-4 sm:px-6 py-4 ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
              <div className={`h-4 sm:h-5 w-40 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`px-4 sm:px-6 py-3 sm:py-4 border-b animate-pulse ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex gap-4">
                  <div className={`h-3 sm:h-4 w-24 sm:w-32 rounded flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <div className={`h-3 sm:h-4 rounded flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);