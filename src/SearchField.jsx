import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { createPopper } from "@popperjs/core";
import currencies from "./data/currencies.json";
import MagnifyingGlassIcon from "./icons/magnifying-glass.svg";

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
  searchType,
}) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef();
  const resultsRef = useRef();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedCurrencies, setSelectedCurrencies] = useState(new Set());

  const handleSearch = useCallback(
    (searchInput) => {
      setIsLoading(true);
      setTimeout(
        () => {
          const filteredResults = filterResults(searchInput);
          setResults(filteredResults);
          setShowResults(true);
          setIsLoading(false);
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
      const pattern = input
        .split("")
        .map((char) => `${char.toLowerCase()}.*`)
        .join("");
      const regex = new RegExp(pattern);
      return searchData.filter(
        (item) =>
          regex.test(item.country_code.toLowerCase()) ||
          regex.test(item.currency_name.toLowerCase()) ||
          regex.test(item.currency_code.toLowerCase())
      );
    } else {
      return searchData
        .filter((item) =>
          item.currency_name.toLowerCase().includes(input.toLowerCase())
        )
        .map((item) => ({ currency_name: item.currency_name }));
    }
  };

  const handleKeyboardKey = useCallback(
    (event) => {
      if (event.key === "ArrowDown") {
        setActiveIndex((prevIndex) => Math.min(prevIndex + 1, results.length - 1));
      } else if (event.key === "ArrowUp") {
        setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (event.key === "Enter" && activeIndex >= 0 && activeIndex < results.length) {
        const resultItem = results[activeIndex];
        handleSelect(resultItem.currency_code);
      } else if (event.key === "Escape") {
        setShowResults(false);
      }
    },
    [results, activeIndex]
  );

  useEffect(() => {
    if (showResults) {
      document.addEventListener("keydown", handleKeyboardKey);
    } else {
      document.removeEventListener("keydown", handleKeyboardKey);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyboardKey);
    };
  }, [showResults, handleKeyboardKey]);

  const handleSelect = useCallback((currencyCode) => {
    setSelectedCurrencies((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(currencyCode)) {
        newSelected.delete(currencyCode);
      } else {
        newSelected.add(currencyCode);
      }
      return newSelected;
    });
  }, []);  

  return (
    <div className="mb-4 relative flex flex-col items-start w-full">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="w-full">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <img
              src={MagnifyingGlassIcon}
              alt="Search"
              className="w-5 h-5 text-gray-500"
            />
          </div>
          <input
            ref={inputRef}
            type="text"
            name={name}
            id={id}
            className="block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md" /* padding-left is adjusted to make space for the icon */
            placeholder={placeholder}
            value={input}
            onChange={handleInputChange}
          />
          {isLoading && searchType === "async" && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div>Loading...</div>
            </div>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {showResults && (
        <div
          ref={resultsRef}
          className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {results.map((result, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 cursor-pointer ${
                index === activeIndex ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
              onClick={() => handleSelect(result.currency_code)}
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
                checked={selectedCurrencies.has(result.currency_code)}
                onChange={() => handleSelect(result.currency_code)}
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
