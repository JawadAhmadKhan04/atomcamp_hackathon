import React, { useState } from "react";
import { mockComplaints } from "../data/mockComplaints";
import ComplaintListingTable from "../components/complaints/ComplaintListingTable";
import { useNavigate } from "react-router-dom";

export default function ComplaintListing() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter complaints based on Search Input
  const filteredComplaints = mockComplaints.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.complainantName.toLowerCase().includes(term) ||
      c.complaintNumber.toLowerCase().includes(term) ||
      c.agency.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-text">
      
      {/* 1. Browser-Style Mock Top Toolbar */}
      <div className="bg-[#1e293b] text-gray-300 text-[11px] font-semibold px-4 py-2 border-b border-slate-700 flex flex-wrap gap-4 items-center shadow-inner">
        <span className="text-gray-500 uppercase tracking-wider text-[9px] mr-2">CMIS Shortcuts</span>
        <button onClick={() => navigate("/")} className="hover:text-white flex items-center gap-1 border-r border-slate-700 pr-4">
          🏠 Home
        </button>
        <a href="#" className="hover:text-white flex items-center gap-1 border-r border-slate-700 pr-4">
          🔖 Bookmark
        </a>
        <a href="#" className="hover:text-white flex items-center gap-1 border-r border-slate-700 pr-4">
          ⚖️ Const.
        </a>
        <a href="#" className="hover:text-white flex items-center gap-1 border-r border-slate-700 pr-4">
          🏢 MyHouse
        </a>
        <a href="#" className="hover:text-white flex items-center gap-1 border-r border-slate-700 pr-4">
          🗺️ EVMap
        </a>
        <a href="#" className="hover:text-white flex items-center gap-1 border-r border-slate-700 pr-4 font-bold text-emerald-400">
          ☪️ Mohtasib
        </a>
        <a href="#" className="hover:text-white flex items-center gap-1 border-r border-slate-700 pr-4">
          📁 CMIS
        </a>
        <span className="text-gray-400 font-mono text-[10px] border-r border-slate-700 pr-4">
          🌐 192.168.0.134
        </span>
        <a href="#" className="hover:text-white flex items-center gap-1">
          ✈️ AirNav
        </a>
      </div>

      {/* 2. Page Header & Info Panel */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#1a5fa8] tracking-wide m-0">
            WAFAQI MOHTASIB (OMBUDSMAN)'S SECRETARIAT
          </h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Complaint Tracking & Management Information System (MIS)
          </p>
        </div>
        
        {/* Quick Search */}
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Search number, name, or agency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 pl-8 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* 3. Main Content Container (Full Width Scrollable Table) */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-700">Complaint Database (Active)</span>
            <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded">
              {filteredComplaints.length} Records
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/registrar-1")}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-sm transition-all"
            >
              Registrar-I Form +
            </button>
            <button
              onClick={() => navigate("/authorised-officer")}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-sm transition-all"
            >
              Authorised Officer Form +
            </button>
          </div>
        </div>

        {/* The Listing Table */}
        <ComplaintListingTable complaints={filteredComplaints} />
      </div>

      {/* 4. Standalone Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between text-[11px] text-gray-500 font-semibold shadow-inner mt-auto">
        <span>
          Management Information System © June 2026 V: 26.6
        </span>
        <span>
          Powered by:{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Dr. Sohail Ahmad Phatak
          </a>
          , Wafaqi Mohtasib (Ombudsman)'s Secretariat
        </span>
      </footer>
    </div>
  );
}
