// src/features/nft/NFTCollections.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetNFTCollectionsQuery } from './nftApiSlice';
import { useTheme } from '../../context/ThemeContext';
import {
  Image,
  Package,
  Flame,
  Clock,
} from 'lucide-react';
import Table, { CopyButton, Badge } from '../../ui/Table';
import { timeAgo, truncateAddress } from '../../hooks/formats';
import StatsCard from '../../ui/HomeStat';
const NFTCollections = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isFetching, error } = useGetNFTCollectionsQuery({
    page,
    per_page: perPage,
  });

  const collections = data?.data || [];
  const totalPages = data?.total_pages || 1;
  const totalItems = data?.total || 0;

  // Filter collections by search
  const filteredCollections = collections.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.symbol?.toLowerCase().includes(q) ||
      c.contract_address?.toLowerCase().includes(q) ||
      c.creator?.toLowerCase().includes(q)
    );
  });


  // ─── Table Configuration ──────────────────────────────────────
  const columns = [
    {
      key: 'contract_address',
      header: 'Collection',
      align: 'center',
      render: (value, row) => (
        <div className="w-full h-full flex justify-center">

          <div className="flex items-center gap-3 text-center">

            {/* Avatar */}
            <img
              src="/nft.svg"
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />

            {/* Content */}
            <div className="flex flex-col items-center leading-tight">

              {/* Name */}
              <span
                className={`text-[15px] font-semibold hover:text-[#00b2bd] truncate ${isDark ? 'text-gray-200' : 'text-[#006666]'
                  }`}
              >
                {row.name}
              </span>

              {/* Address */}
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <span
                  className={`text-[12px] ${isDark ? 'text-gray-500' : 'text-gray-600'
                    }`}
                >
                  {truncateAddress(value, 8, 4)}
                </span>
                <CopyButton text={value} />
              </div>

            </div>
          </div>

        </div>
      ),
    },
    {
      key: 'symbol',
      header: 'Symbol',
      render: (value) => (
        <Badge className="font-semibold  rounded-full text-[12px] text-[#006666] bg-[#f0f9ff] border border-[#d0e7ff]" >
          {value}
        </Badge>
      ),
    },
    {
      key: 'total_supply',
      header: 'Total Supply',
      align: 'center',
      render: (value) => (
        <span className={`text-[12px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {value?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: 'total_minted',
      header: 'Total Minted',
      align: 'center',
      render: (value) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium
          
        `}>
          {/* <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> */}
          {value?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: 'total_burned',
      header: 'Total Burned',
      align: 'center',
      render: (value) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium
         
        `}>
          {/* <Flame className="w-3 h-3" /> */}
          {value?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: 'creator',
      header: 'Creator',
      render: (value) => (
        <div className="">
          <a
            href={`/address/${value}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[13px] font-semibold text-[#006666] hover:underline"
          >
            {truncateAddress(value, 6, 4)}
          </a>
          <CopyButton text={value} />
        </div>
      ),
    },
    {
      key: 'deployed_at',
      header: 'Deployed',
      render: (value) => (
        <div className="">
          {/* <Clock className={`w-3 h-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} /> */}
          <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-700'}`} title={new Date(value).toLocaleString()}>
            {timeAgo(value)}
          </span>
        </div>
      ),
    },
    {
      key: 'code_id',
      header: 'Code ID',
      align: 'center',
      render: (value) => (
        <span className={`text-[11px]  font-bold ${isDark ? 'text-gray-400' : 'text-gray-800'}`}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-[#f5f7f9]'}`}>
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-xl sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Top NFTs
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Overview of the highest performing and most active non-fungible token
            collections within the Cyan Ledger ecosystem.
          </p>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Collections"
            value={stats.total}
            icon={Package}
            color="blue"
            isDark={isDark}
          />
          <StatsCard
            title="Total NFTs"
            value={stats.totalSupply}
            icon={Image}
            color="purple"
            isDark={isDark}
          />
          <StatsCard
            title="Total Minted"
            value={stats.totalMinted}
            icon={Image}
            color="green"
            isDark={isDark}
          />
          <StatsCard
            title="Total Burned"
            value={stats.totalBurned}
            icon={Flame}
            color="red"
            isDark={isDark}
          />
        </div> */}

        {/* Table */}
        <Table
          columns={columns}
          data={filteredCollections}
          isLoading={isLoading}
          error={error}
          // Search
          // searchable={true}
          // searchPlaceholder="Search collections..."
          // searchValue={searchQuery}
          // onSearch={setSearchQuery}
          // Toolbar
          // title="All Collections"
          // subtitle={`${filteredCollections.length} results`}
          toolbar={
            isFetching && (
              <div className="animate-spin h-3.5 w-3.5 border-2 border-[#00b2bd] border-t-transparent rounded-full" />
            )
          }
          // Pagination
          pagination={{
            page,
            totalPages,
            totalItems,
            onPageChange: setPage,
          }}
          // Row
          onRowClick={(row) => navigate(`/nft/collection/${row.contract_address}`)}
          rowKey="contract_address"
          // Per page
          // perPage={perPage}
          // perPageOptions={[10, 20, 50, 100]}
          // onPerPageChange={setPerPage}
          // Empty & Error
          emptyIcon={<Package className="w-10 h-10" />}
          emptyTitle="No Collections Found"
          emptyMessage="Try adjusting your search or check back later."
          // Styling
          compact={false}
          striped={true}
          hoverable={true}
          bordered={true}
          rounded={true}
        />
      </div>
    </div>
  );
};

export default NFTCollections;

// ═══════════════════════════════════════════
// Sub Components
// ═══════════════════════════════════════════

