import React from "react";
import ComplaintRow from "./ComplaintRow";

/**
 * ComplaintListingTable renders a tabular layout of complaints.
 * 
 * Props:
 * @param {Array} complaints - List of complaint data items
 */
export default function ComplaintListingTable({ complaints = [] }) {
  return (
    <div className="w-full overflow-x-auto shadow-md rounded-lg border border-orange-400 bg-white">
      <table className="w-full text-left border-collapse table-auto min-w-[1000px]">
        {/* Navy Header Row */}
        <thead>
          <tr className="bg-[#1a5fa8] text-white text-xs uppercase font-bold tracking-wider select-none border-b border-orange-400">
            <th className="px-3 py-3.5 text-center border-r border-orange-400 w-16">
              S.No
            </th>
            <th className="px-4 py-3.5 border-r border-orange-400 w-44">
              Complaint Number
            </th>
            <th className="px-4 py-3.5 border-r border-orange-400 w-60">
              Complainant Name
            </th>
            <th className="px-4 py-3.5 border-r border-orange-400 w-64">
              Agency
            </th>
            <th className="px-4 py-3.5 border-r border-orange-400 w-36">
              Station
            </th>
            <th className="px-4 py-3.5 border-r border-orange-400 w-48 text-center">
              Diary Date
            </th>
            <th className="px-4 py-3.5 border-r border-orange-400 w-52">
              Admissibility
            </th>
            <th className="px-4 py-3.5 border-r border-orange-400 w-40">
              Reasons
            </th>
            <th className="px-4 py-3.5 border-r border-orange-400 w-36 text-center">
              Admissibility Date
            </th>
            <th className="px-4 py-3.5 text-center w-48">
              Status
            </th>
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="10" className="px-4 py-8 text-center text-gray-500 bg-gray-50 italic">
                No complaints registered in the system.
              </td>
            </tr>
          ) : (
            complaints.map((complaint, idx) => (
              <ComplaintRow
                key={complaint.complaintNumber}
                complaint={complaint}
                index={idx}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
