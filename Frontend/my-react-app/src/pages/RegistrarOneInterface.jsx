import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { useComplaintForm } from "../hooks/useComplaintForm";
import FormField from "../components/common/FormField";
import SelectField from "../components/common/SelectField";
import TextAreaField from "../components/common/TextAreaField";
import SearchableDropdown from "../components/common/SearchableDropdown";
import Button from "../components/common/Button";
import { natureOfComplaintOptions } from "../data/natureOfComplaintOptions";
import { admissibilityOptions } from "../data/admissibilityOptions";
import { agencyOptions, departmentOptions, subOfficeOptions } from "../data/agencyOptions";
import { classifyComplaint, confirmClassification } from "../api/automationApi";

const sidebarItems = [
  "Home",
  "Complaint Listing",
  "Informal Resolution of Dispute Listing",
  "Attachments",
  "Printing of Form B",
  "Printing of Acknowledgement Letter",
  "Set Admissibility",
  "Assign Inv. Officer",
  "Assign Member Inv. Officer",
  "Link other Agencies",
  "Attached Documents",
  "Set Mal-Administration",
  "Set Nature of Case",
  "Transfer to Other Mohtasib",
  "Transfer Station",
  "Transfer to District IO",
  "Forward to AO",
  "Sign Off"
];

const titleOptions = ["Mr.", "Mrs.", "Ms.", "Miss"];
const districtOptions = ["ISLAMABAD", "KARACHI", "LAHORE", "PESHAWAR", "QUETTA", "RAWALPINDI", "MIANWALI"];
const tehsilOptions = ["ISLAMABAD", "CLIFTON", "MODEL TOWN", "PESHAWAR", "QUETTA", "RAWALPINDI", "MIANWALI"];
const cityOptions = ["ISLAMABAD", "KARACHI", "LAHORE", "PESHAWAR", "QUETTA", "RAWALPINDI", "MIANWALI"];

const malAdminCodeOptions = [
  "Select Mal-Administration",
  "Delay",
  "Inattention",
  "Neglect",
  "Inefficiency",
  "Inaction",
  "Arbitrary Decision",
  "Discrimination",
  "Other / Request"
];

const admissibilityStatusOptions = [
  "Select",
  "Admitted",
  "Not Admitted",
  "Transferred",
  "IRD Admitted"
];

const ackLetterOptions = [
  "Complaint Admitted- Documents Required at H.O",
  "Complaint Admitted- Final Reply Awaited",
  "Complaint Reffered To The Provincial Mohtasib , Punjab",
  "Not Admitted- Time Barred",
  "Not Admitted- Outside Jurisdiction",
  "Not Admitted- Private Matter"
];

export default function RegistrarOneInterface() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, updateField, loadComplaint, resetForm } = useComplaintForm();

  const [isAutofilling, setIsAutofilling] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);

  const handleAutofill = async () => {
    setIsAutofilling(true);
    setAiSuggested(false);
    try {
      const result = await classifyComplaint(formData);
      
      updateField("admissibility", result.admissibility || "");
      updateField("remarks1", result.remarks || "");
      
      let mappedStatus = "Select";
      if (result.admissibilityStatus === "admit") mappedStatus = "Admitted";
      if (result.admissibilityStatus === "reject") mappedStatus = "Not Admitted";
      
      if (mappedStatus !== "Select") {
        updateField("admissibilityStatus", mappedStatus);
      }

      if (result.forwardEmail) {
        updateField("remarks2", `[AI Draft Email generated for ${result.forwardEmail.to}]`);
      } else if (result.rejectionLetter) {
        updateField("remarks2", `[AI Draft Rejection Letter generated: ${result.rejectionLetter.formReference}]`);
      }
      
      setAiSuggested(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAutofilling(false);
    }
  };

  // Load complaint if passed from listing page
  useEffect(() => {
    if (location.state?.complaint) {
      loadComplaint(location.state.complaint);
    } else {
      // Seed with some default dummy numbers for demo
      updateField("complaintNumber", "WMS-ONL/0037837/26");
      updateField("registrationDate", "15/06/2026 09:44:10 PM");
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    updateField(id, value);
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    updateField(id, value);

    // Dependent agency selection updates
    if (id === "agency") {
      updateField("department", "");
      updateField("subOffice", "");
    } else if (id === "department") {
      updateField("subOffice", "");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Registrar-I form saved successfully:", formData);
    
    if (aiSuggested) {
      await confirmClassification(formData.complaintNumber);
    }

    alert(`Complaint ${formData.complaintNumber} Saved.`);
    navigate("/");
  };

  const handlePrintB = () => {
    alert("Printing Form B (PDF Mock download)...");
  };

  const handleCancel = () => {
    resetForm();
    navigate("/");
  };

  return (
    <AppLayout title="Registrar-I Interface" sidebarItems={sidebarItems}>
      <form onSubmit={handleSave} className="flex flex-col gap-6 select-text">
        
        {/* ========================================== */}
        {/* 1. CITIZEN-SUBMITTED INFORMATION SECTION */}
        {/* ========================================== */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-3 gap-2">
            <h3 className="text-base font-bold text-slate-800 tracking-wide uppercase">
              1. Citizen Submission (Original Request)
            </h3>
            <div className="text-sm font-semibold">
              Complaint Number:{" "}
              <span className="text-blue-700 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {formData.complaintNumber}
              </span>
            </div>
          </div>

          {/* Complaint Type Radio buttons */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <span className="text-xs font-semibold text-gray-700">Complaint Type:</span>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                id="complaintType"
                name="complaintType"
                value="Fresh"
                checked={formData.complaintType === "Fresh"}
                onChange={(e) => updateField("complaintType", e.target.value)}
                className="text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              Fresh
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                id="complaintType"
                name="complaintType"
                value="Old"
                checked={formData.complaintType === "Old"}
                onChange={(e) => updateField("complaintType", e.target.value)}
                className="text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              Old
            </label>
          </div>

          {/* Title & Registration Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              id="title"
              label="Title"
              value={formData.title}
              onChange={handleSelectChange}
              options={titleOptions}
            />
            <FormField
              id="registrationDate"
              label="Registration Date"
              value={formData.registrationDate}
              onChange={handleInputChange}
              placeholder="e.g. 15/06/2026 09:44:10 PM"
            />
          </div>

          {/* Complainant Name */}
          <TextAreaField
            id="complainantName"
            label="Complainant Name"
            value={formData.complainantName}
            onChange={handleInputChange}
            rows={2}
          />

          {/* Gender */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <span className="text-xs font-semibold text-gray-700">Gender:</span>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={(e) => updateField("gender", e.target.value)}
                className="text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              Male
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={(e) => updateField("gender", e.target.value)}
                className="text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              Female
            </label>
          </div>

          {/* Address */}
          <TextAreaField
            id="address"
            label="Address"
            value={formData.address}
            onChange={handleInputChange}
            rows={2.5}
          />

          {/* District, Tehsil, City */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              id="district"
              label="District"
              value={formData.district}
              onChange={handleSelectChange}
              options={["Select District", ...districtOptions]}
            />
            <SelectField
              id="tehsil"
              label="Tehsil"
              value={formData.tehsil}
              onChange={handleSelectChange}
              options={["Select Tehsil", ...tehsilOptions]}
            />
            <SelectField
              id="city"
              label="City/Town/Vill"
              value={formData.city}
              onChange={handleSelectChange}
              options={["Select City/Town/Vill", ...cityOptions]}
            />
          </div>

          {/* CNIC & Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="cnic"
              label="CNIC. No."
              value={formData.cnic}
              onChange={handleInputChange}
              placeholder="e.g. 37405-1234567-1"
            />
            <FormField
              id="mobile"
              label="Mobile No."
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="e.g. 0300-1234567"
            />
          </div>

          {/* Search Buttons row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="secondary"
              className="w-full text-xs py-2"
              onClick={() => console.log("Searching CNIC:", formData.cnic)}
            >
              Previous Result (0). Search by CNIC No
            </Button>
            <Button
              variant="secondary"
              className="w-full text-xs py-2"
              onClick={() => console.log("Searching Mobile:", formData.mobile)}
            >
              Previous Result (0). Search by Mobile No
            </Button>
          </div>

          {/* Phone No & Fax No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="phone"
              label="Phone No."
              value={formData.phone}
              onChange={handleInputChange}
            />
            <FormField
              id="fax"
              label="Fax No."
              value={formData.fax}
              onChange={handleInputChange}
            />
          </div>

          {/* E-Mail Address & Receiving Office */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="email"
              label="E-Mail Address"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
            />
            <FormField
              id="receivingOffice"
              label="Receiving Office"
              value={formData.receivingOffice}
              onChange={handleInputChange}
            />
          </div>

          {/* NTN & Passport */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="ntn"
              label="NTN No."
              value={formData.ntn}
              onChange={handleInputChange}
            />
            <FormField
              id="passport"
              label="Passport No"
              value={formData.passport}
              onChange={handleInputChange}
            />
          </div>

          {/* Agency Ref No & Value of Complaint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="agencyRefNo"
              label="Agency Ref. No"
              value={formData.agencyRefNo}
              onChange={handleInputChange}
            />
            <FormField
              id="value"
              label="Value of Complaint"
              value={formData.value}
              onChange={handleInputChange}
              type="number"
            />
          </div>

          {/* Agency dropdown fields */}
          <div className="flex flex-col gap-4">
            <SelectField
              id="agency"
              label="Agency/Ministry/Division:"
              value={formData.agency}
              onChange={handleSelectChange}
              options={agencyOptions}
            />
            
            <SelectField
              id="department"
              label="Department/Corporation/Company"
              value={formData.department}
              onChange={handleSelectChange}
              options={["Select Department", ...(departmentOptions[formData.agency] || [])]}
              disabled={!formData.agency}
            />

            <SelectField
              id="subOffice"
              label="Dept/Agency Sub Office"
              value={formData.subOffice}
              onChange={handleSelectChange}
              options={["Select Sub Office", ...(subOfficeOptions[formData.department] || [])]}
              disabled={!formData.department}
            />
          </div>

          {/* Subject */}
          <TextAreaField
            id="subject"
            label="Subject"
            value={formData.subject}
            onChange={handleInputChange}
            rows={2}
          />

          {/* Highlighted box: Main Points of Complaint */}
          <div className="border border-blue-200 rounded-md overflow-hidden bg-blue-50/50">
            <div className="bg-[#1a5fa8] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
              Main Points of Complaint
            </div>
            <div className="p-3">
              <TextAreaField
                id="mainPoints"
                value={formData.mainPoints}
                onChange={handleInputChange}
                rows={3}
                placeholder="Citizen complaint primary points..."
                className="bg-transparent border-none focus:ring-0 focus:border-none px-0 py-0"
              />
            </div>
          </div>

        </div>

        {/* ========================================== */}
        {/* 2. REGISTRAR DECISION / REVIEW SECTION */}
        {/* ========================================== */}
        <div className="bg-white border-l-4 border-blue-600 border-t border-r border-b border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-5 bg-gradient-to-br from-white to-blue-50/20">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-[#1a5fa8] tracking-wide uppercase">
              2. Review & Decision
            </h3>
            
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAutofill}
                disabled={isAutofilling}
                className="bg-purple-600 text-white hover:bg-purple-700 border-purple-700 font-bold shadow-sm"
                type="button"
              >
                {isAutofilling ? "Autofilling..." : "Autofill"}
              </Button>
              {/* Standalone Print Button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => alert("Printing Complaint File Details...")}
                type="button"
              >
                Print
              </Button>
            </div>
          </div>

          {aiSuggested && (
            <div className="bg-purple-50 border border-purple-200 text-purple-800 p-3 rounded-md text-sm font-medium">
              AI has suggested the classification and remarks based on the complaint details. Please review before saving.
            </div>
          )}

          {/* Inv Officer & Transferred */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="invOfficer"
              label="Inv.Officer"
              value={formData.invOfficer}
              disabled={true}
            />
            <FormField
              id="transferred"
              label="Transferred"
              value={formData.transferred}
              disabled={true}
            />
          </div>

          {/* Mal Admin Code & Nature of Complaint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              id="malAdminCode"
              label="Mal Admin Code"
              value={formData.malAdminCode}
              onChange={handleSelectChange}
              options={malAdminCodeOptions}
            />
            <SearchableDropdown
              id="natureOfComplaint"
              label="Nature of Complaint"
              value={formData.natureOfComplaint}
              onChange={handleInputChange}
              options={natureOfComplaintOptions}
              placeholder="Search nature..."
            />
          </div>

          {/* Acknowledgement Status & Admissibility Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="acknowledgementStatus"
              label="Acknowledgement Status"
              value={formData.acknowledgementStatus}
              disabled={true}
            />
            <SelectField
              id="admissibilityStatus"
              label="Admissibility Status"
              value={formData.admissibilityStatus}
              onChange={handleSelectChange}
              options={admissibilityStatusOptions}
            />
          </div>

          {/* Admissibility SearchableDropdown */}
          <SearchableDropdown
            id="admissibility"
            label="Admissibility"
            value={formData.admissibility}
            onChange={handleInputChange}
            options={admissibilityOptions}
            placeholder="Search admissibility code..."
          />

          {/* Proved Mal Admin & Ack Letter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextAreaField
              id="provedMalAdministration"
              label="Proved Mal-Administration"
              value={formData.provedMalAdministration}
              onChange={handleInputChange}
              rows={2}
            />
            <SelectField
              id="acknowledgementLetter"
              label="Acknowledgement Letter"
              value={formData.acknowledgementLetter}
              onChange={handleSelectChange}
              options={ackLetterOptions}
            />
          </div>

          {/* Remarks (1) */}
          <TextAreaField
            id="remarks1"
            label="Remarks"
            value={formData.remarks1}
            onChange={handleInputChange}
            rows={2}
          />

          {/* Remarks (2) */}
          <TextAreaField
            id="remarks2"
            label="Remarks"
            value={formData.remarks2}
            onChange={handleInputChange}
            rows={2}
          />
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="primary" type="submit">
            Save
          </Button>
          <Button variant="secondary" onClick={handlePrintB}>
            Print Form B
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </div>

      </form>
    </AppLayout>
  );
}
