const baseOptions = [
  "Select",
  "Case Admitted for Investigation at Head Office",
  "Complaint Admitted and Marked to Regional Office, Karachi",
  "Complaint Admitted and Marked to Regional Office, Lahore",
  "Complaint Admitted and Marked to Regional Office, Peshawar",
  "Complaint Admitted and Marked to Regional Office, Quetta",
  "Complaint Admitted and Marked to Regional Office, Multan",
  "Complaint Admitted and Marked to Regional Office, Sukkur",
  "Complaint Admitted and Marked to Regional Office, Faisalabad",
  "Complaint Admitted and Marked to Regional Office, Dera Ismail Khan",
  "Complaint Admitted and Marked to Regional Office, Malakand-Swat",
  "Provincial Matter:- Transferred to the Sectt. of Provincial Mohtasib Balochistan",
  "Provincial Matter:- Transferred to the Sectt. of Provincial Mohtasib Sindh",
  "Provincial Matter:-Transferred to the Sectt. Mohtasib A J & Kashmir",
  "Provincial Matter:- Transferred to the Sectt. of Provincial Mohtasib Punjab",
  "Provincial Matter:- Transferred to the Sectt. of Provincial Mohtasib Khyber Pukhtun Khawa(KPK)",
  "Not Admitted Outside Jurisdiction - Private Matter",
  "Not Admitted Outside Jurisdiction - Adjudicated Matter",
  "Not Admitted - Referred to Foreign Affairs",
  "Not Admitted Outside Jurisdiction - Defence Matter",
  "Not Admitted Outside Jurisdiction - Service Matter",
  "Not Admitted - Anonymous",
  "Not Admitted - Not Against any Federal Agency",
  "Not Admitted:- Outside Jurisdiction - Supreme Court/High Court",
  "Not Admitted - Matter Relate to Recruitment Policy of Federal Public Service Commission [FPSC])",
  "Not Admitted - Contractual Matter",
  "Not Admitted - Time Barred",
  "Not Admitted - Unsigned & Unverified",
  "Not Admitted - Not Addressed to Wafaqi Mohtasib",
  "Not Admitted - Complainant not Aggrieved Person",
  "Not Admitted- General in Nature/Request",
  "Not Admitted - Referred to Woman Ombudsperson for Harassment",
  "Not Admitted - Not a Proper Complaint",
  "Not Admitted - Premature complaint-May Await Action by The Concerned Authorities",
  "Not Admitted - May Approach Allama Iqbal Unversity First in writing for 30 days",
  "Tax Matter: Transferred to Federal Tax Ombudsman Secretariat, Islamabad",
  "Banking Matter:-Transferred to the Banking Mohtasib Karachi",
  "Insurance Matter:- Transferred to the Insurance Mohtasib Karachi",
  "Not Admitted: Referred to the Concerned Department/Agency directly",
  "Complaint Admitted and Marked to:Head Office Islamabad",
  "Not Admitted- review is not allowed",
  "Not Admitted- Sub-judice Matter"
];

const cities = [
  "Karachi", "Lahore", "Peshawar", "Quetta", "Multan", "Sukkur", "Faisalabad",
  "Dera Ismail Khan", "Malakand-Swat", "Hyderabad", "Hub", "Gujranwala",
  "Bahawalpur", "Abbottabad", "Kharan", "Sargodha", "DG Khan"
];

const regionalOptions = [];
cities.forEach(city => {
  regionalOptions.push(`Case Admitted for Investigation at Regional Office, ${city}`);
  regionalOptions.push(`Complaint Admitted and Marked to Regional Office, ${city}`);
});

const tailOptions = [
  "Not Admitted - Gas Utiliy out of Juridiction by President",
  "Not Admitted -Elctricity Punjab out of Juridiction by LHC",
  "Not Admitted - above Rs.100,000/ Referred to NEPRA",
  "Not Admitted - above Rs.100,000/ Referred to OGRA",
  "Not Admitted-Outside Jurisdiction, Complaint Relating to Right of Information Act, 2017",
  "Your complaint is reffered to Implementation Wing for Implementation",
  "Not Admitted - Already Registered Complaint being Dealt with at Wafaqi Mohtasib Secretariat",
  "Complaint Admitted for Informal Resolution of Dispute (IRD) under Article 33",
  "Not Admitted - Informal Resolution under Article 33 not possible",
  "Complaint IRD profile under Article 33 has been changed to Normal",
  "Case Admitted for Investigation at Collection Center, Wana",
  "Complaint Admitted and Marked to Collection Center, Wana",
  "Case Admitted for Investigation at Collection Center, Sadda, Kurram District",
  "Complaint Admitted and Marked to Collection Center, Sadda, Kurram District",
  "Not Admitted- Fake Complaint",
  "Case Admitted for Investigation at Collection Center, Loralai",
  "Complaint Admitted and Marked to Collection Center, Loralai",
  "Case Admitted for Investigation at Collection Center, Sibbi",
  "Complaint Admitted and Marked to Collection Center, Sibbi"
];

export const admissibilityOptions = [
  ...baseOptions,
  ...regionalOptions,
  ...tailOptions
];
