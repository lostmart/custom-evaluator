# Assessment Platform

A custom assessment platform built for EPITA's Bachelor of Computer Science program. Designed to replace Google Forms for diagnostic and summative evaluations, with support for code input questions, enforced linear navigation, and full data ownership.

## Why this exists

Off-the-shelf tools like Google Forms don't support code input questions, don't enforce navigation order, and store data on third-party platforms. This project gives full control over question types, UX, and submission data — while keeping things simple enough to ship fast.

The platform is intentionally low-stakes: assessments are framed as calibration exercises, not exams. Students are told upfront that results are used to tailor the program, not to grade them.

## Repo structure

```
docs/        # Project documentation
src/         # Next.js application
```

## docs/

| File | Description |
|---|---|
| `rationale.md` | Full project rationale — problem statement, MVP scope, tech stack decisions, anti-cheat roadmap, and versioned feature plan |
| `images/` | Design references used to build the UI (colour palette, question screen mockups) |

## src/

The Next.js application. See `src/README.md` for how to run it locally.

## Course endpoints

Each course exposes three pages. Replace `{course}` with one of the course IDs listed below.

| Route | Description |
|---|---|
| `/{course}` | Landing page — student identifies with their `@epita.fr` email, then chooses study or quiz |
| `/{course}/study` | Study mode — browse topics, read summaries, work through exercises at your own pace |
| `/{course}/quiz` | Assessment mode — randomised questions, linear flow, one submission per student |

### Available courses

| Course ID | Title |
|---|---|
| `bash-scripting` | Bash Scripting |
| `linux-fundamentals` | Linux Fundamentals |
| `modern-js` | Front-End Frameworks (Modern JS) |
| `python-microservices` | Python Microservices |
| `typescript-react` | TypeScript for React |

### API routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/student` | `POST` | Verify student email against the roster |
| `/api/auth/login` | `POST` | Admin login |
| `/api/auth/logout` | `POST` | Admin logout |
| `/api/events` | `GET` | List all quiz submission events (admin) |
| `/api/events/[id]` | `GET` `DELETE` | Get or delete a single event (admin) |
| `/api/check-submission` | `GET` | Check if an email has already submitted for a given sheet (`?email=&sheetName=`) |
| `/api/study-submit` | `POST` | Record a study exercise attempt |
| `/api/track` | `POST` | Track a page-level event |

### Google Apps Script — required change to `handleStudySubmission`

The double-submit check POSTs to `ROSTER_URL` with `{ sheetName, email, checkOnly: true }`. Add the following branch to `handleStudySubmission` **before** the `appendRow` call:

```javascript
function handleStudySubmission(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = data.sheetName;

  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["Date", "Email", "Assessment"]);
    sheet.setFrozenRows(1);
  }

  const email = data.email?.trim().toLowerCase();
  const existing = sheet.getRange("B:B").getValues().flat()
    .map(e => e.toString().trim().toLowerCase());

  // ── ADD THIS BLOCK ──────────────────────────────────────────────────────────
  if (data.checkOnly) {
    return ContentService
      .createTextOutput(JSON.stringify({ submitted: existing.includes(email) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  // ───────────────────────────────────────────────────────────────────────────

  if (existing.includes(email)) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Already submitted" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([data.submittedAt, data.email, data.courseTitle]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

> If the check fails (network error or GAS error), the platform **fails open** — the student is allowed through rather than being silently blocked.

## Roadmap

| Version | Focus |
|---|---|
| v1 | Multiple choice + code input, SQLite storage, linear flow, score screen, admin view |
| v2 | Blur detection, copy-paste blocking, basic anti-cheat |
| v3 | AI-assisted grading for code submissions |
| v4 | Teacher dashboard, Google Sheets integration, student history |
