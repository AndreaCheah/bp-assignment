import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { createPopper } from "@popperjs/core";
import currencies from "./data/currencies.json";

const debounce = (func, delay) => {
  let inDebounce;
  return function (...args) {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const searchData = currencies;

const SearchField = ({
  label,
  placeholder,
  description,
  name,
  id,
  searchType
}) => {
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef();
  const resultsRef = useRef();

  const handleSearch = useCallback(
    (searchInput) => {
      setIsSearching(true);
      setTimeout(
        () => {
          const filteredResults = filterResults(searchInput);
          setResults(filteredResults);
          setShowResults(true);
          setIsSearching(false);
        },
        searchType === "async" ? 1000 : 0
      ); // Simulated delay for async
    },
    [searchType]
  );

  const debouncedSearch = useMemo(
    () => debounce(handleSearch, 500),
    [handleSearch]
  );

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

  useEffect(() => {
    if (showResults && resultsRef.current && inputRef.current) {
      createPopper(inputRef.current, resultsRef.current, {
        placement: "bottom-start",
      });
    }
  }, [showResults, results]);

  const filterResults = (input) => {
    console.log("searchData is", searchData);
    if (!input) return []; // If input is empty or undefined, return empty array.

    if (searchType === "async") {
      return searchData.filter(
        (item) =>
          item.country_code.toLowerCase().includes(input.toLowerCase()) ||
          item.currency_name.toLowerCase().includes(input.toLowerCase()) ||
          item.currency_code.toLowerCase().includes(input.toLowerCase())
      );
    } else {
      return searchData
        .filter((item) =>
          item.currency_name.toLowerCase().includes(input.toLowerCase())
        )
        .map((item) => ({ currency_name: item.currency_name }));
    }
  };

  return (
    <div className="mb-4 relative">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="rounded-md shadow-sm">
        <input
          ref={inputRef}
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
            <div>Loading...</div>
          </div>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {showResults && (
        <div
          ref={resultsRef}
          style={{ backgroundColor: "white" }}
          className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {results.map((result, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
            >
              <span>
                {searchType === "async"
                  ? `${result.country_code} - ${result.currency_name} (${result.currency_code})`
                  : result.currency_name}
              </span>
              <input
                type="checkbox"
                id={`checkbox-${index}`}
                name="selectedCurrency"
                value={result.currency_code}
                className="ml-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchField;
