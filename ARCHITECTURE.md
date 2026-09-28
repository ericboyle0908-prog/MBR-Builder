# MBR Hub Architecture

## POC mode
The starter runs immediately without a backend. Geo data is stored in browser `localStorage`. This makes it easy to demo on a laptop or deploy a front-end preview without configuring accounts first.

## Shared mode
For true multi-user access, connect Supabase using `.env.local` and apply `supabase/schema.sql`.

Recommended role model:
- `geo_poc`: edit only assigned Geo; save and submit.
- `mbr_owner`: edit/review all Geos; approve; generate final deck.
- `viewer`: read-only.

## Data model
`mbr_periods` -> one reporting month.
`geo_submissions` -> one Geo submission per period.
Metrics are stored as JSONB so new LOB-specific sections can be added without a schema migration every month.

## PowerPoint generation
`app/api/export/route.ts` uses PptxGenJS and recreates the visual system from the supplied MBR deck:
- 13.333 x 7.5 wide slides
- Purolator red / navy / blue palette
- Plus Jakarta Sans / DejaVu Sans typography
- clean white dashboard cards
- title slide, one Geo slide per submission, and Q&A slide

The original source deck is preserved in `/reference` for developers who want pixel-level template cloning later.
