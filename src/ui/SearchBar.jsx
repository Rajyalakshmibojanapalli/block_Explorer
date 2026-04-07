// components/ui/SearchBar/SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Loader2, 
  History, 
  TrendingUp,
  Command,
  ArrowRight,
  Filter,
  SlidersHorizontal
} from 'lucide-react';
import { useClickOutside } from '../hooks/useClickOutside';

const SearchBar = ({
  // Basic props
  value = '',
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search...',
  
  // Theme
  isDark = false,
  
  // Variants
  variant = 'default', // 'default', 'filled', 'outlined', 'ghost'
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  
  // Features
  showClearButton = true,
  showSearchButton = false,
  showShortcut = false,
  shortcutKey = '⌘K',
  
  // Loading & States
  isLoading = false,
  disabled = false,
  autoFocus = false,
  
  // Suggestions & Recent
  suggestions = [],
  recentSearches = [],
  showSuggestions = false,
  onSuggestionClick,
  onRecentSearchClick,
  
  // Advanced filters
  showFilters = false,
  filters = [],
  activeFilters = [],
  onFilterChange,
  
  // Customization
  className = '',
  icon: CustomIcon,
  containerClassName = '',
  
  // Callbacks
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useClickOutside(containerRef, () => {
    setShowDropdown(false);
    setSelectedIndex(-1);
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    if (showShortcut) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showShortcut]);

  // Combined suggestions list
  const allSuggestions = [
    ...(recentSearches.map(s => ({ type: 'recent', text: s })) || []),
    ...(suggestions.map(s => ({ type: 'suggestion', text: s })) || []),
  ];

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionSelect(allSuggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && value.trim()) {
      onSubmit(value);
      setShowDropdown(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) onChange('');
    if (onClear) onClear();
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onChange) onChange(newValue);
    if (showSuggestions && newValue) {
      setShowDropdown(true);
    } else if (!newValue) {
      setShowDropdown(false);
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (showSuggestions && (recentSearches.length > 0 || suggestions.length > 0)) {
      setShowDropdown(true);
    }
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleSuggestionSelect = (suggestion) => {
    if (onChange) onChange(suggestion.text);
    
    if (suggestion.type === 'recent' && onRecentSearchClick) {
      onRecentSearchClick(suggestion.text);
    } else if (suggestion.type === 'suggestion' && onSuggestionClick) {
      onSuggestionClick(suggestion.text);
    }
    
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'h-8',
      input: 'text-xs px-3',
      icon: 'w-3.5 h-3.5',
      button: 'w-6 h-6',
      buttonIcon: 'w-3 h-3',
      shortcut: 'text-[10px] px-1.5 py-0.5',
      gap: 'gap-2',
    },
    md: {
      container: 'h-10',
      input: 'text-sm px-4',
      icon: 'w-4 h-4',
      button: 'w-7 h-7',
      buttonIcon: 'w-3.5 h-3.5',
      shortcut: 'text-xs px-2 py-0.5',
      gap: 'gap-2.5',
    },
    lg: {
      container: 'h-12',
      input: 'text-base px-5',
      icon: 'w-5 h-5',
      button: 'w-8 h-8',
      buttonIcon: 'w-4 h-4',
      shortcut: 'text-sm px-2.5 py-1',
      gap: 'gap-3',
    },
    xl: {
      container: 'h-14',
      input: 'text-lg px-6',
      icon: 'w-6 h-6',
      button: 'w-9 h-9',
      buttonIcon: 'w-4.5 h-4.5',
      shortcut: 'text-base px-3 py-1',
      gap: 'gap-3',
    },
  };

  // Variant styles
  const variantStyles = {
    default: isDark
      ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 hover:bg-gray-800 hover:border-gray-600'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 hover:border-gray-300',
    filled: isDark
      ? 'bg-gray-800 border-transparent text-white placeholder-gray-500 hover:bg-gray-750'
      : 'bg-gray-100 border-transparent text-gray-900 placeholder-gray-500 hover:bg-gray-200',
    outlined: isDark
      ? 'bg-transparent border-gray-600 text-white placeholder-gray-500 hover:border-gray-500'
      : 'bg-transparent border-gray-300 text-gray-900 placeholder-gray-400 hover:border-gray-400',
    ghost: isDark
      ? 'bg-transparent border-transparent text-white placeholder-gray-500 hover:bg-gray-800/30'
      : 'bg-transparent border-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-100',
  };

  const focusStyles = isDark
    ? 'focus-within:bg-gray-800 focus-within:border-[#00b2bd] focus-within:ring-4 focus-within:ring-[#00b2bd]/10'
    : 'focus-within:bg-white focus-within:border-[#00b2bd] focus-within:ring-4 focus-within:ring-[#00b2bd]/10';

  const config = sizeConfig[size];
  const IconComponent = CustomIcon || Search;

  return (
    <div ref={containerRef} className={`relative ${containerClassName}`}>
      {/* Main Search Container */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            relative flex items-center ${config.gap}
            ${config.container}
            rounded-xl border transition-all duration-200
            ${variantStyles[variant]}
            ${focusStyles}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
        >
          {/* Search Icon */}
          <div className="flex-shrink-0 pl-3.5">
            {isLoading ? (
              <Loader2 className={`${config.icon} animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            ) : (
              <IconComponent className={`${config.icon} ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            className={`
              flex-1 bg-transparent border-none outline-none
              ${config.input}
              disabled:cursor-not-allowed
              ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
            `}
          />

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 pr-2">
            {/* Keyboard Shortcut */}
            {showShortcut && !value && !isFocused && (
              <kbd
                className={`
                  hidden sm:flex items-center ${config.shortcut}
                  font-mono font-medium rounded border
                  ${isDark
                    ? 'bg-gray-700/50 text-gray-400 border-gray-600'
                    : 'bg-gray-100 text-gray-500 border-gray-300'
                  }
                `}
              >
                {shortcutKey}
              </kbd>
            )}

            {/* Filter Button */}
            {showFilters && filters.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Toggle filters dropdown
                }}
                className={`
                  ${config.button} rounded-lg flex items-center justify-center
                  transition-colors relative
                  ${isDark
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <SlidersHorizontal className={config.buttonIcon} />
                {activeFilters?.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00b2bd] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            )}

            {/* Clear Button */}
            {showClearButton && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className={`
                  ${config.button} rounded-lg flex items-center justify-center
                  transition-colors
                  ${isDark
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }
                `}
                aria-label="Clear search"
              >
                <X className={config.buttonIcon} />
              </button>
            )}

            {/* Search Button */}
            {showSearchButton && (
              <button
                type="submit"
                disabled={disabled || !value}
                className={`
                  ${config.button} rounded-lg flex items-center justify-center
                  transition-all font-medium
                  ${value
                    ? 'bg-[#00b2bd] text-white hover:bg-[#009aa3] shadow-lg shadow-[#00b2bd]/20'
                    : isDark
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
                aria-label="Search"
              >
                <ArrowRight className={config.buttonIcon} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && showSuggestions && allSuggestions.length > 0 && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-2 
            rounded-xl border shadow-2xl overflow-hidden z-50
            animate-in fade-in slide-in-from-top-2 duration-200
            ${isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
            }
          `}
        >
          <div className="max-h-80 overflow-y-auto">
            {/* Recent Searches Section */}
            {recentSearches.length > 0 && (
              <div className={`p-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className={`px-3 py-2 text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Recent Searches
                </div>
                {allSuggestions
                  .filter(s => s.type === 'recent')
                  .map((suggestion, index) => (
                    <SuggestionItem
                      key={`recent-${index}`}
                      suggestion={suggestion}
                      index={allSuggestions.findIndex(s => s === suggestion)}
                      selectedIndex={selectedIndex}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      isDark={isDark}
                      icon={History}
                    />
                  ))}
              </div>
            )}

            {/* Suggestions Section */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className={`px-3 py-2 text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Suggestions
                </div>
                {allSuggestions
                  .filter(s => s.type === 'suggestion')
                  .map((suggestion, index) => (
                    <SuggestionItem
                      key={`suggestion-${index}`}
                      suggestion={suggestion}
                      index={allSuggestions.findIndex(s => s === suggestion)}
                      selectedIndex={selectedIndex}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      isDark={isDark}
                      icon={TrendingUp}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Suggestion Item Component
const SuggestionItem = ({ suggestion, index, selectedIndex, onClick, isDark, icon: Icon }) => {
  const isSelected = index === selectedIndex;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
        text-sm text-left transition-all
        ${isSelected
          ? isDark
            ? 'bg-[#00b2bd]/10 text-[#00b2bd]'
            : 'bg-[#00b2bd]/5 text-[#00b2bd]'
          : isDark
          ? 'text-gray-300 hover:bg-gray-700/50'
          : 'text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
      <span className="flex-1 truncate">{suggestion.text}</span>
      {isSelected && (
        <kbd className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          ↵
        </kbd>
      )}
    </button>
  );
};

export default SearchBar;