import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { useComplaintForm } from "../hooks/useComplaintForm";
import FormField from "../components/common/FormField";
import SelectField from "../components/common/SelectField";
import TextAreaField from "../components/common/TextAreaField";
import SearchableDropdown from "../components/common/SearchableDropdown";
import AuditTrailBlock from "../components/common/AuditTrailBlock";
import Button from "../components/common/Button";
import { natureOfComplaintOptions } from "../data/natureOfComplaintOptions";
import { admissibilityOptions } from "../data/admissibilityOptions";
import { agencyOptions, departmentOptions, subOfficeOptions } from "../data/agencyOptions";
import { classifyComplaint, confirmClassification } from "../api/automationApi";

const sidebarItems = [
  "AO Home",
  "Complaint Listing",
  "Attachments",
  "Update IDR Profile",
  "Assign Inv. Officer",
  "Assign Member Inv. Officer",
  "Link other Agencies",
  "Set Admissibility",
  "Set Mal-Administration",
  "Set Nature of Case",
  "Transfer Station",
  "Forward to Registrar",
  "Sign Off"
];

const titleOptions = ["Mr.", "Mrs.", "Ms.", "Miss"];
const districtOptions = ["ISLAMABAD", "KARACHI", "LAHORE", "PESHAWAR", "QUETTA", "RAWALPINDI", "MIANWALI"];
const tehsilOptions = ["ISLAMABAD", "CLIFTON", "MODEL TOWN", "PESHAWAR", "QUETTA", "RAWALPINDI", "MIANWALI"];
const cityOptions = ["ISLAMABAD", "KARACHI", "LAHORE", "PESHAWAR", "QUETTA", "RAWALPINDI", "MIANWALI"];

const malAdminCodeOptions = [
  "Select Mal-Administration",
  "Other / Request",
  "Delay",
  "Inattention",
  "Neglect",
  "Inefficiency",
  "Inaction"
];

const admissibilityStatusOptions = [
  "Select",
  "Not Admissible",
  "Admitted",
  "Transferred",
  "IRD Admitted"
];

const ackLetterOptions = [
  "Complaint Reffered To The Provincial Mohtasib , Punjab",
  "Complaint Admitted- Documents Required at H.O",
  "Complaint Admitted- Final Reply Awaited",
  "Not Admitted- Time Barred",
  "Not Admitted- Outside Jurisdiction",
  "Not Admitted- Private Matter"
];

// Mock audit entries for the AuditTrailBlock
const mockAuditEntries = [
  {
    label: "AO's Remarks:",
    items: [
      {
        text: "Provincial Matter:- Transferred to the Sectt. of Provincial Mohtasib Punjab",
        meta: "[DrIramKhan] 6/16/2026 5:49:31 PM"
      }
    ]
  },
  {
    label: "DG's Remarks:",
    items: []
  },
  {
    label: "Registrar's Remarks:",
    items: [
      {
        text: "Complaint Admitted for Informal Resolution of Dispute (IRD) under Article 33",
        meta: "[regthqr] 6/15/2026 10:37:09 AM"
      },
      {
        text: "Complaint IRD Profile Updated as Normal",
        meta: "[DrIramKhan] Dated:Jun 16 2026 5:49PM"
      }
    ]
  }
];

export default function AuthorisedOfficerInterface() {
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
      
      let mappedStatus = "Select";
      if (result.admissibilityStatus === "admit") mappedStatus = "Admitted";
      if (result.admissibilityStatus === "reject") mappedStatus = "Not Admissible";
      
      if (mappedStatus !== "Select") {
        updateField("admissibilityStatus", mappedStatus);
      }

      let extraRemark = "";
      if (result.forwardEmail) {
        extraRemark = `\n\n[AI Draft Email generated for ${result.forwardEmail.to}]`;
      } else if (result.rejectionLetter) {
        extraRemark = `\n\n[AI Draft Rejection Letter generated: ${result.rejectionLetter.formReference}]`;
      }

      updateField("remarks1", (result.remarks || "") + extraRemark);
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
      // Seed default dummy complaint
      updateField("complaintNumber", "WMS-IRD/0001195/26");
      updateField("registrationDate", "16/06/2026 10:37:09 AM");
      updateField("malAdminCode", "Other / Request");
      updateField("admissibilityStatus", "Not Admissible");
      updateField("admissibility", "Provincial Matter:- Transferred to the Sectt. of Provincial Mohtasib Punjab");
      updateField("acknowledgementLetter", "Complaint Reffered To The Provincial Mohtasib , Punjab");
      updateField("remarks1", "Provincial Matter:- Transferred to the Sectt. of Provincial Mohtasib Punjab");
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    updateField(id, value);
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    updateField(id, checked);
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    updateField(id, value);

    if (id === "agency") {
      updateField("department", "");
      updateField("subOffice", "");
    } else if (id === "department") {
      updateField("subOffice", "");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("Authorised Officer form saved successfully:", formData);
    
    if (aiSuggested) {
      await confirmClassification(formData.complaintNumber);
    }

    alert(`Complaint ${formData.complaintNumber} Saved successfully.`);
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
    <AppLayout title="Authorised Officer Interface" sidebarItems={sidebarItems}>
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
                name="complaintType"
                value="Old"
                checked={formData.complaintType === "Old"}
                onChange={(e) => updateField("complaintType", e.target.value)}
                className="text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              Old
            </label>
          </div>

          {/* Row: Title Dropdown | Caption Text Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              id="title"
              label="Title"
              value={formData.title}
              onChange={handleSelectChange}
              options={titleOptions}
            />
            <FormField
              id="titleCaption"
              label="Caption"
              value={formData.titleCaption}
              onChange={handleInputChange}
              placeholder="e.g. Additional title description"
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

          {/* Gender & FOI Checkbox Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashed border-gray-200 pb-2">
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
            
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                id="freedomOfInformation"
                checked={formData.freedomOfInformation}
                onChange={handleCheckboxChange}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 border-gray-300"
              />
              Freedom of information case
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
              label="NIC. No."
              value={formData.cnic}
              onChange={handleInputChange}
              placeholder="e.g. 37401-1234567-1"
            />
            <FormField
              id="mobile"
              label="Mobile No."
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="e.g. 0325-1234567"
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

          {/* E-Mail Address & Email Caption */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="email"
              label="E-Mail Address"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
            />
            <FormField
              id="emailCaption"
              label="Caption"
              value={formData.emailCaption}
              onChange={handleInputChange}
              placeholder="Email secondary reference caption"
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

          {/* Agency Ref No */}
          <FormField
            id="agencyRefNo"
            label="Agency Ref. No"
            value={formData.agencyRefNo}
            onChange={handleInputChange}
          />

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
            rows={2.5}
          />

          {/* Value of Complaint (Citizen field placed at section end) */}
          <FormField
            id="value"
            label="Value of Complaint"
            value={formData.value}
            onChange={handleInputChange}
            type="number"
          />

        </div>

        {/* ========================================== */}
        {/* 2. AUTHORISED OFFICER DECISION SECTION     */}
        {/* ========================================== */}
        <div className="bg-white border-l-4 border-blue-600 border-t border-r border-b border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-5 bg-gradient-to-br from-white to-blue-50/20">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-[#1a5fa8] tracking-wide uppercase">
              2. Review & Decision (AO Stage)
            </h3>

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
            {/* Spec: Acknowledgement Status is a disabled textarea, slightly taller box */}
            <TextAreaField
              id="acknowledgementStatus"
              label="Acknowledgement Status"
              value={formData.acknowledgementStatus}
              disabled={true}
              rows={2}
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

          {/* Remarks (Single Textarea) */}
          <TextAreaField
            id="remarks1"
            label="Remarks"
            value={formData.remarks1}
            onChange={handleInputChange}
            rows={3}
          />

          {/* Reusable AuditTrailBlock */}
          <AuditTrailBlock entries={mockAuditEntries} />

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
