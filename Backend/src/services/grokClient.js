import dotenv from 'dotenv';
dotenv.config();

const { GEMINI_API_KEY } = process.env;

if (!GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY in .env');
}

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Call Gemini's native generateContent endpoint.
 * @param {{system?: string, prompt: string, jsonMode?: boolean, temperature?: number}} opts
 * @returns {Promise<string>} raw text content of the model's reply
 */
export async function callGrok({ system, prompt, jsonMode = false, temperature = 0.2 }) {
  const contents = [];

  // Gemini uses a different format: system instruction is separate
  const systemInstruction = system ? { parts: [{ text: system }] } : undefined;

  contents.push({
    role: 'user',
    parts: [{ text: prompt }],
  });

  const body = {
    contents,
    generationConfig: {
      temperature,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = systemInstruction;
  }

  if (jsonMode) {
    body.generationConfig.responseMimeType = 'application/json';
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('Gemini API returned no content: ' + JSON.stringify(data));
  }

  return content;
}

/**
 * Call Gemini and parse the reply as JSON, with one retry if parsing fails.
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
