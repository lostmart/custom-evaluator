# Local Data — better-sqlite3

better-sqlite3 added as the storage layer (replaces JSON files and Power Automate webhook sink).

## Setup

1. Install packages:
   ```bash
   npm install better-sqlite3
   npm install -D @types/better-sqlite3
   ```

2. Add to `next.config.ts` so Next.js doesn't try to bundle the native `.node` binary:
   ```ts
   serverExternalPackages: ['better-sqlite3']
   ```

3. Create a DB singleton at `src/lib/db.ts`:
   - Open with `new Database(path)` — creates the file if it doesn't exist
   - Run `CREATE TABLE IF NOT EXISTS` statements immediately after (schema init on startup)
   - Export the `db` instance for use in API routes
   - DB file path: `./data/evaluator.db` (relative to `src/` where `npm run dev` runs)

## Tables

**`events`** — tracks in-progress activity (replaces Power Automate webhook):
- `id` INTEGER PRIMARY KEY
- `timestamp` TEXT
- `email` TEXT
- `name` TEXT
- `event` TEXT (`started` | `question_answered` | `completed`)
- `detail` TEXT

**`submissions`** — final answers on completion:
- `id` INTEGER PRIMARY KEY
- `submitted_at` TEXT
- `email` TEXT
- `name` TEXT
- `answers` TEXT (JSON blob)
- `score` INTEGER

## API routes

- `src/app/api/track/route.ts` → insert into `events` table (keep or drop the Power Automate forward)
- `src/app/api/submit/route.ts` → insert into `submissions`, check for duplicate email first

## Key gotchas

- **better-sqlite3 is synchronous** — no `await`, just direct calls. This is intentional and fine for this use case.
- The `.db` file path: if CWD when running `npm run dev` is `src/`, then `./data/evaluator.db` puts it at `src/data/`. Use `fs.mkdirSync('data', { recursive: true })` before opening the DB.
- Don't import `db.ts` in any client component — only in API routes or server components.
