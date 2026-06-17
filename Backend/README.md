# RAG + LangGraph Backend — Autofill Agent

This is the backend for the "Autofill" button: a RAG pipeline grounded in
`disposal_regulation.pdf` (the Wafaqi Mohtasib Investigation and Disposal of
Complaints Regulations, 2013), orchestrated as a LangGraph agent, using Grok
(x.ai) as the LLM.

## What it does

For a given complaint, the agent:
1. **Retrieves** the most relevant regulation clauses from a pgvector store (embedded locally, no API key needed for embeddings).
2. **Classifies** admissibility (admit / reject-in-limine / uncertain), citing only regulation clauses that were actually retrieved.
3. **Branches**:
   - If admitted → suggests a Regional Office for jurisdiction and drafts the forward notice email to the Agency (regulation 12).
   - If rejected → drafts the rejection intimation letter (Form A-I, regulation 5(2)/24).
   - If uncertain → skips both, goes straight to human review.
4. **Verifies** its own output deterministically (checks cited regulation numbers actually exist in the retrieved text) and flags low-confidence results.

The agent does **not** auto-send the forward email. It returns a draft for
the official to review in the existing purple Autofill banner UI; clicking
"Save" calls `/api/autofill/:id/confirm`, which persists the result and
marks it human-reviewed. Actual email dispatch (SMTP/SendGrid) is left as a
deliberate `TODO` in `autofillRoutes.js` — wire it in once you trust the
agent's output, since the regulations themselves require Mohtasib approval
before action is taken on a complaint (regs 23-24).

## Why this design

- **One chunk per regulation** (not per sub-clause): regulation 23 alone has
  26 closure grounds (a)-(z) that need to stay together as context for the
  LLM, even though the embedding model truncates very long text for
  *ranking* purposes. The full untruncated chunk is always what's sent to
  Grok — truncation only affects which chunks get retrieved, not what the
  LLM sees once retrieved.
- **LangGraph, not a flat chain**: the admit/reject paths are genuinely
  different downstream workflows (route+email vs. rejection letter), and
  conditional edges handle that branch cleanly. A verify step is wired in as
  a cheap deterministic check; if you want a smarter LLM-based verifier
  later (e.g. one that can loop back to re-retrieve), this graph structure
  already supports adding that as another conditional edge.
- **Local embeddings (Transformers.js / all-MiniLM-L6-v2)**: free, no API
  key, runs in the same Node runtime as the rest of your stack — no Python
  microservice needed.

## Known gap: the territorial jurisdiction Schedule

Regulation 3(2) refers to "the Schedule to these regulations" for the
precise mapping of agencies/territories to Regional Offices. That Schedule
table was **not included** in the 8-page `disposal_regulation.pdf` you
uploaded — only the Regional Office names themselves are mentioned
(regulation 2(p): Lahore, Karachi, Peshawar, Quetta, Sukkur, Multan,
Faisalabad, Dera Ismail Khan).

Because of this, `routeAndDraftNode.js` has the LLM **infer** likely
jurisdiction from the complainant's district/city, not look it up
authoritatively. Treat `routingDecision.office` as a *suggestion* for the
human reviewer to confirm, not a citable jurisdictional ruling. If you can
get the actual Schedule (it may be in a fuller version of the regulations
PDF, or in CMIS documentation), add it as a lookup table and the routing
node can be made deterministic.

## Setup

### 1. Run the database migration
In your Supabase project's SQL Editor, run `migrations/001_pgvector_setup.sql`.
This enables `pgvector`, creates the `regulation_chunks` table + similarity
search RPC function, and adds new (nullable, additive-only) columns to your
existing `register_complaints` table for the agent's routing/email output.
It does not touch your existing columns or data.

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Fill in:
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — **service role key**, not
  the anon key your frontend uses. This backend bypasses RLS to write
  AI-generated fields and manage the regulation store. Find it in Supabase
  dashboard → Project Settings → API → `service_role` secret.
- `GROK_API_KEY` — your x.ai key.
- `GROK_MODEL` — defaults to `grok-2-latest`; change if you're targeting a
  different Grok model.

### 4. Ingest the regulations (one-time, re-run-safe)
```bash
npm run ingest
```
This embeds the 24 pre-chunked regulations (`src/ingestion/regulation_chunks.json`,
already extracted and verified from your PDF) and upserts them into
`regulation_chunks`. First run downloads the embedding model (~30MB,
cached after that). Re-running is safe — it upserts on `regulation_number`,
so it won't create duplicates.

### 5. Start the server
```bash
npm start
```
Runs on `http://localhost:5000` by default. Health check: `GET /health`.

## API

### `POST /api/autofill/:complaintId`
Runs the full agent against the complaint row in `register_complaints`.
Returns:
```json
{
  "admissibility": "Admitted" | "Rejected" | "Pending Manual Review",
  "admissibilityStatus": "admit" | "reject" | "uncertain",
  "remarks": "...",
  "citedRegulations": ["5(1)"],
  "confidence": "high" | "medium" | "low",
  "jurisdictionOffice": "Karachi" | null,
  "jurisdictionJustification": "...",
  "forwardEmail": { "to": "...", "subject": "...", "body": "..." } | null,
  "rejectionLetter": { "subject": "...", "body": "...", "formReference": "Form A-I" } | null,
  "verification": { "passed": true, "confidence": "high", "issues": [] },
  "requiresHumanReview": false,
  "errors": []
}
```
Wire this into your existing `classifyComplaint()` stub in
`src/api/automationApi.js` on the frontend — same trigger point (the
Autofill button), same general shape, with extra fields for the
jurisdiction/email features.

### `POST /api/autofill/:complaintId/confirm`
Called when the official clicks "Save" after reviewing. Persists the
reviewed fields and marks `ai_reviewed_by_human = true`. Does not send the
email (see TODO in the route file).

## Project structure
```
backend/
├── migrations/
│   └── 001_pgvector_setup.sql       # run this first, in Supabase SQL editor
├── src/
│   ├── db/
│   │   └── supabaseClient.js        # service-role Supabase client
│   ├── services/
│   │   ├── embeddingService.js      # local Transformers.js embeddings
│   │   ├── retrievalService.js      # pgvector similarity search
│   │   └── grokClient.js            # Grok (x.ai) chat completion wrapper
│   ├── ingestion/
│   │   ├── regulation_chunks.json   # pre-extracted, verified regulation text
│   │   └── ingestRegulations.js     # embeds + upserts the above into pgvector
│   ├── graph/
│   │   ├── state.js                 # LangGraph state schema
│   │   ├── complaintGraph.js        # graph wiring + conditional branching
│   │   └── nodes/
│   │       ├── retrieveNode.js
│   │       ├── classifyNode.js
│   │       ├── routeAndDraftNode.js
│   │       ├── draftRejectionNode.js
│   │       └── verifyNode.js
│   ├── routes/
│   │   └── autofillRoutes.js        # Express routes the frontend calls
│   └── server.js                    # Express entry point
├── .env.example
└── package.json
```

## A note on `sharp`

`@xenova/transformers` (the embedding library) has a hard dependency on
`sharp` for image preprocessing, even though we only use its text embedding
pipeline. `npm install` will download a prebuilt `sharp` binary for your
platform automatically — this is normal and requires no action from you. If
you're ever on a heavily firewalled network and `npm install` fails
specifically on `sharp`, you can run `npm install --ignore-scripts` to skip
its native build step; the text-embedding pipeline used here never actually
calls `sharp`'s image functions, only imports the module.
