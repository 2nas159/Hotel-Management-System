import React, { useState, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";

const SearchSuggestions = ({ 
  value = "", 
  onChange = () => {}, 
  onSelect = () => {},
  placeholder = "Type here",
  recentSearches = [],
  popularDestinations = ["Dubai", "Singapore", "New York", "London", "Paris", "Tokyo", "Sydney", "Barcelona"]
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Filter suggestions based on input value
  useEffect(() => {
    if (value.length === 0) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = [
      ...recentSearches.filter(search => 
        search.toLowerCase().includes(value.toLowerCase())
      ),
      ...popularDestinations.filter(dest => 
        dest.toLowerCase().includes(value.toLowerCase()) && 
        !recentSearches.includes(dest)
      )
    ].slice(0, 8); // Limit to 8 suggestions

    setFilteredSuggestions(filtered);
  }, [value, recentSearches, popularDestinations]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    onSelect(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (filteredSuggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = (e) => {
    // Delay closing to allow for suggestion clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          autoComplete="off"
        />
        
        {/* Search icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <img src={assets.searchIcon} alt="search" className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Suggestions dropdown */}
      {isOpen && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {/* Recent searches section */}
          {recentSearches.some(search => 
            search.toLowerCase().includes(value.toLowerCase())
          ) && (
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Recent Searches
              </p>
            </div>
          )}
          
          {filteredSuggestions.map((suggestion, index) => {
            const isRecent = recentSearches.includes(suggestion);
            const isSelected = index === selectedIndex;
            
            return (
              <button
                key={`${suggestion}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                  isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                {isRecent ? (
                  <img src={assets.calenderIcon} alt="recent" className="w-3 h-3 text-gray-400" />
                ) : (
                  <img src={assets.locationIcon} alt="location" className="w-3 h-3 text-gray-400" />
                )}
                <span>{suggestion}</span>
              </button>
            );
          })}
          
          {/* Popular destinations section */}
          {!recentSearches.some(search => 
            search.toLowerCase().includes(value.toLowerCase())
          ) && value.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Popular Destinations
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
