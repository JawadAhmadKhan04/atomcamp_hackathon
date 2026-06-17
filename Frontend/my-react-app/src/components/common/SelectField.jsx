import React from "react";

/**
 * SelectField component renders a styled select dropdown list.
 * 
 * Props:
 * @param {string} id - Unique identifier for the select field
 * @param {string} label - Text label displayed above the select field
 * @param {any} value - Controlled value of the select
 * @param {function} onChange - Change event handler
 * @param {array} options - Array of options. Can be strings or { value, label } objects
 * @param {boolean} disabled - Whether the select is disabled
 * @param {string} error - Error message to display
 * @param {string} className - Optional additional container tailwind classes
 */
export default function SelectField({
  id,
  label,
  value,
  onChange,
  options = [],
  disabled = false,
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
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-1.5 border rounded-md text-sm transition-colors duration-200 outline-none appearance-none bg-no-repeat bg-[right_10px_center]
          ${
            disabled
              ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-800 border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
          }
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundSize: "16px"
        }}
        {...props}
      >
        {options.map((opt, idx) => {
          if (typeof opt === "object" && opt !== null) {
            return (
              <option key={opt.value || idx} value={opt.value}>
                {opt.label}
              </option>
            );
          }
          return (
            <option key={opt || idx} value={opt}>
              {opt}
            </option>
          );
        })}
      </select>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
