import React from "react";

/**
 * FormField component renders a styled label and input field.
 * 
 * Props:
 * @param {string} id - Unique identifier for the input
 * @param {string} label - Text label displayed above the input
 * @param {string} type - Input type (text, number, email, etc.)
 * @param {any} value - Controlled value of the input
 * @param {function} onChange - Change event handler
 * @param {boolean} disabled - Whether the input is disabled
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message to display below input
 * @param {string} className - Optional additional container tailwind classes
 */
export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
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
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-3 py-1.5 border rounded-md text-sm transition-colors duration-200 outline-none
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
