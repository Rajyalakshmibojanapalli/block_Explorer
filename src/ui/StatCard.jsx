// components/ui/StatCard.jsx - Option 2
import React from 'react';

const AccentIcon = ({ icon: Icon, accentColor }) => {
  const accentMap = {
    teal:   { bg: 'bg-teal-500',   text: 'text-[#00b2bd]' },
    green:  { bg: 'bg-emerald-500', text: 'text-emerald-500' },
    red:    { bg: 'bg-red-500',    text: 'text-red-500' },
    blue:   { bg: 'bg-blue-500',   text: 'text-blue-500' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-500' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-500' },
    gray:   { bg: 'bg-gray-500',   text: 'text-gray-500' },
  };

  const { bg, text } = accentMap[accentColor] || accentMap.teal;

  if (!Icon) return null;

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-5 h-5 ${text}`} strokeWidth={2} />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  accentColor = 'teal',
  watermarkColor,
  subtitle,
  isDark = false,
  loading = false,
  className = '',
}) => {
  // Watermark color derived from accentColor if not overridden
  const watermarkMap = {
    teal:   isDark ? 'text-gray-400/[0.08]'    : 'text-gray-400/[0.07]',
    green:  isDark ? 'text-emerald-400/[0.08]' : 'text-emerald-500/[0.07]',
    red:    isDark ? 'text-red-400/[0.08]'     : 'text-red-500/[0.07]',
    blue:   isDark ? 'text-blue-400/[0.08]'    : 'text-blue-500/[0.07]',
    orange: isDark ? 'text-orange-400/[0.08]'  : 'text-orange-500/[0.07]',
    purple: isDark ? 'text-purple-400/[0.08]'  : 'text-purple-500/[0.07]',
    gray:   isDark ? 'text-gray-400/[0.08]'    : 'text-gray-400/[0.07]',
  };

  const wColor = watermarkColor || watermarkMap[accentColor] || watermarkMap.teal;

  if (loading) {
    return (
      <div
        className={`
          rounded-2xl border p-5 animate-pulse shadow-sm
          ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          ${className}
        `}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`h-3 w-28 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
        <div className={`h-9 w-16 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        <div className={`h-3 w-20 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
      </div>
    );
  }

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border p-2
        transition-all duration-200
        shadow-sm hover:shadow-md hover:-translate-y-[1px]
        ${isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
        }
        ${className}
      `}
    >
      {/* Watermark icon — large, bottom-right */}
      {Icon && (
        <Icon
          className={`
            absolute -right-10 -bottom-9 w-32 h-32 pointer-events-none
            ${wColor}
          `}
          strokeWidth={2}
        />
      )}

      {/* Top row: title + accent badge */}
      <div className="relative flex items-start justify-between gap-2 mb-6">
        <p className={`text-xs font-medium leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {title}
        </p>
        <AccentIcon icon={Icon} accentColor={accentColor} />
      </div>

      {/* Value */}
      <div className="relative">
        <p className={`text-[2rem] font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </p>

        {subtitle && (
          <p className={`text-[11px] mt-1.5 font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;