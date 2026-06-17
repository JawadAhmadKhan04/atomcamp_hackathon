import { supabase } from '../db/supabaseClient.js';
import { embedText } from './embeddingService.js';

/**
 * Retrieve the most relevant regulation chunks for a given complaint text.
 * @param {string} queryText - usually the complaint's subject + main points
 * @param {number} matchCount - how many regulation chunks to return
 * @returns {Promise<Array<{regulation_number:number,title:string,chapter:string,content:string,similarity:number}>>}
 */
export async function retrieveRelevantRegulations(queryText, matchCount = 6) {
  const queryEmbedding = await embedText(queryText);

  const { data, error } = await supabase.rpc('match_regulation_chunks', {
    query_embedding: queryEmbedding,
    match_count: matchCount,
  });

  if (error) {
    throw new Error(`pgvector similarity search failed: ${error.message}`);
  }

  return data ?? [];
}
