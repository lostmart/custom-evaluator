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

## Roadmap

| Version | Focus |
|---|---|
| v1 | Multiple choice + code input, SQLite storage, linear flow, score screen, admin view |
| v2 | Blur detection, copy-paste blocking, basic anti-cheat |
| v3 | AI-assisted grading for code submissions |
| v4 | Teacher dashboard, Google Sheets integration, student history |
