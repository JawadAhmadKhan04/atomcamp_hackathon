import React, { useState, useEffect, useRef } from "react";

/**
 * SearchableDropdown provides a searchable combobox dropdown for long lists (e.g., 100+ items).
 * It supports keyboard navigation (Up, Down, Enter, Escape) and click-outside closing.
 * 
 * Props:
 * @param {string} id - Unique identifier for form accessibility
 * @param {string} label - Label text above the field
 * @param {string} value - Controlled value (currently selected string)
 * @param {function} onChange - Callback triggered on selection change: (value) => void
 * @param {array} options - Array of string values to choose from
 * @param {string} placeholder - Placeholder text when closed/empty
 * @param {boolean} disabled - Disabled state
 * @param {string} error - Optional error message
 */
export default function SearchableDropdown({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
  error = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  // Synchronize search text when value changes
  useEffect(() => {
    setSearchTerm(value && value !== "Select" && value !== "Select Nature" ? value : "");
  }, [value]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset search term back to current value
        setSearchTerm(value && value !== "Select" && value !== "Select Nature" ? value : "");
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, value]);

  // Filter options based on typed search term
  const filteredOptions = options.filter((option) => {
    if (!option) return false;
    // Don't search placeholder items
    if (option === "Select" || option === "Select Nature") return false;
    return option.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Keep first option if empty or full list is shown
  const finalOptions = filteredOptions.length > 0 ? filteredOptions : [];

  const handleSelect = (optionValue) => {
    onChange({ target: { id, value: optionValue } });
    setSearchTerm(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prev) =>
          prev < finalOptions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < finalOptions.length) {
        handleSelect(finalOptions[highlightedIndex]);
      } else if (!isOpen) {
        setIsOpen(true);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm(value && value !== "Select" && value !== "Select Nature" ? value : "");
    }
  };

  // Scroll highlighted item into view automatically
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedEl = listRef.current.children[highlightedIndex];
      if (highlightedEl) {
        highlightedEl.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5 w-full relative">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-gray-700 tracking-wide"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full px-3 py-1.5 pr-8 border rounded-md text-sm transition-colors duration-200 outline-none
            ${
              disabled
                ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-800 border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-text"
            }
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          `}
        />
        {/* Toggle Arrow Icon */}
        <button
          type="button"
          tabIndex="-1"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          disabled={disabled}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Floating Dropdown List Panel */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto custom-scrollbar">
          <ul ref={listRef} className="py-1">
            {finalOptions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500 italic">
                No matching results found
              </li>
            ) : (
              finalOptions.map((option, index) => {
                const isSelected = option === value;
                const isHighlighted = index === highlightedIndex;
                return (
                  <li
                    key={option}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-3 py-1.5 text-sm cursor-pointer select-none transition-colors duration-150
                      ${
                        isSelected
                          ? "bg-blue-600 text-white font-medium"
                          : isHighlighted
                          ? "bg-blue-500 text-white"
                          : "text-gray-800 hover:bg-gray-100"
                      }
                    `}
                  >
                    {option}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
