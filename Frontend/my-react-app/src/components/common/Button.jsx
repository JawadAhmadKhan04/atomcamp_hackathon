import React from "react";

/**
 * Button component with predefined colors matching the Secretariat color palette.
 * 
 * Props:
 * @param {string} variant - Button type variant: 'primary' (green), 'secondary' (blue), 'danger' (red), 'neutral' (grey)
 * @param {string} size - Button size: 'sm', 'md', 'lg'
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} children - Button text or elements
 * @param {function} onClick - Click event handler
 * @param {string} className - Optional additional tailwind classes
 */
export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  onClick,
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  const variantStyles = {
    // Green Save
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 border border-transparent disabled:bg-emerald-300",
    // Blue Action / Print / Search
    secondary: "bg-[#1a5fa8] hover:bg-[#154e8a] text-white focus:ring-[#1a5fa8] border border-transparent disabled:bg-blue-300",
    // Red Cancel
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent disabled:bg-red-300",
    // Grey Neutral
    neutral: "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-300 border border-gray-300 disabled:bg-gray-50 disabled:text-gray-400"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled ? "cursor-not-allowed opacity-60 active:scale-100" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
