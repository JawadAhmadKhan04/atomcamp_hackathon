import React from "react";

/**
 * AuditTrailBlock renders historical workflow remarks with usernames and timestamps.
 * 
 * Props:
 * @param {Array} entries - List of remark sections, each containing:
 *   - label: string (e.g. "AO's Remarks:")
 *   - items: Array of objects (e.g. [{ text: "Remark body", meta: "[user] datetime" }])
 */
export default function AuditTrailBlock({ entries = [] }) {
  return (
    <div className="flex flex-col gap-3 mt-4 border-t border-gray-200 pt-4 w-full">
      {entries.map((entry, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-start">
          {/* Left Label */}
          <div className="md:col-span-1 text-xs font-semibold text-gray-700 md:pt-2">
            {entry.label}
          </div>
          
          {/* Right Remarks Container */}
          <div className="md:col-span-5 bg-gray-50 border border-gray-200 rounded-md p-3 min-h-[44px] flex flex-col gap-2.5">
            {entry.items && entry.items.length > 0 ? (
              entry.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx} 
                  className={`flex flex-col gap-1 text-sm text-gray-800 ${
                    itemIdx > 0 ? "border-t border-gray-200 pt-2" : ""
                  }`}
                >
                  <p className="leading-relaxed">{item.text || "-"}</p>
                  {item.meta && (
                    <span className="text-xs font-medium text-red-600 tracking-wider font-mono">
                      {item.meta}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-gray-400 text-sm italic"></span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
