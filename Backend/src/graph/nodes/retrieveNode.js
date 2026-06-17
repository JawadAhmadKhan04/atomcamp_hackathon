import { retrieveRelevantRegulations } from '../../services/retrievalService.js';

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

    // TEMP DIAGNOSTIC LOGGING -- remove once retrieval quality is confirmed
    console.log('\n[retrieveNode] query text:\n', queryText);
    console.log('[retrieveNode] retrieved regulations:');
    matches.forEach((m) => {
      const simText = m.similarity === null ? 'fixed-include' : m.similarity.toFixed(4);
      console.log(`  reg ${m.regulation_number} (sim ${simText}) - ${m.title}`);
    });
    console.log('');

    return { retrievedRegulations: matches };
  } catch (err) {
    return {
      errors: [`retrieveNode failed: ${err.message}`],
      retrievedRegulations: [],
    };
  }
}