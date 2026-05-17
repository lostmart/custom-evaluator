# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Custom assessment platform for EPITA's BSc Computer Science program. Replaces Google Forms for diagnostic and summative evaluations, with support for code input questions, enforced linear navigation, and full data ownership.

This project is in early implementation. The rationale and architecture are documented in `docs/rationale.md`.

## Tech Stack

- **Framework**: Next.js (App Router) — full-stack, single repo
- **UI**: shadcn/ui with Tailwind CSS
- **Language**: TypeScript
- **Data storage**: Server-side JSON files (no database for MVP)
- **Question source**: JSON file

## Commands

Once initialized:

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
```

To run a single test (once Jest/Vitest is configured):

```bash
npx jest path/to/test.test.ts
```

## Architecture

**Data flow (MVP)**:

1. Start page → load questions from `data/questions.json` (shuffled order)
2. One question per page, linear flow — no backward navigation once an answer is submitted
3. Client state (React hooks) holds answers in progress
4. On final submission → POST to Next.js API route → appended to `data/submissions.json`
5. Student sees score + diagnostic message

**Expected directory layout** (Next.js App Router conventions):

```
src/
  app/                  # Pages and layouts (App Router)
    api/                # API routes (submission endpoint)
  components/           # Question types, navigation, score screen
  lib/                  # Types, utilities, question/submission helpers
data/
  questions.json        # Question bank (source of truth)
  submissions.json      # Persisted results (append-only)
```

**State management**: React hooks only — no Redux/Zustand for MVP.

**Question types**:

- `multiple-choice` — auto-evaluated on submission
- `code` / `text` — stored as-is for manual or future AI review

## MVP Scope

In scope:

- Shuffled question order (randomized per session)
- One question per page, no going back
- Email-based duplicate submission prevention
- Score screen with diagnostic message (low-pressure framing)

Out of scope for MVP (do not implement):

- AI-assisted grading
- Blur detection / tab-switch anti-cheat
- Copy-paste blocking
- Authentication / login
- Google Sheets integration
- Teacher dashboard

## Key Constraints

- The assessment is intentionally **low-stakes**: framing matters. Score screens should use calibration/diagnostic language, not judgment language.
- Questions must serve in **random order** per session to reduce copying between students.
- Once a student submits, their response must not be modifiable (email-based deduplication check at API level).
- Don't write code unless told to. Provide ideas and plans, not code. Feel free to suggest improvements and ask for clarifications.
