import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

/**
 * AppLayout wraps administrative pages, rendering header, sidebar, page title bar, and footer.
 * 
 * Props:
 * @param {React.ReactNode} children - Main page content
 * @param {string} title - Page title shown in the blue accent bar
 * @param {Array} sidebarItems - Navigation list labels
 */
export default function AppLayout({ children, title, sidebarItems = [] }) {
  return (
    <div className="h-screen flex flex-col bg-gray-100 font-sans">
      {/* 1. Header Bar */}
      <Header />

      {/* 2. Page Title Bar */}
      <div className="bg-[#1a5fa8] text-white px-6 py-2.5 text-sm font-semibold tracking-wide shadow-sm shrink-0 border-b border-[#144980] flex justify-between items-center">
        <span>{title}</span>
        <span className="text-xs text-blue-200">Wafaqi Mohtasib MIS Portal</span>
      </div>

      {/* 3. Main Workspace Area (Sidebar + Content Scroll Container) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar items={sidebarItems} />

        {/* Right Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
            {children}
          </div>

          {/* Footer inside content area for clean alignment */}
          <footer className="mt-auto border-t border-gray-200 pt-4 pb-2 flex flex-col sm:flex-row justify-between text-[11px] text-gray-500 font-medium">
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
        </main>
      </div>
    </div>
  );
}
