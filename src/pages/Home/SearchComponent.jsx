// src/components/SearchBar/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLazySearchQuery } from './homeApiSlice';

const SearchBar = ({ isDark }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [triggerSearch, { isLoading: isSearching }] = useLazySearchQuery();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 2) {
        try {
          const result = await triggerSearch({ 
            q: searchQuery, 
            limit: 8 
          }).unwrap();
          
          if (result?.results) {
            setSuggestions(result.results);
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error("Failed to fetch suggestions:", err);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, triggerSearch]);

  const navigateToResult = (result, type) => {
    if (type.is_a_user_address || type.is_a_contract_address) {
      navigate(`/address/${result.value}`);
    } else if (type.is_a_transaction_hash) {
      navigate(`/transactions/${result.value}`);
    } else if (type.is_a_block_number) {
      navigate(`/blocks/${result.value}`);
    } else {
      navigate(`/address/${result.value}`);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const result = await triggerSearch({ q: searchQuery, limit: 1 }).unwrap();

        if (result?.results && result.results.length > 0) {
          navigateToResult(result.results[0], result.type);
        } else {
          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
        setSearchQuery("");
        setShowSuggestions(false);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const mockType = {
      is_a_user_address: suggestion.type === 'address',
      is_a_contract_address: suggestion.type === 'contract',
      is_a_transaction_hash: false,
      is_a_block_number: false
    };
    
    setShowSuggestions(false);
    setSearchQuery("");
    navigateToResult(suggestion, mockType);
  };

  const formatValue = (value) => {
    if (value.length > 55) {
      return `${value.substring(0, 28)}...${value.substring(value.length - 22)}`;
    }
    return value;
  };

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0 && searchQuery.trim().length > 2) {
              setShowSuggestions(true);
            }
          }}
          placeholder="Search by Address / Txn Hash / Block / Token / Domain Name"
          disabled={isSearching}
          className={`w-full pl-5 pr-16 py-3 text-sm rounded-full shadow-[0_2px_8px_rgba(0,178,189,0.1)] transition-all focus:outline-none focus:ring-2 focus:ring-[#00b2bd]/20 focus:shadow-[0_4px_12px_rgba(0,178,189,0.15)] disabled:opacity-60 ${
            isDark 
              ? 'bg-gray-800 text-white border border-gray-700 placeholder-gray-500' 
              : 'bg-white text-black placeholder-gray-500'
          }`}
        />
        
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setShowSuggestions(false);
            }}
            className={`absolute right-12 transition-colors ${
              isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}

        <button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="absolute right-1.5 w-9 h-9 flex items-center justify-center bg-[#00b2bd] text-white rounded-full transition-all hover:bg-[#009da7] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Search"
        >
          <Search size={15} className={isSearching ? "animate-spin" : ""} />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className={`absolute w-full mt-2 rounded-lg overflow-hidden z-50 ${
            isDark 
              ? 'bg-gray-800 border border-gray-700 shadow-xl' 
              : 'bg-white border border-gray-200 shadow-xl'
          }`}
        >
          <div className="max-h-[350px] overflow-y-auto scrollbar">
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.type}-${suggestion.value}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`px-4 py-2.5 cursor-pointer border-b last:border-b-0 transition-colors ${
                  isDark 
                    ? 'border-gray-700 hover:bg-gray-700/50'
                    : 'border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Type - Left Side */}
                  <span className={`text-xs font-medium capitalize shrink-0 min-w-[70px] ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {suggestion.type}
                  </span>

                  {/* Value - Right Side */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-mono truncate ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {formatValue(suggestion.value)}
                    </div>
                    {suggestion.label && (
                      <div className={`text-xs mt-0.5 ${
                        isDark ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {suggestion.label}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showSuggestions && searchQuery.trim().length > 2 && suggestions.length === 0 && !isSearching && (
        <div 
          className={`absolute w-full mt-2 rounded-lg p-4 text-center ${
            isDark 
              ? 'bg-gray-800 border border-gray-700 shadow-xl' 
              : 'bg-white border border-gray-200 shadow-xl'
          }`}
        >
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No results found for "{searchQuery}"
          </p>
        </div>
      )}

      {/* Loading */}
      {isSearching && searchQuery.trim().length > 2 && (
        <div 
          className={`absolute w-full mt-2 rounded-lg p-4 text-center ${
            isDark 
              ? 'bg-gray-800 border border-gray-700 shadow-xl' 
              : 'bg-white border border-gray-200 shadow-xl'
          }`}
        >
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Searching...
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;