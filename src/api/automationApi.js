export const classifyComplaint = async (complaintData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        admissibility: "Complaint Admitted and Marked to Regional Office, Karachi",
        reasons: "AI Generated: The complaint details indicate it falls under the jurisdiction of the Karachi Regional Office due to the nature of the issue.",
        status: "In Progress"
      });
    }, 2000);
  });
};
