# Assessment Platform — App

Next.js application (App Router). Deployed on Render.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev     # Dev server
npm run build   # Production build (includes type check)
npm run lint    # ESLint
```

## Data

SQLite database at `data/evaluator.db`. Created automatically on first run.

> **Note:** Render's filesystem is ephemeral — the database is wiped on each redeploy unless a Persistent Disk is attached.

## Question sets

Question banks live in `src/assets/`:

| File | Set |
|---|---|
| `data.json` | Bash Scripting |
| `data-set2.json` | Linux Commands |
| `microservicesPythonQuestions.json` | Microservices with Python |

## Admin

Password-protected at `/admin`. Credentials are set via environment variables.
