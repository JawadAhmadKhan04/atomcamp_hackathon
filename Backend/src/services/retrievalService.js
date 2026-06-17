import { supabase } from '../db/supabaseClient.js';
import { embedText } from './embeddingService.js';

// Regulations 5 (admission/rejection test) and 23 (the 26 closure grounds)
// are the universal admissibility rules applied to EVERY complaint
// regardless of topic -- they're written in formal legal language that
// often shares little vocabulary with how a citizen describes their actual
// problem (e.g. "police won't register my FIR" vs. "does not specifically
// fall within jurisdiction of the Mohtasib"), so pure semantic similarity
// can rank them too low to make a small top-N cut. Always including them
// ensures the classifier is never reasoning without the actual admissibility
// test in front of it, while semantic search still fills in whatever else
// is topically relevant on top.
const ALWAYS_INCLUDE_REGULATIONS = [5, 23];

/**
 * Retrieve the most relevant regulation chunks for a given complaint text,
 * combining a fixed set of universally-applicable regulations with
 * semantic similarity search for topically relevant ones.
 * @param {string} queryText - usually the complaint's subject + main points
 * @param {number} matchCount - how many semantically-matched chunks to add
 *   on top of the always-included ones
 * @returns {Promise<Array<{regulation_number:number,title:string,chapter:string,content:string,similarity:number}>>}
 */
export async function retrieveRelevantRegulations(queryText, matchCount = 6) {
  const queryEmbedding = await embedText(queryText);

  const [semanticResult, fixedResult] = await Promise.all([
    supabase.rpc('match_regulation_chunks', {
      query_embedding: queryEmbedding,
      match_count: matchCount,
    }),
    supabase
      .from('regulation_chunks')
      .select('regulation_number, title, chapter, content')
      .in('regulation_number', ALWAYS_INCLUDE_REGULATIONS),
  ]);

  if (semanticResult.error) {
    throw new Error(`pgvector similarity search failed: ${semanticResult.error.message}`);
  }
  if (fixedResult.error) {
    throw new Error(`fixed regulation lookup failed: ${fixedResult.error.message}`);
  }

  const semanticMatches = semanticResult.data ?? [];
  const fixedMatches = (fixedResult.data ?? []).map((r) => ({ ...r, similarity: null }));

  // de-dupe: if a fixed regulation already showed up in semantic results
  // (it sometimes will, e.g. the K-Electric case where reg 5 scored 1.0),
  // don't list it twice
  const semanticNumbers = new Set(semanticMatches.map((m) => m.regulation_number));
  const dedupedFixed = fixedMatches.filter((f) => !semanticNumbers.has(f.regulation_number));

  return [...dedupedFixed, ...semanticMatches];
}