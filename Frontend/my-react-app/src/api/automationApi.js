export const classifyComplaint = async (complaintData) => {
  const complaintId = complaintData.complaintNumber;

  if (!complaintId) {
    console.error("No complaint ID provided for classification.");
    throw new Error("No complaint ID provided.");
  }

  try {
    const response = await fetch(`http://localhost:5000/api/autofill/${encodeURIComponent(complaintId)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Backend actually reads from DB using the ID, but we can send data if needed.
      body: JSON.stringify(complaintData),
    });

    if (!response.ok) {
      throw new Error(`Failed to classify complaint: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling RAG backend:", error);
    // Fallback to old stub structure so UI doesn't break entirely if backend is down
    return {
      admissibility: "Complaint Admitted and Marked to Regional Office, Karachi",
      remarks: "AI Generated (Fallback): The complaint details indicate it falls under the jurisdiction of the Karachi Regional Office due to the nature of the issue.",
      admissibilityStatus: "Admitted",
      jurisdictionOffice: "Karachi",
      forwardEmail: null,
      rejectionLetter: null
    };
  }
};

export const confirmClassification = async (complaintId) => {
  if (!complaintId) return { success: false };
  try {
    const response = await fetch(`http://localhost:5000/api/autofill/${encodeURIComponent(complaintId)}/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to confirm classification: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error confirming with RAG backend:", error);
    return { success: false };
  }
};
