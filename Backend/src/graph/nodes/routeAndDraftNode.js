import { callGrokJSON } from '../../services/grokClient.js';

// Regional Office names actually named in the regulation text (reg 2(p)).
// NOTE: the regulation references "the Schedule to these regulations" for
// the precise agency/territory -> office mapping (reg 3(2)), but that
// Schedule table was not included in the supplied PDF excerpt. Until you
// provide it, routing is inferred by the LLM from the complaint's
// district/city/address rather than a hardcoded lookup -- treat
// "routingDecision.office" as a suggestion for human confirmation, not an
// authoritative jurisdiction ruling.
const KNOWN_REGIONAL_OFFICES = [
  'Head Office (Islamabad)',
  'Lahore',
  'Karachi',
  'Peshawar',
  'Quetta',
  'Sukkur',
  'Multan',
  'Faisalabad',
  'Dera Ismail Khan',
];

const SYSTEM_PROMPT = `You are a routing and correspondence-drafting assistant for the Wafaqi Mohtasib Secretariat.

The complaint you are given has ALREADY been admitted for investigation. Your job has two parts:

1. ROUTING: suggest which office should handle the investigation, choosing from this list: ${KNOWN_REGIONAL_OFFICES.join(', ')}. Base this on the complainant's district/city/address if available. If you cannot determine it confidently, choose "Head Office (Islamabad)" as the safe default and say so in your justification.

2. FORWARD EMAIL: draft the notice email to the Agency's principal officer calling for their report, per regulation 12(5)-(7) (notice issued within two days, must include the complaint/grievance summary, alleged mal-administration, and relief sought; report due within fifteen days per regulation 12(8)). Use a formal, impersonal tone. Address it generically to "The Principal Officer, [Agency Name]" since you do not have a real officer directory.

Respond ONLY with this exact JSON shape, no markdown fences, no commentary:
{
  "routing": {
    "office": string,
    "justification": string
  },
  "forwardEmail": {
    "to": string,
    "subject": string,
    "body": string
  }
}`;

export async function routeAndDraftNode(state) {
  const { complaint, retrievedRegulations, admissibilityDecision } = state;

  const regulationContext = (retrievedRegulations || [])
    .map((r) => `[Regulation ${r.regulation_number} - ${r.title}]\n${r.content}`)
    .join('\n\n');

  const prompt = `RETRIEVED REGULATIONS:
${regulationContext}

ADMISSIBILITY DECISION ALREADY MADE:
${JSON.stringify(admissibilityDecision, null, 2)}

COMPLAINT DETAILS:
Complainant: ${complaint.complainantName || complaint.complainant_name || 'N/A'}
Agency complained against: ${complaint.agency || 'N/A'}
District: ${complaint.district || 'N/A'}
City: ${complaint.city || 'N/A'}
Tehsil: ${complaint.tehsil || 'N/A'}
Subject: ${complaint.subject || 'N/A'}
Main points: ${complaint.mainPoints || complaint.main_points || 'N/A'}

Produce the routing decision and forward email per your instructions.`;

  try {
    const result = await callGrokJSON({ system: SYSTEM_PROMPT, prompt, temperature: 0.2 });
    return {
      routingDecision: result.routing,
      forwardEmailDraft: result.forwardEmail,
    };
  } catch (err) {
    return {
      errors: [`routeAndDraftNode failed: ${err.message}`],
      routingDecision: {
        office: 'Head Office (Islamabad)',
        justification: 'Automated routing failed; defaulted to Head Office. Requires manual review.',
      },
      forwardEmailDraft: null,
    };
  }
}
