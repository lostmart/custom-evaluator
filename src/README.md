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

## Course reference system

A static JSON-based reference for courses, topics, exercises, and further reading. Consumed by the UI to show students what they're missing after assessment.

### File layout

```
assets/
  courses/
    index.json                  # registry of all courses
    bash-scripting/
      meta.json                 # course metadata + ordered topic list
      topics/
        arrays.json
        loops.json
        awk.json
        ...
    linux-fundamentals/
      meta.json
      topics/
        ...
    python-microservices/
      meta.json
      topics/
        ...
```

### `index.json`

Top-level list of courses:

```json
[
  { "id": "bash-scripting", "title": "Bash Scripting", "description": "..." },
  { "id": "linux-fundamentals", "title": "Linux Fundamentals", "description": "..." }
]
```

### `[course]/meta.json`

Course metadata and ordered topic list:

```json
{
  "id": "bash-scripting",
  "title": "Bash Scripting",
  "description": "...",
  "topics": [
    { "id": "arrays", "title": "Arrays" },
    { "id": "loops",  "title": "Loops" }
  ]
}
```

### `[course]/topics/[topic].json`

Atomic unit. Contains summary, key points, exercises, and external links:

```json
{
  "id": "arrays",
  "courseId": "bash-scripting",
  "title": "Arrays",
  "summary": "Short explanation of the concept.",
  "keyPoints": [
    "Point one",
    "Point two"
  ],
  "externalLinks": [
    { "label": "GNU Bash Manual — Arrays", "url": "https://www.gnu.org/software/bash/manual/bash.html#Arrays" }
  ],
  "exercises": [
    {
      "id": "arrays-ex-01",
      "type": "code",
      "difficulty": "beginner",
      "prompt": "Write a script that...",
      "hint": "Use ${arr[@]}",
      "solution": "..."
    },
    {
      "id": "arrays-ex-02",
      "type": "multiple-choice",
      "difficulty": "beginner",
      "prompt": "Which syntax prints the array length?",
      "options": ["...", "...", "...", "..."],
      "answer": "${#arr[@]}",
      "explanation": "The # prefix means length of."
    },
    {
      "id": "arrays-ex-03",
      "type": "fill-in",
      "difficulty": "intermediate",
      "prompt": "Complete the line to append 'purple' to array 'colors'.",
      "code": "colors+=( ___ )",
      "answer": "purple",
      "explanation": "+= with parentheses appends to an indexed array."
    }
  ]
}
```

### Exercise types

| `type` | Student action | Auto-graded |
|---|---|---|
| `code` | Writes a snippet, sees solution after | No |
| `multiple-choice` | Picks from options | Yes (client-side) |
| `fill-in` | Completes a partial expression | Yes (exact match) |

### Linking assessments to topics

Each question in the existing question bank files accepts two extra optional fields:

```json
{
  "topicId": "arrays",
  "courseId": "bash-scripting"
}
```

These allow the score screen to collect topics the student missed and surface the relevant reference pages as remediation.
