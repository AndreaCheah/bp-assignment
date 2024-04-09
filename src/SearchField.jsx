import React, { useState, useEffect, useCallback, useMemo } from "react";

const debounce = (func, delay) => {
  let inDebounce;
  return function (...args) {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const SearchField = ({
  label,
  placeholder,
  description,
  name,
  id,
  searchType,
  onSearch,
}) => {
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback((searchInput) => {
    if (searchType === "async") {
      setIsSearching(true);
      // Simulate an async API call with a delay
      setTimeout(() => {
        onSearch(searchInput);
        setIsSearching(false);
      }, 2000);
    } else {
      onSearch(searchInput);
    }
  }, [onSearch, searchType]);

  const debouncedSearch = useMemo(() => debounce(handleSearch, 500), [handleSearch]);

  
  const handleInputChange = useCallback(
    (e) => {
      const newInput = e.target.value;
      setInput(newInput);

      if (searchType === "sync") {
        handleSearch(newInput);
      } else if (searchType === "async") {
        debouncedSearch(newInput);
      }
    },
    [debouncedSearch, handleSearch, searchType]
  );

  useEffect(() => {
    if (searchType === "async" && input) {
      debouncedSearch(input);
    }
    return () => {
      // to clear timeouts
    };
  }, [input, debouncedSearch, searchType]);

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type="text"
          name={name}
          id={id}
          className="block w-full pl-2 pr-2 sm:text-sm border-gray-300 rounded-md mb-1"
          placeholder={placeholder}
          value={input}
          onChange={handleInputChange}
        />
        {isSearching && searchType === "async" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {/* Replace this with loading icon */}
            <div>Loading...</div>
          </div>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default SearchField;
