import { callGrokJSON } from '../../services/grokClient.js';

const SYSTEM_PROMPT = `You are an admissibility-classification assistant for the Wafaqi Mohtasib (Federal Ombudsman of Pakistan) complaint intake system.

Your ONLY job: decide whether a citizen's complaint should be ADMITTED for investigation or REJECTED IN LIMINE at the preliminary examination stage, strictly applying the regulation text you are given. Do not use outside knowledge of Pakistani law beyond the provided regulation excerpts.

Rules you must follow:
- Base your decision ONLY on the "RETRIEVED REGULATIONS" text provided to you. Do not invent regulation numbers, sub-clauses, or content not present in that text.
- If the complaint should be rejected, you MUST select the closure ground(s) from regulation 23(1)(a)-(z) that actually appear in the retrieved text and that genuinely match the facts. If the relevant ground is not present in the retrieved text, say so in "reasons" instead of guessing a clause number.
- If you are not confident, set "decision" to "uncertain" rather than forcing admit/reject — a human Registrar will review every case regardless.
- "citedRegulations" must be an array of strings like "5(1)" or "23(1)(c)" referencing only clauses that exist in the retrieved text.
- Write "reasons" in the plain, impersonal tone the regulations use, suitable for a Form A-I/A-II rejection letter or Form B grievance summary -- not casual language.

Respond ONLY with a JSON object matching this exact shape, no markdown fences, no commentary:
{
  "decision": "admit" | "reject" | "uncertain",
  "citedRegulations": string[],
  "reasons": string,
  "confidence": "high" | "medium" | "low"
}`;

export async function classifyNode(state) {
  const { complaint, retrievedRegulations } = state;

  if (!retrievedRegulations || retrievedRegulations.length === 0) {
    return {
      admissibilityDecision: {
        decision: 'uncertain',
        citedRegulations: [],
        reasons: 'No regulation text was retrieved; cannot ground a decision. Requires manual review.',
        confidence: 'low',
      },
    };
  }

  const regulationContext = retrievedRegulations
    .map((r) => `[Regulation ${r.regulation_number} - ${r.title}]\n${r.content}`)
    .join('\n\n');

  const prompt = `RETRIEVED REGULATIONS:
${regulationContext}

COMPLAINT DETAILS:
Complainant: ${complaint.complainantName || complaint.complainant_name || 'N/A'}
Agency complained against: ${complaint.agency || 'N/A'}
Subject: ${complaint.subject || 'N/A'}
Main points: ${complaint.mainPoints || complaint.main_points || 'N/A'}
Nature of complaint: ${complaint.natureOfComplaint || complaint.nature_of_complaint || 'N/A'}

Decide admissibility per the rules in your system prompt.`;

  try {
    const result = await callGrokJSON({ system: SYSTEM_PROMPT, prompt, temperature: 0.1 });
    return { admissibilityDecision: result };
  } catch (err) {
    return {
      errors: [`classifyNode failed: ${err.message}`],
      admissibilityDecision: {
        decision: 'uncertain',
        citedRegulations: [],
        reasons: 'Automated classification failed; requires manual review.',
        confidence: 'low',
      },
    };
  }
}
