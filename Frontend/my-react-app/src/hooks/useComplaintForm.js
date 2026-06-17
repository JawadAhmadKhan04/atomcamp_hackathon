import { useState } from "react";

// Default form state for a fresh complaint
const defaultFormState = {
  complaintNumber: "",
  complaintType: "Fresh",
  title: "Mr.",
  registrationDate: "",
  complainantName: "",
  gender: "Male",
  address: "",
  district: "",
  tehsil: "",
  city: "",
  cnic: "",
  mobile: "",
  phone: "",
  fax: "",
  email: "",
  receivingOffice: "HQR",
  ntn: "",
  passport: "",
  agencyRefNo: "",
  value: 0,
  agency: "",
  department: "",
  subOffice: "",
  subject: "",
  mainPoints: "",
  
  // Review & Decision fields
  invOfficer: "Not Assigned",
  transferred: "No",
  malAdminCode: "",
  natureOfComplaint: "Select Nature",
  acknowledgementStatus: "Pending",
  admissibilityStatus: "Select",
  admissibility: "Select",
  provedMalAdministration: "",
  acknowledgementLetter: "Complaint Admitted- Documents Required at H.O",
  remarks1: "",
  remarks2: "",
  
  // Authorised Officer specific fields
  titleCaption: "",
  emailCaption: "",
  freedomOfInformation: false
};

/**
 * Custom hook to manage Wafaqi Mohtasib complaint form states.
 * It encapsulates state handling for both Registrar-I and Authorised Officer pages.
 * 
 * @returns {object} { formData, updateField, loadComplaint, resetForm }
 */
export function useComplaintForm() {
  const [formData, setFormData] = useState(defaultFormState);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const loadComplaint = (complaint) => {
    setFormData((prev) => ({
      ...prev,
      complaintNumber: complaint.complaintNumber || "",
      complaintType: complaint.complaintType || "Fresh",
      title: complaint.title || "Mr.",
      registrationDate: complaint.diaryDate || "",
      complainantName: complaint.complainantName || "",
      gender: complaint.gender || "Male",
      address: complaint.address || "",
      district: complaint.district || "",
      tehsil: complaint.tehsil || "",
      city: complaint.city || "",
      cnic: complaint.cnic || "",
      mobile: complaint.mobile || "",
      phone: complaint.phone || "",
      fax: complaint.fax || "",
      email: complaint.email || "",
      receivingOffice: complaint.receivingOffice || "HQR",
      ntn: complaint.ntn || "",
      passport: complaint.passport || "",
      agencyRefNo: complaint.agencyRefNo || "",
      value: complaint.value || 0,
      agency: complaint.agency || "",
      department: complaint.department || "",
      subOffice: complaint.subOffice || "",
      subject: complaint.subject || "",
      mainPoints: complaint.mainPoints || "",
      
      // Review details
      invOfficer: complaint.invOfficer || "Not Assigned",
      transferred: complaint.transferred || "No",
      malAdminCode: complaint.malAdminCode || "",
      natureOfComplaint: complaint.natureOfComplaint || "Select Nature",
      acknowledgementStatus: complaint.acknowledgementStatus || "Pending",
      admissibilityStatus: complaint.admissibilityStatus || "Select",
      admissibility: complaint.admissibility || "Select",
      provedMalAdministration: complaint.provedMalAdministration || "",
      acknowledgementLetter: complaint.acknowledgementLetter || "Complaint Admitted- Documents Required at H.O",
      remarks1: complaint.remarks1 || complaint.remarks || "",
      remarks2: complaint.remarks2 || "",
      
      // AO details
      titleCaption: complaint.titleCaption || "",
      emailCaption: complaint.emailCaption || "",
      freedomOfInformation: complaint.freedomOfInformation || false
    }));
  };

  const resetForm = () => {
    setFormData(defaultFormState);
  };

  return {
    formData,
    updateField,
    loadComplaint,
    resetForm,
  };
}
