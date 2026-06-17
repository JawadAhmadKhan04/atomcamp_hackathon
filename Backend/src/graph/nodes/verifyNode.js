/**
 * Deterministic (no LLM call) sanity check: does every regulation number the
 * classifier cited actually appear among the chunks we retrieved? Catches
 * the most common and most dangerous failure mode -- the model citing a
 * clause that sounds plausible but isn't actually in the source text it was
 * given.
 *
 * Kept as plain code rather than another LLM call: it's a simple set
 * membership check, an LLM call would just add latency and a new failure
 * mode for something verifiable with a string match.
 */
export function verifyNode(state) {
  const { admissibilityDecision, retrievedRegulations } = state;

  const issues = [];

  if (!admissibilityDecision) {
    return {
      verification: { passed: false, confidence: 'low', issues: ['No admissibility decision produced.'] },
    };
  }

  const retrievedNumbers = new Set((retrievedRegulations || []).map((r) => String(r.regulation_number)));

  for (const cited of admissibilityDecision.citedRegulations || []) {
    // citations look like "23(1)(c)" -- pull the leading number
    const match = /^(\d+)/.exec(cited.trim());
    const num = match ? match[1] : null;
    if (!num || !retrievedNumbers.has(num)) {
      issues.push(`Cited regulation "${cited}" was not among the retrieved regulation text -- likely hallucinated or mis-cited.`);
    }
  }

  if (admissibilityDecision.decision === 'uncertain') {
    issues.push('Classifier itself reported low confidence ("uncertain").');
  }

  if ((admissibilityDecision.confidence || '').toLowerCase() === 'low') {
    issues.push('Classifier self-reported low confidence.');
  }

  const passed = issues.length === 0;

  return {
    verification: {
      passed,
      confidence: passed ? 'high' : 'low',
      issues,
    },
  };
}
