# MBR Hub Starter

Portable proof-of-concept for a shared Monthly Business Review workflow based on the supplied Purolator + ContactPoint360 MBR deck.

## What works now
- Montreal, Cebu and Cairo seeded Geo workspaces
- reporting-month picker
- AHT / Hold / QA entry with automatic month-over-month deltas
- People inputs: Attrition, Absences, Attendance, Productive HC
- Cebu Digital / Chat metrics
- editable Performance Summary, Key Highlights, Action Items, Roadmap and Recognition fields
- automatic draft performance-summary generation
- Draft / Submitted / Approved workflow control
- browser persistence using localStorage
- one-click `.pptx` generation through PptxGenJS
- responsive Purolator/CP360-inspired UI

## Scaffolded for the next developer
- Supabase Auth
- true simultaneous multi-user editing
- row-level security by Geo
- recognition-image upload / storage
- approval comments and audit history
- importing raw Excel/CSV KPI files
- direct Power BI integration

## Quick start
1. Install Node.js 20+.
2. Open this folder in VS Code, Cursor, Replit or another Node environment.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open `http://localhost:3000`.
5. Edit the seeded Geo data and click **Generate PowerPoint**.

No environment variables are required for demo mode.

## Enable shared access with Supabase
1. Create a Supabase project.
2. Run `supabase/schema.sql` in its SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase URL and anon key.
5. Replace the localStorage adapter in `lib/storage.ts` with Supabase reads/writes using `lib/supabase.ts`.

The database schema and RLS starter policies are already included.

## Brand / design source
The supplied deck is preserved at:
`reference/NEW MBR DECK SEPT.pptx`

Extracted brand assets are in:
`public/brand/`

Observed source-deck design details used by this starter:
- wide 16:9 / 13.333 x 7.5 layout
- Purolator red `#ED1C24` / `#D71920`
- navy `#003B7A`
- blue `#008FD3`
- green success `#16A34A`
- typography: Plus Jakarta Sans and DejaVu Sans

## Moving this somewhere else
This project can be pushed directly to GitHub and then imported into Vercel, Replit, Cursor, Bolt or another coding environment.

For Vercel:
1. Push folder to a GitHub repository.
2. Import repository into Vercel.
3. Framework preset: Next.js.
4. Build command: `next build`.
5. Add Supabase environment variables only when enabling shared mode.

## Important note
This package is a portable starter implementation of the MBR Hub specification. It is not a recovered hidden codebase from a previous build. The earlier project discussion produced the design and requirements; this package turns those requirements into actual source code.
