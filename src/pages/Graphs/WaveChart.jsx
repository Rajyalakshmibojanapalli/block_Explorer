// src/components/charts/WaveChart.jsx
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  defs,
} from "recharts";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";

const WaveChart = ({
  data = [],
  dataKey = "value",
  xAxisKey = "date",
  height = 400,
  gradientFrom = "#3b82f6",
  gradientTo = "#93c5fd",
  strokeColor = "#2563eb",
  strokeWidth = 3,
  fillOpacity = 0.8,
  showGrid = true,
  showDots = false,
  animationDuration = 1500,
  formatXAxis = (value) => {
    try {
      return format(parseISO(value), "MMM dd");
    } catch {
      return value;
    }
  },
  formatYAxis = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value;
  },
  formatTooltip = (value) => value.toLocaleString(),
  tooltipLabel = "Value",
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload[0]) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4"
      >
        <p className="text-xs font-medium text-gray-500 mb-2">
          {formatXAxis(label)}
        </p>
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: strokeColor }}
          />
          <div>
            <p className="text-xs text-gray-600">{tooltipLabel}</p>
            <p className="text-lg font-bold text-gray-900">
              {formatTooltip(payload[0].value)}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="white"
          stroke={strokeColor}
          strokeWidth={2}
          className="hover:r-6 transition-all"
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientFrom} stopOpacity={fillOpacity} />
            <stop offset="95%" stopColor={gradientTo} stopOpacity={0.1} />
          </linearGradient>
        </defs>

        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />
        )}

        <XAxis
          dataKey={xAxisKey}
          tickFormatter={formatXAxis}
          stroke="#9ca3af"
          style={{ fontSize: "12px" }}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          tickFormatter={formatYAxis}
          stroke="#9ca3af"
          style={{ fontSize: "12px" }}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: "5 5" }}
        />

        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="url(#colorGradient)"
          animationDuration={animationDuration}
          dot={showDots ? <CustomDot /> : false}
          activeDot={{
            r: 6,
            fill: strokeColor,
            stroke: "white",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default WaveChart;