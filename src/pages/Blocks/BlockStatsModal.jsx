// src/components/blocks/BlockStatsModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  useGetDailyBlocksQuery,
  useGetAvgBlockTimeQuery,
  useGetDailyTransactionsQuery,
  useGetDailyGasQuery,
} from '../Graphs/graphsApiSlice';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';

const BlockStatsModal = ({ isOpen, onClose, statType, title, isDark }) => {
  const [days, setDays] = useState(365);

  // Conditional API calls based on stat type
  const { data: blocksData, isLoading: blocksLoading } = useGetDailyBlocksQuery(days, {
    skip: statType !== 'latest-block',
  });

  const { data: blockTimeData, isLoading: blockTimeLoading } = useGetAvgBlockTimeQuery(days, {
    skip: statType !== 'avg-block-time',
  });

  const { data: txData, isLoading: txLoading } = useGetDailyTransactionsQuery(days, {
    skip: statType !== 'total-validators', // Using this for transactions
  });

  const { data: gasData, isLoading: gasLoading } = useGetDailyGasQuery(days, {
    skip: statType !== 'avg-gas',
  });

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const timeRanges = [
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 },
    { label: '180D', value: 180 },
    { label: '1Y', value: 365 },
  ];

  const renderChart = () => {
    switch (statType) {
      case 'latest-block':
        return <LatestBlockChart data={blocksData} isLoading={blocksLoading} isDark={isDark} />;
      case 'avg-block-time':
        return <AvgBlockTimeChart data={blockTimeData} isLoading={blockTimeLoading} isDark={isDark} />;
      case 'total-validators':
        return <TotalTransactionsChart data={txData} isLoading={txLoading} isDark={isDark} />;
      case 'avg-gas':
        return <AvgGasChart data={gasData} isLoading={gasLoading} isDark={isDark} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 flex items-center justify-center">
          <div
            className={`relative w-full max-w-5xl rounded-2xl shadow-2xl animate-slideUp ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between p-6 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {title}
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Historical data for the last {days} days
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Time Range Selector */}
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex gap-2">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setDays(range.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      days === range.value
                        ? 'bg-[#00b2bd] text-white shadow-lg shadow-[#00b2bd]/30'
                        : isDark
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Content */}
            <div className="p-6">
              <div className="h-[450px]">{renderChart()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockStatsModal;

// ═══════════════════════════════════════════════════════════
// CHART COMPONENTS
// ═══════════════════════════════════════════════════════════

// Latest Block Chart
const LatestBlockChart = ({ data, isLoading, isDark }) => {
  if (isLoading) {
    return <ChartSkeleton isDark={isDark} />;
  }

  if (!data || !data.points || data.points.length === 0) {
    return <EmptyChart isDark={isDark} message="No block data available" />;
  }

  const chartData = data.points.map((point) => ({
    date: point.date,
    count: point.count,
  }));

  const formatXAxis = (value) => {
    try {
      return format(parseISO(value), 'MMM dd');
    } catch {
      return value;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload[0]) return null;

    return (
      <div
        className={`px-4 py-3 rounded-lg border shadow-lg ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatXAxis(label)}
        </p>
        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {payload[0].value.toLocaleString()} blocks
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorBlocks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          stroke={isDark ? '#9ca3af' : '#6b7280'}
          style={{ fontSize: '12px' }}
        />
        <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#colorBlocks)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Average Block Time Chart
const AvgBlockTimeChart = ({ data, isLoading, isDark }) => {
  if (isLoading) {
    return <ChartSkeleton isDark={isDark} />;
  }

  if (!data || !data.points || data.points.length === 0) {
    return <EmptyChart isDark={isDark} message="No block time data available" />;
  }

  const chartData = data.points.map((point) => ({
    date: point.date,
    avgBlockTime: parseFloat(point.avg_block_time_seconds || 0).toFixed(2),
    blockCount: point.block_count,
  }));

  const formatXAxis = (value) => {
    try {
      return format(parseISO(value), 'MMM dd');
    } catch {
      return value;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload[0]) return null;

    return (
      <div
        className={`px-4 py-3 rounded-lg border shadow-lg ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatXAxis(label)}
        </p>
        <div className="space-y-1">
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {payload[0].value}s
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {payload[0].payload.blockCount} blocks
          </p>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          stroke={isDark ? '#9ca3af' : '#6b7280'}
          style={{ fontSize: '12px' }}
        />
        <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} style={{ fontSize: '12px' }} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="avgBlockTime"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Total Transactions Chart - Combined Version
const TotalTransactionsChart = ({ data, isLoading, isDark }) => {
  if (isLoading) {
    return <ChartSkeleton isDark={isDark} />;
  }

  if (!data || !data.points || data.points.length === 0) {
    return <EmptyChart isDark={isDark} message="No transaction data available" />;
  }

  const chartData = data.points.map((point) => ({
    date: point.date,
    count: point.count || 0,
  }));

  const formatXAxis = (value) => {
    try {
      return format(parseISO(value), 'MMM dd');
    } catch {
      return value;
    }
  };

  const formatYAxis = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload[0]) return null;

    return (
      <div
        className={`px-4 py-3 rounded-lg border shadow-lg ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatXAxis(label)}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {payload[0].value.toLocaleString()}
          </p>
        </div>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          transactions
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={isDark ? '#374151' : '#e5e7eb'} 
          vertical={false}
          opacity={0.5}
        />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          stroke={isDark ? '#9ca3af' : '#6b7280'}
          style={{ fontSize: '12px' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          tickFormatter={formatYAxis}
          stroke={isDark ? '#9ca3af' : '#6b7280'} 
          style={{ fontSize: '12px' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }} />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#8b5cf6"
          strokeWidth={3}
          fill="url(#colorTransactions)"
          dot={false}
          activeDot={{ 
            r: 7, 
            fill: '#8b5cf6', 
            stroke: isDark ? '#1f2937' : '#ffffff', 
            strokeWidth: 3 
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Average Gas Chart
const AvgGasChart = ({ data, isLoading, isDark }) => {
  if (isLoading) {
    return <ChartSkeleton isDark={isDark} />;
  }

  if (!data || !data.points || data.points.length === 0) {
    return <EmptyChart isDark={isDark} message="No gas data available" />;
  }

  const chartData = data.points.map((point) => ({
    date: point.date,
    avgGas: Math.round(point.avg_gas_used || 0),
    totalGas: point.total_gas || 0,
    txCount: point.tx_count || 0,
  }));

  const formatXAxis = (value) => {
    try {
      return format(parseISO(value), 'MMM dd');
    } catch {
      return value;
    }
  };

  const formatYAxis = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload[0]) return null;

    return (
      <div
        className={`px-4 py-3 rounded-lg border shadow-lg ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatXAxis(label)}
        </p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Avg Gas: {payload[0].value.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Total Gas: {payload[0].payload.totalGas.toLocaleString()}
            </span>
          </div>
          <p className={`text-xs pt-1 border-t ${isDark ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
            {payload[0].payload.txCount} transactions
          </p>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          stroke={isDark ? '#9ca3af' : '#6b7280'}
          style={{ fontSize: '12px' }}
        />
        <YAxis
          tickFormatter={formatYAxis}
          stroke={isDark ? '#9ca3af' : '#6b7280'}
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="avgGas"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#colorGas)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// ═══════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════

const ChartSkeleton = ({ isDark }) => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00b2bd] border-t-transparent mx-auto mb-4" />
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading chart data...</p>
    </div>
  </div>
);

const EmptyChart = ({ isDark, message }) => (
  <div className="w-full h-full flex items-center justify-center">
    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{message}</p>
  </div>
);