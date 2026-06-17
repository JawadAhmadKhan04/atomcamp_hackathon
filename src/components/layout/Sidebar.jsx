import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Sidebar component for rendering vertical navigation options.
 * 
 * Props:
 * @param {Array} items - Array of navigation label strings
 */
export default function Sidebar({ items = [] }) {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#1a2942] text-slate-300 border-r border-slate-800 flex flex-col shrink-0 select-none overflow-y-auto custom-scrollbar h-full">
      <div className="py-2">
        <ul className="flex flex-col text-xs font-semibold tracking-wide">
          {items.map((item, index) => {
            // Check if item is Complaint Listing or Home/AO Home to link them up
            const isListing = item.toLowerCase() === "complaint listing";
            const isRegHome = item.toLowerCase() === "home" && location.pathname === "/registrar-1";
            const isAoHome = item.toLowerCase() === "ao home" && location.pathname === "/authorised-officer";

            let path = "";
            if (isListing) path = "/";
            else if (isRegHome) path = "/registrar-1";
            else if (isAoHome) path = "/authorised-officer";

            const itemText = item.startsWith("- ") ? item : `- ${item}`;

            // Highlight the active page link
            const isActive =
              (isListing && location.pathname === "/") ||
              (isRegHome && location.pathname === "/registrar-1") ||
              (isAoHome && location.pathname === "/authorised-officer");

            if (path) {
              return (
                <li key={index}>
                  <Link
                    to={path}
                    className={`block px-4 py-2.5 border-b border-slate-800/50 transition-colors duration-150
                      ${
                        isActive
                          ? "bg-blue-600/35 text-white border-l-4 border-blue-500 pl-3 font-bold"
                          : "hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >
                    {itemText}
                  </Link>
                </li>
              );
            }

            // Default static no-op item
            return (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => console.log(`Sidebar clicked: ${item}`)}
                  className="w-full text-left px-4 py-2.5 border-b border-slate-800/50 hover:bg-slate-800 hover:text-white transition-colors duration-150 outline-none"
                >
                  {itemText}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
