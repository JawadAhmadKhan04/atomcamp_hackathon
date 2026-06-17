import React from "react";

/**
 * Header component for the Wafaqi Mohtasib Management Information System.
 * 
 * Props:
 * @param {string} currentUser - The name of the logged in user (default: 'DrIramKhan')
 * @param {number} actionsThisMonth - Number of actions performed (default: 47)
 */
export default function Header({ 
  currentUser = "DrIramKhan", 
  actionsThisMonth = 142 
}) {
  return (
    <header className="bg-emerald-700 text-white px-6 py-3 flex flex-col md:flex-row items-center justify-between shadow-md border-b-4 border-emerald-800 shrink-0 select-none">
      
      {/* Left: Circular Logo Placeholder */}
      <div className="flex items-center gap-3 self-start md:self-center">
        <div className="w-12 h-12 rounded-full border-2 border-white bg-white flex items-center justify-center overflow-hidden shadow-inner shrink-0">
          {/* A neat representation of the Pakistan crest */}
          <div className="w-10 h-10 rounded-full border-2 border-emerald-700 bg-emerald-50 flex items-center justify-center text-[8px] font-bold text-emerald-800">
            ★ WMS ★
          </div>
        </div>
        <div className="hidden lg:block">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Government of Pakistan</span>
          <p className="text-xs font-semibold leading-tight -mt-0.5">Federal Ombudsman</p>
        </div>
      </div>

      {/* Center: Title in English & Urdu */}
      <div className="text-center my-2 md:my-0 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-wider leading-none m-0 text-white">
          WAFAQI MOHTASIB (OMBUDSMAN)'S SECRETARIAT
        </h1>
        <h2 className="urdu-font text-base md:text-lg lg:text-xl font-medium mt-1 mb-0 leading-none text-emerald-100">
          وفاقی محتسب سیکرٹریٹ
        </h2>
      </div>

      {/* Right: User and System Status */}
      <div className="text-[11px] font-medium text-right self-end md:self-center flex flex-col gap-0.5 leading-tight opacity-95 tracking-wide bg-emerald-800/40 p-2 rounded border border-emerald-600/30 min-w-[200px]">
        <div className="flex justify-between md:justify-end gap-4">
          <span className="opacity-75">Station:</span>
          <span>36-Constitution Avenue, G-5/2, Islamabad</span>
        </div>
        <div className="flex justify-between md:justify-end gap-4">
          <span className="opacity-75">Current User:</span>
          <span className="font-semibold text-emerald-200">{currentUser}</span>
        </div>
        <div className="flex justify-between md:justify-end gap-4">
          <span className="opacity-75">Actions this month:</span>
          <span className="font-semibold text-emerald-200">{actionsThisMonth}</span>
        </div>
      </div>
    </header>
  );
}
