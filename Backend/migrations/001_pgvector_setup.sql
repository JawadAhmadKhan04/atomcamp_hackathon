-- ============================================================================
-- Migration: RAG pipeline support (pgvector regulation store + agent output
-- columns on register_complaints)
-- Run this in the Supabase SQL Editor.
-- ============================================================================

-- 1. Enable pgvector
create extension if not exists vector;

-- 2. Table holding one row per regulation (chunked 1 regulation = 1 row, per
--    your earlier decision). 384 dims because we're using the
--    all-MiniLM-L6-v2 sentence-transformer model via Transformers.js.
create table if not exists regulation_chunks (
    id serial primary key,
    regulation_number integer not null,
    title text not null,
    chapter text not null,
    content text not null,
    embedding vector(384),
    created_at timestamp with time zone default timezone('utc'::text, now())
);

create unique index if not exists regulation_chunks_regulation_number_idx
    on regulation_chunks (regulation_number);

-- ivfflat index for fast approximate nearest-neighbor search.
-- lists=24 is fine since we only have 24 rows total; for a tiny table like
-- this an index barely matters, but it's here so the pattern is correct if
-- you later add more regulation documents.
create index if not exists regulation_chunks_embedding_idx
    on regulation_chunks
    using ivfflat (embedding vector_cosine_ops)
    with (lists = 24);

-- 3. Similarity search RPC function. Supabase's JS client can't run raw
--    vector math, so we expose this as a Postgres function and call it via
--    supabase.rpc('match_regulation_chunks', {...}) from Node.
create or replace function match_regulation_chunks (
    query_embedding vector(384),
    match_count int default 5
)
returns table (
    id int,
    regulation_number int,
    title text,
    chapter text,
    content text,
    similarity float
)
language sql stable
as $$
    select
        regulation_chunks.id,
        regulation_chunks.regulation_number,
        regulation_chunks.title,
        regulation_chunks.chapter,
        regulation_chunks.content,
        1 - (regulation_chunks.embedding <=> query_embedding) as similarity
    from regulation_chunks
    order by regulation_chunks.embedding <=> query_embedding
    limit match_count;
$$;

-- 4. Columns on register_complaints to hold the agent's output. Nullable and
--    additive only — does not touch your existing schema or stub fields
--    (admissibility, reasons, remarks already exist and the agent writes
--    into those same columns for compatibility with your current UI).
alter table register_complaints
    add column if not exists ai_jurisdiction_office varchar(255),
    add column if not exists ai_cited_regulations text,
    add column if not exists ai_confidence varchar(50),
    add column if not exists ai_forward_email_draft text,
    add column if not exists ai_forward_email_to varchar(255),
    add column if not exists ai_reviewed_by_human boolean default false,
    add column if not exists ai_processed_at timestamp with time zone;
