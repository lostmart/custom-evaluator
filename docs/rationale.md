# Assessment Platform — Project Rationale

## Context

This project was initiated by a permanent teacher-advisor at EPITA's Bachelor of Computer Science program, who also handles program coordination. The need arose from direct experience running student assessments using Google Forms and spreadsheets — tools that work, but offer limited control over question types, user experience, and data ownership.

## Problem

Existing solutions like Google Forms are usable but too restrictive:

- No support for code or script input questions
- No control over navigation flow (students can jump around freely)
- No way to enforce basic anti-cheating constraints
- Data lives in third-party platforms with limited export flexibility
- The experience feels academic and detached from real-world scenarios

## Goal

Build a custom assessment platform tailored for BSc Computer Science students at EPITA, designed for both **diagnostic** and **summative** evaluation, with a focus on practical, real-life scenarios over purely theoretical questions.

## MVP Scope (v1 — Proof of Concept)

The first version needs to be functional within days and will replace Google Forms immediately. It should feel like an upgrade — not a prototype.

### Core Features

- **Multiple choice questions** — auto-evaluated
- **Code/text input questions** — manually reviewed or AI-assisted in future versions
- **One question per page** — linear flow, no going back once an answer is submitted
- **Final score screen** — shows result with a friendly diagnostic message (low pressure, not a judgment)
- **Submission persistence** — results stored in a JSON file server-side for teacher review
- **No double submission allowed** - once the students submitted an form, it can't be changed (email based)
- **Shuffled question order** - questions are served in a random order

### Out of Scope for MVP

- AI-assisted grading
- Blur detection / anti-cheat enforcement
- Confined/locked browser environment
- Google Sheets integration
- Authentication / student login system

## Tech Stack

| Layer           | Choice                        | Reason                                                                         |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| Framework       | Next.js                       | Full-stack in one repo; API routes handle submission storage; React-compatible |
| UI              | Tilwind css                   | Speed over polish on tight deadline                                            |
| Data            | Local JSON file (server-side) | Simple, no database setup needed for MVP                                       |
| Question source | JSON file                     | Easy to author and edit questions quickly                                      |

## Assessment Philosophy

The platform is intentionally designed to feel **low-stakes and practical**:

- Diagnostic tests measure where students are — not what grade they deserve
- Students are told upfront this is for calibration, not evaluation
- Questions are grounded in real scenarios, not textbook exercises
- The experience should feel closer to a professional skills check than an exam

## Anti-Cheat Considerations (Future Iterations)

The following constraints are planned for post-MVP:

- **Copy-paste disabled** in input fields
- **Blur detection** — leaving the tab/window triggers a warning (strike system: 2 strikes = session terminated)
- **Confined environment** — still under consideration; may be too heavy-handed for the diagnostic use case

## Data Flow (MVP)

1. Student lands on the assessment start page
2. Questions are served one at a time from a JSON file
3. Each answer is captured in local component state
4. On final submission, answers + score are sent to a Next.js API route
5. API route appends the result to a server-side JSON file
6. Student sees their score with a diagnostic summary message

## Roadmap

| Version  | Focus                                                                 |
| -------- | --------------------------------------------------------------------- |
| v1 (now) | Multiple choice + code input, JSON storage, linear flow, score screen |
| v2       | Blur detection, copy-paste blocking, basic anti-cheat                 |
| v3       | AI-assisted grading for code submissions                              |
| v4       | Teacher dashboard, Google Sheets integration, student history         |

## Why Build From Scratch?

Off-the-shelf platforms (Google Forms, Typeform, etc.) impose constraints that conflict with the pedagogical needs here: no code input, no navigation control, no data ownership, and no extensibility. Building from scratch with Next.js gives full control over UX, data, and future integrations — while staying within a familiar React-based workflow.
