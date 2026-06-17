// One-time (or re-run-safe) script that embeds the 24 pre-chunked
// regulations and upserts them into the `regulation_chunks` pgvector table.
//
// Why the chunks are pre-extracted into regulation_chunks.json rather than
// parsed from the PDF at runtime: the PDF's layout (page-footer noise,
// mid-sentence line wraps) needed manual verification to chunk correctly --
// see the chunking notes below. Re-parsing the PDF on every ingest run risks
// silently breaking the chunk boundaries if the PDF is ever swapped. If you
// need to re-chunk from a *different* PDF later, regenerate this JSON file
// first (one object per regulation: regulation_number, title, chapter,
// content) and re-run `npm run ingest`.
//
// Chunking strategy: one chunk per regulation (3-24 are the procedural
// regulations; 1-2 are short title + definitions, included for completeness
// since the LLM may need to resolve defined terms like "Authorised Officer"
// or "disposal"). Sub-clauses (a), (b), (c)... are NOT split into separate
// chunks, per your call -- this keeps each regulation's full context (e.g.
// all 26 closure grounds in regulation 23) together for the LLM, even though
// the embedding model itself will truncate very long chunks for the purpose
// of computing the similarity vector. That's fine: the embedding is only
// used to *rank* which regulations are relevant, the FULL chunk text
// (untruncated) is what actually gets sent to Grok downstream.

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { supabase } from '../db/supabaseClient.js';
import { embedText } from '../services/embeddingService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const raw = await readFile(
    path.join(__dirname, 'regulation_chunks.json'),
    'utf-8'
  );
  const chunks = JSON.parse(raw);

  console.log(`loaded ${chunks.length} regulation chunks, embedding...`);

  for (const chunk of chunks) {
    const embedding = await embedText(chunk.content);

    const { error } = await supabase.from('regulation_chunks').upsert(
      {
        regulation_number: chunk.regulation_number,
        title: chunk.title,
        chapter: chunk.chapter,
        content: chunk.content,
        embedding,
      },
      { onConflict: 'regulation_number' }
    );

    if (error) {
      console.error(`failed to upsert regulation ${chunk.regulation_number}:`, error.message);
      process.exitCode = 1;
      continue;
    }

    console.log(`  ok  reg ${String(chunk.regulation_number).padStart(2, '0')} - ${chunk.title}`);
  }

  console.log('ingestion complete.');
}

main().catch((err) => {
  console.error('ingestion failed:', err);
  process.exit(1);
});
