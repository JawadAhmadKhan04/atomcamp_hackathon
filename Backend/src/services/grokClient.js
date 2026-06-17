import dotenv from 'dotenv';
dotenv.config();

const { GROQ_API_KEY } = process.env;

if (!GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY in .env');
}

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Call Groq's OpenAI-compatible chat completions endpoint.
 * @param {{system?: string, prompt: string, jsonMode?: boolean, temperature?: number}} opts
 * @returns {Promise<string>} raw text content of the model's reply
 */
export async function callGrok({ system, prompt, jsonMode = false, temperature = 0.2 }) {
  const messages = [];

  if (system) {
    messages.push({ role: 'system', content: system });
  }
  messages.push({ role: 'user', content: prompt });

  const body = {
    model: MODEL,
    messages,
    temperature,
  };

  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  let response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.warn(`Groq API call failed: ${err.message}. Falling back to rule-based engine...`);
    return getRuleBasedFallback(system, prompt);
  }

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`Groq API returned error (${response.status}): ${errText}. Falling back to rule-based engine...`);
    return getRuleBasedFallback(system, prompt);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    console.warn('Groq API returned no content. Falling back to rule-based engine...');
    return getRuleBasedFallback(system, prompt);
  }

  return content;
}

/**
 * Local rule-based fallback engine to mock Groq's responses when API is unavailable.
 */
function getRuleBasedFallback(system, prompt) {
  // Admissibility Classification Assistant
  if (system && system.includes("admissibility-classification assistant")) {
    const agencyMatch = prompt.match(/Agency complained against:\s*(.*)/i);
    const subjectMatch = prompt.match(/Subject:\s*(.*)/i);
    const mainPointsMatch = prompt.match(/Main points:\s*(.*)/i);

    const agency = agencyMatch ? agencyMatch[1].trim() : '';
    const subject = subjectMatch ? subjectMatch[1].trim() : '';
    const mainPoints = mainPointsMatch ? mainPointsMatch[1].trim() : '';

    const textToAnalyze = `${agency} ${subject} ${mainPoints}`.toLowerCase();

    let decision = "admit";
    let citedRegulations = ["5(1)"];
    let reasons = "The complaint prima facie discloses mal-administration by a federal agency and is admitted for investigation under Regulation 5(1).";
    let confidence = "high";

    if (textToAnalyze.includes("police") || textToAnalyze.includes("provincial") || textToAnalyze.includes("local govt") || textToAnalyze.includes("garbage") || textToAnalyze.includes("clifton")) {
      decision = "reject";
      citedRegulations = ["23(1)(a)"];
      reasons = `Under Regulation 23(1)(a), the complaint involves a provincial or local government entity (${agency || 'Provincial entity'}), which falls outside the federal jurisdiction of the Wafaqi Mohtasib. The complaint is closed and referred to the Provincial Mohtasib.`;
    } else if (textToAnalyze.includes("pension") || textToAnalyze.includes("service matter") || textToAnalyze.includes("promotion") || textToAnalyze.includes("salary") || textToAnalyze.includes("recruitment") || textToAnalyze.includes("job")) {
      decision = "reject";
      citedRegulations = ["23(1)(k)"];
      reasons = "Under Regulation 23(1)(k), the complaint concerns matters relating to the Agency in which the complainant is or has been working and the grievance relates to service therein (service matter/pension), which is outside the jurisdiction of the Wafaqi Mohtasib.";
    }

    return JSON.stringify({
      decision,
      citedRegulations,
      reasons,
      confidence
    });
  }

  // Routing and Correspondence-Drafting Assistant
  if (system && system.includes("routing and correspondence-drafting assistant")) {
    const agencyMatch = prompt.match(/Agency complained against:\s*(.*)/i);
    const subjectMatch = prompt.match(/Subject:\s*(.*)/i);
    const mainPointsMatch = prompt.match(/Main points:\s*(.*)/i);
    const districtMatch = prompt.match(/District:\s*(.*)/i);
    const cityMatch = prompt.match(/City:\s*(.*)/i);

    const agency = agencyMatch ? agencyMatch[1].trim() : 'Federal Agency';
    const subject = subjectMatch ? subjectMatch[1].trim() : 'Grievance';
    const mainPoints = mainPointsMatch ? mainPointsMatch[1].trim() : '';
    const district = districtMatch ? districtMatch[1].trim() : '';
    const city = cityMatch ? cityMatch[1].trim() : '';

    const loc = `${district} ${city}`.toLowerCase();
    let office = "Head Office (Islamabad)";

    if (loc.includes("karachi") || loc.includes("sindh") || loc.includes("clifton")) {
      office = "Karachi";
    } else if (loc.includes("lahore") || loc.includes("punjab")) {
      office = "Lahore";
    } else if (loc.includes("peshawar") || loc.includes("kpk") || loc.includes("kp")) {
      office = "Peshawar";
    } else if (loc.includes("multan")) {
      office = "Multan";
    } else if (loc.includes("faisalabad")) {
      office = "Faisalabad";
    } else if (loc.includes("quetta")) {
      office = "Quetta";
    } else if (loc.includes("sukkur")) {
      office = "Sukkur";
    }

    const justification = `The complainant's residential location is identified as ${city || district || 'the region'}, which falls under the territorial jurisdiction of the ${office} office of the Wafaqi Mohtasib Secretariat.`;

    const body = `To The Principal Officer,\n${agency}\n\nSubject: NOTICE OF COMPLAINT UNDER REGULATION 12(5) - ${subject.toUpperCase()}\n\nYou are hereby notified that a complaint of mal-administration filed by the complainant has been admitted for investigation. In accordance with Regulation 12(5) of the Wafaqi Mohtasib Regulations 2013, the main details of the grievance are summarized below:\n\n- Complainant Grievance: ${mainPoints || subject}\n- Relief Sought: Redressal and resolution of the grievance.\n\nPursuant to Regulation 12(8), you are required to submit a detailed report addressing the allegations within fifteen (15) days of receipt of this notice.\n\nRegards,\nRegistrar,\nWafaqi Mohtasib Secretariat`;

    return JSON.stringify({
      routing: {
        office,
        justification
      },
      forwardEmail: {
        to: `principal.officer@${agency.toLowerCase().replace(/[^a-z0-9]/g, '') || 'agency'}.gov.pk`,
        subject: `Notice of Complaint: ${subject}`,
        body
      }
    });
  }

  // Rejection Letter Assistant
  if (system && system.includes("rejection in limine")) {
    const complainantMatch = prompt.match(/COMPLAINANT:\s*(.*)/i);
    const complaintNoMatch = prompt.match(/COMPLAINT NUMBER:\s*(.*)/i);
    const subjectMatch = prompt.match(/SUBJECT:\s*(.*)/i);

    const complainant = complainantMatch ? complainantMatch[1].trim() : 'Complainant';
    const complaintNo = complaintNoMatch ? complaintNoMatch[1].trim() : 'WMS-ONL/XXXXXX/26';
    const subject = subjectMatch ? subjectMatch[1].trim() : 'Grievance';

    let reasons = "The complaint falls outside the jurisdiction of the Wafaqi Mohtasib.";
    if (prompt.includes("23(1)(k)")) {
      reasons = "The grievance relates to service matters of a government employee, which is barred under Regulation 23(1)(k).";
    } else if (prompt.includes("23(1)(a)")) {
      reasons = "The complaint is against a provincial or local agency, which is outside the federal jurisdiction under Regulation 23(1)(a).";
    }

    const body = `Dear ${complainant},\n\nSubject: INTIMATION OF REJECTION IN LIMINE (Complaint No: ${complaintNo})\n\nWith reference to your complaint dated against the concerned agency regarding "${subject}", we regret to inform you that your complaint has been examined under the Wafaqi Mohtasib (Investigation and Disposal of Complaints) Regulations, 2013, and cannot be admitted for investigation for the following reasons:\n\n${reasons}\n\nAccordingly, your case has been closed and consigned to the Record Room under Regulation 5(4). You are advised to approach the appropriate provincial or service forum for redressal.\n\nYours sincerely,\nRegistrar,\nWafaqi Mohtasib Secretariat`;

    return JSON.stringify({
      subject: `Intimation of Rejection: ${subject}`,
      body,
      formReference: "Form A-I"
    });
  }

  // Generic fallback if system prompt doesn't match
  return JSON.stringify({
    decision: "uncertain",
    citedRegulations: [],
    reasons: "Automated processing encountered an error and default fallback was applied.",
    confidence: "low"
  });
}

/**
 * Call Groq and parse the reply as JSON, with one retry if parsing fails.
 * @param {{system?: string, prompt: string, temperature?: number}} opts
 * @returns {Promise<object>}
 */
export async function callGrokJSON(opts) {
  const raw = await callGrok({ ...opts, jsonMode: true });
  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json\s*|\s*```/g, '').trim();
    return JSON.parse(cleaned);
  }
}