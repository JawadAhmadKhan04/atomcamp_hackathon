import { callGrokJSON } from '../../services/grokClient.js';

const SYSTEM_PROMPT = `You are a correspondence-drafting assistant for the Wafaqi Mohtasib Secretariat.

The complaint you are given has been REJECTED IN LIMINE at the preliminary stage per regulation 5(2). Draft the intimation letter informing the complainant of the rejection, per Form A-I (English) format. Be plain, impersonal, and reference the specific regulation/ground cited in the admissibility decision you're given. Do not invent grounds not present in that decision.

Respond ONLY with this exact JSON shape, no markdown fences, no commentary:
{
  "subject": string,
  "body": string,
  "formReference": "Form A-I"
}`;

export async function draftRejectionNode(state) {
  const { complaint, admissibilityDecision } = state;

  const prompt = `ADMISSIBILITY DECISION:
${JSON.stringify(admissibilityDecision, null, 2)}

COMPLAINANT: ${complaint.complainantName || complaint.complainant_name || 'N/A'}
COMPLAINT NUMBER: ${complaint.complaintNumber || complaint.complaint_number || 'N/A'}
SUBJECT: ${complaint.subject || 'N/A'}

Draft the rejection intimation letter per your instructions.`;

  try {
    const result = await callGrokJSON({ system: SYSTEM_PROMPT, prompt, temperature: 0.2 });
    return { rejectionLetterDraft: result };
  } catch (err) {
    return {
      errors: [`draftRejectionNode failed: ${err.message}`],
      rejectionLetterDraft: null,
    };
  }
}
