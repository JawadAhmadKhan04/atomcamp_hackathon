import { retrieveRelevantRegulations } from '../../services/retrievalService.js';

/**
 * Builds a retrieval query from the complaint's substantive fields and
 * fetches the most relevant regulation chunks from pgvector.
 *
 * Uses subject + main_points + nature-relevant fields rather than the whole
 * row (CNIC, phone, etc. add noise to the embedding without adding meaning).
 */
export async function retrieveNode(state) {
  const { complaint } = state;

  const queryText = [
    complaint.subject,
    complaint.mainPoints || complaint.main_points,
    complaint.agency ? `Agency: ${complaint.agency}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  if (!queryText.trim()) {
    return {
      errors: ['retrieveNode: complaint has no subject/mainPoints text to embed'],
      retrievedRegulations: [],
    };
  }

  try {
    const matches = await retrieveRelevantRegulations(queryText, 6);
    return { retrievedRegulations: matches };
  } catch (err) {
    return {
      errors: [`retrieveNode failed: ${err.message}`],
      retrievedRegulations: [],
    };
  }
}
