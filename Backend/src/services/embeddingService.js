// Local, free, no-API-key embedding model via Transformers.js.
// all-MiniLM-L6-v2 -> 384-dim vectors, matches the `vector(384)` column
// in migrations/001_pgvector_setup.sql.
//
// First call downloads the model (~30MB) and caches it under
// node_modules/@xenova/transformers/.cache — subsequent calls are fast and
// fully offline.

import { pipeline } from '@xenova/transformers';

let embedderPromise = null;

function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedderPromise;
}

/**
 * Embed a single string into a 384-dim vector.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function embedText(text) {
  const embedder = await getEmbedder();
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

/**
 * Embed multiple strings. Sequential, not batched in parallel, on purpose —
 * keeps memory bounded on modest hardware (this is a hackathon box, not a
 * GPU server) and 24-ish regulation chunks finishes in a couple seconds
 * either way.
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export async function embedBatch(texts) {
  const results = [];
  for (const text of texts) {
    results.push(await embedText(text));
  }
  return results;
}
