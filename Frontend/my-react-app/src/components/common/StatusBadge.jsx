import React from "react";

/**
 * StatusBadge displays the status of a complaint, styled appropriately.
 * 
 * Props:
 * @param {string} status - The status text (e.g., "Waiting Resp Reg-I", "Complaint Transferred...")
 */
export default function StatusBadge({ status }) {
  if (!status) return null;

  const isWaiting = status.toLowerCase().includes("waiting");
  const isTransferred = status.toLowerCase().includes("transferred");

  return (
    <span
      className={`italic font-medium text-xs px-2.5 py-1 rounded-full
        ${
          isWaiting
            ? "text-red-700 bg-red-50 border border-red-100"
            : isTransferred
            ? "text-blue-700 bg-blue-50 border border-blue-100"
            : "text-gray-700 bg-gray-50 border border-gray-100"
        }
      `}
    >
      {status}
    </span>
  );
}
