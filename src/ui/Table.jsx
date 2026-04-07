// src/components/ui/Table.jsx
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  FileText,
  ArrowRight
} from 'lucide-react';


const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  error = null,
  // Pagination
  pagination = null,
  // Search
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch = null,
  searchValue = "",
  // Sorting
  sortable = false,
  sortField = null,
  sortDirection = "desc",
  onSort = null,
  // Toolbar
  title = null,
  subtitle = null,
  toolbar = null,
  // Row
  onRowClick = null,
  rowKey = "id",
  // Per page
  perPage = null,
  perPageOptions = [10, 25, 50, 100],
  onPerPageChange = null,
  // Empty & Error
  emptyIcon = null,
  emptyTitle = "No data found",
  emptyMessage = "Try adjusting your filters or check back later.",
  // Styling
  compact = false,
  striped = true, // Default to true for striping
  hoverable = true,
  bordered = true,
  rounded = true,
  className = "",
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch?.(localSearch);
  };

  const handleSort = (field) => {
    if (!sortable || !onSort) return;
    onSort(field);
  };

  if (isLoading) {
    return <TableSkeleton isDark={isDark} columns={columns.length} rows={10} rounded={rounded} />;
  }

  if (error) {
    return <TableError isDark={isDark} error={error} rounded={rounded} />;
  }

  return (
    <div
      className={`
        overflow-hidden
        ${rounded ? 'rounded-lg' : ''}
        ${bordered ? (isDark ? 'border border-[#f8f9f9]' : 'border border-[#f8f9f9]') : ''}
        ${isDark ? 'bg-gray-900' : 'bg-white'}
        ${className}
      `}
    >
      {/* Toolbar */}
      {(title || searchable || toolbar || perPage !== null) && (
        <div
          className={`
             gap-3
            px-4 sm:px-5 py-3.5 border-b-2
            ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}
          `}
        >
          {/* Left side */}
          <div className="  gap-2.5 flex-shrink-0">
            {title && (
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </span>
            )}
            {subtitle && (
              <span
                className={`
                  text-[10px] px-2 py-0.5 rounded-full font-bold
                  ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}
                `}
              >
                {subtitle}
              </span>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {toolbar}


            {searchable && (
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={onSearch ? searchValue : localSearch}
                  onChange={(e) => {
                    if (onSearch) {
                      onSearch(e.target.value);
                    } else {
                      setLocalSearch(e.target.value);
                    }
                  }}
                  className={`
        w-48 sm:w-56 pl-8 pr-3 py-1.5 rounded-lg border-2 text-xs font-medium
        focus:outline-none focus:ring-2 focus:ring-gray-500/30
        transition-all
        ${isDark
                      ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500 focus:border-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                    }
      `}
                />
              </div>
            )}

            {perPage !== null && onPerPageChange && (
              <select
                value={perPage}
                onChange={(e) => onPerPageChange(Number(e.target.value))}
                className={`
                  rounded-lg px-3 py-1.5 text-xs font-medium border-2 
                  focus:outline-none focus:ring-2 focus:ring-gray-500/30
                  ${isDark
                    ? 'bg-gray-900 border-gray-600 text-gray-300'
                    : 'bg-white border-gray-300 text-gray-600'
                  }
                `}
              >
                {perPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} rows
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`
                ${isDark
                  ? 'bg-gray-700 border border-gray-700'
                  : 'bg-gray-50 border  border-gray-100'
                }
              `}>
                {columns.map((col, i) => (
                  <th
                    key={col.key || i}
                    onClick={() => col.sortable !== false && sortable && handleSort(col.key)}
                    className={`
                      px-4 py-3 text-[11px] uppercase  font-[##3c494a] font-semibold whitespace-nowrap
                      ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-center' : 'text-center'}
                      ${isDark ? 'text-gray-400' : 'text-gray-600'}
                      ${sortable && col.sortable !== false ? 'cursor-pointer select-none hover:text-gray-900 dark:hover:text-white transition-colors' : ''}
                      ${col.width ? col.width : ''}
                    `}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {sortable && col.sortable !== false && (
                        <SortIcon
                          field={col.key}
                          sortField={sortField}
                          sortDirection={sortDirection}
                          isDark={isDark}
                        />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={row[rowKey] || rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    transition-all duration-200
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${striped
                      ? rowIndex % 2 === 0
                        ? isDark
                          ? 'bg-gray-900'
                          : 'bg-white'
                        : isDark
                          ? 'bg-gray-800/50'
                          : 'bg-gray-50'
                      : isDark
                        ? 'bg-gray-900'
                        : 'bg-white'
                    }
                    ${hoverable
                      ? isDark
                        ? 'hover:bg-gray-700/50'
                        : 'hover:bg-gray-100'
                      : ''
                    }
                    ${rowIndex !== data.length - 1
                      ? isDark
                        ? 'border-b border-gray-200'
                        : 'border-b border-gray-100'
                      : ''
                    }
                    group
                  `}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key || colIndex}
                      className={`
                        ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                        ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-center' : 'text-center'}
                        ${col.className || ''}
                      `}
                    >
                      {col.render
                        ? col.render(row[col.key], row, rowIndex)
                        : <span className={`text-[12px] font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {row[col.key]}
                        </span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <TableEmpty
          isDark={isDark}
          icon={emptyIcon}
          title={emptyTitle}
          message={emptyMessage}
        />
      )}

      {/* Pagination */}
      {pagination && data.length > 0 && (
        <div
          className={`
            flex items-center justify-between px-4 sm:px-5 py-3 border-t-2
            ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}
          `}
        >
          <span className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {pagination.totalItems
              ? `Showing ${data.length} of ${pagination.totalItems}`
              : `Page ${pagination.page}`
            }
          </span>
          <div className="flex items-center gap-1">
            <PaginationBtn
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
              isDark={isDark}
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </PaginationBtn>
            <PaginationBtn
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              isDark={isDark}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </PaginationBtn>
            <span
              className={`
                px-3 py-1 rounded-md text-xs font-black
                ${isDark
                  ? 'bg-gray-700 text-white border-2 border-gray-600'
                  : 'bg-gray-900 text-white border-2 border-gray-800'
                }
              `}
            >
              {pagination.page}
            </span>
            <PaginationBtn
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              isDark={isDark}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </PaginationBtn>
            <PaginationBtn
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.page >= pagination.totalPages}
              isDark={isDark}
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </PaginationBtn>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;

const SortIcon = ({ field, sortField, sortDirection, isDark }) => {
  if (sortField !== field) {
    return <ArrowUpDown className="w-3 h-3 opacity-30" />;
  }
  return sortDirection === 'asc' ? (
    <ChevronUp className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-700'}`} />
  ) : (
    <ChevronDown className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-700'}`} />
  );
};

const PaginationBtn = ({ onClick, disabled, isDark, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      p-1.5 rounded-md border-2 text-xs transition-all font-bold
      disabled:opacity-30 disabled:cursor-not-allowed
      ${isDark
        ? 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white hover:border-gray-600'
        : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400'
      }
    `}
  >
    {children}
  </button>
);

const TableSkeleton = ({ isDark, columns = 5, rows = 10, rounded = true }) => (
  <div
    className={`
      overflow-hidden
      ${rounded ? 'rounded-xl' : ''}
      ${isDark ? 'bg-gray-900 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'}
    `}
  >
    {/* Toolbar skeleton */}
    <div className={`
      flex items-center justify-between px-5 py-3.5 border-b-2 
      ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}
    `}>
      <div className={`h-4 w-32 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
      <div className={`h-7 w-48 rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
    </div>

    {/* Header skeleton */}
    <div className={`
      px-5 py-3 
      ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
    `}>
      <div className={`h-4 w-full rounded animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
    </div>

    {/* Rows skeleton with stripes */}
    {[...Array(rows)].map((_, i) => (
      <div
        key={i}
        className={`
          px-5 py-3.5
          ${i % 2 === 0
            ? isDark ? 'bg-gray-900' : 'bg-white'
            : isDark ? 'bg-gray-800/50' : 'bg-gray-50'
          }
          ${i < rows - 1
            ? (isDark ? 'border-b border-gray-800' : 'border-b border-gray-200')
            : ''
          }
        `}
      >
        <div className="flex items-center gap-4 animate-pulse">
          {[...Array(columns)].map((_, j) => (
            <div
              key={j}
              className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
              style={{ width: `${60 + Math.random() * 80}px` }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const TableError = ({ isDark, error, rounded = true }) => (
  <div
    className={`
      p-12 text-center
      ${rounded ? 'rounded-xl' : ''}
      ${isDark ? 'bg-gray-900 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'}
    `}
  >
    <div
      className={`
        w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4
        ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
      `}
    >
      <svg className={`w-7 h-7 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <h3 className={`text-base font-black mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      Failed to Load Data
    </h3>
    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
      {error?.message || 'Something went wrong.'}
    </p>
  </div>
);

const TableEmpty = ({ isDark, icon, title, message }) => (
  <div className="px-5 py-16 text-center">
    {icon ? (
      <div className={`w-10 h-10 mx-auto mb-3 opacity-30 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {icon}
      </div>
    ) : (
      <svg
        className={`w-10 h-10 mx-auto mb-3 opacity-30 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    )}
    <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {title}
    </h3>
    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
      {message}
    </p>
  </div>
);


export const CopyButton = ({ text }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`
        p-0.5 rounded transition-colors
        ${isDark ? 'hover:bg-gray-600 text-gray-600 hover:text-gray-400' : 'hover:bg-gray-200 text-gray-300 hover:text-gray-500'}
      `}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </button>
  );
};

export const Badge = ({ children, color = 'gray', className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Named color map
  const colorMap = {
    gray: isDark ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : 'bg-gray-50 text-gray-600 border-gray-200',
    blue: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
    green: isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-200',
    red: isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200',
    yellow: isDark ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200',
    cyan: isDark ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border-cyan-200',
    orange: isDark ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-200',
    pink: isDark ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-pink-50 text-pink-600 border-pink-200',
    teal: isDark ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-teal-50 text-teal-600 border-teal-200',
    primary: isDark ? 'bg-[#f0fdfa] text-[#00b2bd] border-[#00b2bd]' : 'bg-[#f0fdfa] text-[#00b2bd] border-[#00b2bd]/20',
  };

  // Check if color is a hex code
  const isHexColor = color?.startsWith('#');

  // If hex color, use inline styles
  if (isHexColor) {
    return (
      <span
        className={`inline-block px-2 py-[3px] rounded-lg text-[10px] font-semibold border ${className}`}
        style={{
          backgroundColor: '#f0fdfa',
          color: color,
          borderColor: `#96f7e4`,
        }}
      >
        {children}
      </span>
    );
  }

  // Otherwise use color map
  return (
    <span
      className={`
        inline-block px-2 py-[3px] rounded text-[10px] font-semibold border
        ${colorMap[color] || colorMap.gray}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export const StatusDot = ({ success }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <span
      className={`
        flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center
        ${success
          ? isDark ? 'bg-green-500/15 text-green-400' : 'bg-green-50 text-green-500'
          : isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-50 text-red-500'
        }
      `}
    >
      {success ? (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </span>
  );
};

export const AddressLink = ({ address, truncateStart = 8, truncateEnd = 5, showCopy = true }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const truncated = address && address.length > truncateStart + truncateEnd
    ? `${address.slice(0, truncateStart)}...${address.slice(-truncateEnd)}`
    : address;

  return (
    <div className="relative group/addr flex items-center gap-1">
      <a
        href={`/address/${address}`}
        onClick={(e) => e.stopPropagation()}
        className=" text-[12px] text-[#006666] font-semibold "
      >
        {truncated}
      </a>
      {showCopy && <CopyButton text={address} />}
      {/* Tooltip */}
      <div
        className={`
          absolute bottom-full left-0 mb-2 px-3 py-2 rounded-lg text-[11px] font-mono
          opacity-0 invisible group-hover/addr:opacity-100 group-hover/addr:visible
          transition-all duration-200 z-50 whitespace-nowrap shadow-lg pointer-events-none
          ${isDark ? 'bg-gray-900 border border-gray-700 text-gray-300' : 'bg-white border border-gray-200 text-gray-700'}
        `}
      >
        {address}
        <div
          className={`
            absolute top-full left-6 w-2 h-2 rotate-45 -mt-1
            ${isDark ? 'bg-gray-900 border-r border-b border-gray-700' : 'bg-white border-r border-b border-gray-200'}
          `}
        />
      </div>
    </div>
  );
};

export const HashLink = ({ hash, to, truncateStart = 10, truncateEnd = 6, showCopy = true, showStatus = false, success = true }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const truncated = hash && hash.length > truncateStart + truncateEnd
    ? `${hash.slice(0, truncateStart)}...${hash.slice(-truncateEnd)}`
    : hash;

  return (
    <div className="flex items-center gap-2">
      {showStatus && <FileText  success={success}  size={14} color='#006666'/>}
      <a
        href={to || `/transactions/${hash}`}
        onClick={(e) => e.stopPropagation()}
        className=" text-[12px] text-[#006666] font-medium "
        title={hash}
      >
        {truncated}
      </a>
      {showCopy && <CopyButton text={hash} />}
    </div>
  );
};

export const ValueBox = ({ value, symbol = 'JMC', size = 'md' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
    lg: 'px-3 py-1.5 text-[12px]',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-lg border font-semibold
        ${sizeClasses[size] || sizeClasses.md}
        ${isDark ? 'bg-gray-900/60 border-gray-700 text-gray-200' : 'bg-[#f0fdfa] border-[#96f7e4] text-gray-800'}
      `}
    >
      {value}
      <span className={`text-[9px] font-semibold head ${isDark ? 'text-gray-500' : 'text-gray-800'}`}>
        {symbol}
      </span>
    </span>
  );
};

export const TimeAgo = ({ timestamp, showIcon = true }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getTimeAgo = (ts) => {
    const now = new Date();
    const then = new Date(ts);
    const seconds = Math.floor((now - then) / 1000);
    if (seconds < 60) return `${seconds} secs ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hrs ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <span
      className={`flex items-center gap-1 text-[12px] font-semibold ${isDark ? 'text-gray-400' : 'text-gray-700'}`}
      title={new Date(timestamp).toLocaleString()}
    >
      {showIcon && (
        <svg className="w-3 h-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {getTimeAgo(timestamp)}
    </span>
  );
};

export const DirectionArrow = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <span
      className={`
        inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold
        ${isDark
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
        }
      `}
    >
      <ArrowRight  className="w-3 h-3" />
    </span>
  );
};