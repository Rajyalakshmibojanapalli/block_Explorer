// src/components/transactions/StatCardModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  useGetDailyTransactionsQuery,
  useGetDailyTxStatusQuery,
  useGetDailyTransferVolumeQuery,
  useGetDailyGasQuery,
} from '../Graphs/graphsApiSlice';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';

const StatCardModal = ({ isOpen, onClose, statType, title, isDark }) => {
  const [days, setDays] = useState(365);

  // Conditional API calls based on stat type
  const { data: txData, isLoading: txLoading } = useGetDailyTransactionsQuery(days, {
    skip: statType !== 'transactions',
  });

  const { data: statusData, isLoading: statusLoading } = useGetDailyTxStatusQuery(days, {
    skip: statType !== 'success-rate',
  });

  const { data: volumeData, isLoading: volumeLoading } = useGetDailyTransferVolumeQuery(
    { days, denom: 'uJMC' },
    { skip: statType !== 'total-fees' }
  );

  const { data: gasData, isLoading: gasLoading } = useGetDailyGasQuery(days, {
    skip: statType !== 'gas-price',
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
    { label: '1Y', value: 365 },
  ];

  const renderChart = () => {
    switch (statType) {
      case 'transactions':
        return <TransactionsChart data={txData} isLoading={txLoading} isDark={isDark} />;
      case 'success-rate':
        return <SuccessRateChart data={statusData} isLoading={statusLoading} isDark={isDark} />;
      case 'total-fees':
        return <TotalFeesChart data={volumeData} isLoading={volumeLoading} isDark={isDark} />;
      case 'gas-price':
        return <GasPriceChart data={gasData} isLoading={gasLoading} isDark={isDark} />;
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
            <div className="p-6 border-b border-gray-700">
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
              <div className="h-[400px]">{renderChart()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatCardModal;

// ═══════════════════════════════════════════════════════════
// CHART COMPONENTS
// ═══════════════════════════════════════════════════════════

const TransactionsChart = ({ data, isLoading, isDark }) => {
  if (isLoading) {
    return <ChartSkeleton isDark={isDark} />;
  }

  if (!data || !data.points || data.points.length === 0) {
    return <EmptyChart isDark={isDark} message="No transaction data available" />;
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
          {payload[0].value.toLocaleString()} transactions
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00b2bd" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#00b2bd" stopOpacity={0.1} />
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
          stroke="#00b2bd"
          strokeWidth={2}
          fill="url(#colorCount)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Success Rate Chart - Success Only (Area Chart)
const SuccessRateChart = ({ data, isLoading, isDark }) => {
  if (isLoading) {
    return <ChartSkeleton isDark={isDark} />;
  }

  if (!data || !data.points || data.points.length === 0) {
    return <EmptyChart isDark={isDark} message="No success rate data available" />;
  }

  const chartData = data.points.map((point) => {
    const success = point.success || 0;
    const failed = point.failed || 0;
    const total = success + failed;
    const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : 0;
    
    return {
      date: point.date,
      success,
      failed,
      total,
      successRate: parseFloat(successRate),
    };
  });

  const formatXAxis = (value) => {
    try {
      return format(parseISO(value), 'MMM dd');
    } catch {
      return value;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;

    return (
      <div
        className={`px-4 py-3 rounded-lg border shadow-lg ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatXAxis(label)}
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data.success}
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              successful transactions
            </span>
          </div>
          {data.failed > 0 && (
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              ({data.failed} failed)
            </p>
          )}
          <div className={`pt-2 mt-2 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <span className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              Success Rate: {data.successRate}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={isDark ? '#374151' : '#e5e7eb'} 
          vertical={false} 
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
          stroke={isDark ? '#9ca3af' : '#6b7280'} 
          style={{ fontSize: '12px' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="success"
          name="Successful Transactions"
          stroke="#10b981"
          strokeWidth={3}
          fill="url(#colorSuccess)"
          dot={false}
          activeDot={{ 
            r: 6, 
            fill: '#10b981', 
            stroke: isDark ? '#1f2937' : '#ffffff', 
            strokeWidth: 2 
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const TotalFeesChart = ({ data, isLoading, isDark }) => {
  if (isLoading) {
    return <ChartSkeleton isDark={isDark} />;
  }

  if (!data || !data.points || data.points.length === 0) {
    return <EmptyChart isDark={isDark} message="No fee data available" />;
  }

  const chartData = data.points.map((point) => ({
    date: point.date,
    volume: (point.volume || 0) / 1000000, // Convert to JMC
    count: point.count || 0,
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
          {payload[0].value.toFixed(2)} JMC
        </p>
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {payload[0].payload.count} transfers
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
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
          dataKey="volume"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#colorVolume)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const GasPriceChart = ({ data, isLoading, isDark }) => {
  if (isLoading) {
    return <ChartSkeleton isDark={isDark} />;
  }

  if (!data || !data.points || data.points.length === 0) {
    return <EmptyChart isDark={isDark} message="No gas data available" />;
  }

  const chartData = data.points.map((point) => ({
    date: point.date,
    avgGas: point.avg_gas_used || 0,
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
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Avg Gas: {payload[0].value.toLocaleString()}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Total Gas: {payload[0].payload.totalGas.toLocaleString()}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Transactions: {payload[0].payload.txCount.toLocaleString()}
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
          dataKey="avgGas"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
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