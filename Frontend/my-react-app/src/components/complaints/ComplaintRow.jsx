import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";

/**
 * ComplaintRow renders a single row of complaint details.
 * 
 * Props:
 * @param {object} complaint - The complaint data object
 * @param {number} index - Index for the sequential list count
 */
export default function ComplaintRow({ complaint, index }) {
  const navigate = useNavigate();

  const handleRowClick = () => {
    console.log("Clicked row:", complaint.complaintNumber);
  };

  const goToRegistrar = (e) => {
    e.stopPropagation();
    // Navigate to Registrar-I and pass the complaint details as state
    navigate("/registrar-1", { state: { complaint } });
  };

  const goToAuthorisedOfficer = (e) => {
    e.stopPropagation();
    // Navigate to Authorised Officer and pass the complaint details as state
    navigate("/authorised-officer", { state: { complaint } });
  };

  return (
    <tr 
      onClick={handleRowClick}
      className="bg-[#ff8966] hover:bg-[#ff7b54] text-slate-900 border-b border-orange-300 font-medium transition-colors duration-150 cursor-pointer"
    >
      {/* S.No */}
      <td className="px-3 py-3 text-center text-xs border-r border-orange-300">
        {index + 1}
      </td>

      {/* Complaint Number (Link to Registrar-I) */}
      <td className="px-4 py-3 font-semibold text-xs border-r border-orange-300">
        <button
          onClick={goToRegistrar}
          className="text-blue-900 hover:text-blue-950 underline text-left focus:outline-none"
          title="Review as Registrar-I"
        >
          {complaint.complaintNumber}
        </button>
      </td>

      {/* Complainant Name (Link to Authorised Officer) */}
      <td className="px-4 py-3 text-xs border-r border-orange-300">
        <button
          onClick={goToAuthorisedOfficer}
          className="text-blue-900 hover:text-blue-950 underline text-left focus:outline-none font-semibold uppercase"
          title="Review as Authorised Officer"
        >
          {complaint.complainantName}
        </button>
      </td>

      {/* Agency */}
      <td className="px-4 py-3 text-xs border-r border-orange-300 max-w-[200px] truncate">
        {complaint.agency}
      </td>

      {/* Station */}
      <td className="px-4 py-3 text-xs border-r border-orange-300">
        {complaint.station}
      </td>

      {/* Diary Date */}
      <td className="px-4 py-3 text-xs border-r border-orange-300 text-center font-mono">
        {complaint.diaryDate}
      </td>

      {/* Admissibility */}
      <td className="px-4 py-3 text-xs border-r border-orange-300 max-w-[150px] truncate">
        {complaint.admissibility || "-"}
      </td>

      {/* Reasons */}
      <td className="px-4 py-3 text-xs border-r border-orange-300">
        {complaint.reasons || "-"}
      </td>

      {/* Admissibility Date */}
      <td className="px-4 py-3 text-xs border-r border-orange-300 text-center font-mono">
        {complaint.admissibilityDate || "-"}
      </td>

      {/* Status */}
      <td className="px-4 py-3 border-orange-300 text-center">
        <div className="flex justify-center items-center">
          <StatusBadge status={complaint.status} />
        </div>
      </td>
    </tr>
  );
}
