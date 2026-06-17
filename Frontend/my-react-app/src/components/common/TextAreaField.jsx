import React from "react";

/**
 * TextAreaField component renders a styled textarea element.
 * 
 * Props:
 * @param {string} id - Unique identifier for the textarea
 * @param {string} label - Text label displayed above the textarea
 * @param {any} value - Controlled value of the textarea
 * @param {function} onChange - Change event handler
 * @param {number} rows - Number of rows to render
 * @param {boolean} disabled - Whether the textarea is disabled
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message to display
 * @param {string} className - Optional additional container tailwind classes
 */
export default function TextAreaField({
  id,
  label,
  value,
  onChange,
  rows = 3,
  disabled = false,
  placeholder = "",
  error = "",
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-gray-700 tracking-wide"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-3 py-1.5 border rounded-md text-sm transition-colors duration-200 outline-none resize-y
          ${
            disabled
              ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-800 border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          }
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
