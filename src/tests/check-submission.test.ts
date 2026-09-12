/**
 * check-submission.test.ts
 *
 * Tests for the submission check logic used to prevent double-submits.
 */

import { describe, it, expect } from "vitest"

// ── Pure logic extracted from /api/check-submission/route.ts ─────────────────

function buildGasCheckUrl(rosterUrl: string, email: string, sheetName: string): string {
  const url = new URL(rosterUrl)
  url.searchParams.set("action", "checkSubmission")
  url.searchParams.set("email", email)
  url.searchParams.set("sheetName", sheetName)
  return url.toString()
}

function parseGasResponse(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false
  const d = data as Record<string, unknown>
  if (d.submitted === true) return true
  if (d.ok === false && d.error === "Already submitted") return true
  return false
}

function buildSheetName(syllabus: string): string {
  return `${syllabus}-assessment`
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("buildSheetName", () => {
  it("appends -assessment to the syllabus ID", () => {
    expect(buildSheetName("typescript-react")).toBe("typescript-react-assessment")
    expect(buildSheetName("modern-js")).toBe("modern-js-assessment")
    expect(buildSheetName("bash-scripting")).toBe("bash-scripting-assessment")
  })
})

describe("buildGasCheckUrl", () => {
  const BASE = "https://script.google.com/macros/s/FAKE_ID/exec"

  it("adds action, email, and sheetName as query params", () => {
    const result = buildGasCheckUrl(BASE, "martin@epita.fr", "typescript-react-assessment")
    const url = new URL(result)
    expect(url.searchParams.get("action")).toBe("checkSubmission")
    expect(url.searchParams.get("email")).toBe("martin@epita.fr")
    expect(url.searchParams.get("sheetName")).toBe("typescript-react-assessment")
  })

  it("preserves the base URL", () => {
    const result = buildGasCheckUrl(BASE, "a@epita.fr", "sheet")
    expect(result.startsWith(BASE)).toBe(true)
  })

  it("URL-encodes special characters in email", () => {
    const result = buildGasCheckUrl(BASE, "first.last+tag@epita.fr", "sheet")
    const url = new URL(result)
    expect(url.searchParams.get("email")).toBe("first.last+tag@epita.fr")
  })
})

describe("parseGasResponse", () => {
  it("returns true when GAS responds with { submitted: true } (after checkOnly update)", () => {
    expect(parseGasResponse({ submitted: true })).toBe(true)
  })

  it("returns true when GAS responds with { ok: false, error: 'Already submitted' } (current GAS)", () => {
    expect(parseGasResponse({ ok: false, error: "Already submitted" })).toBe(true)
  })

  it("returns false when GAS responds with { submitted: false }", () => {
    expect(parseGasResponse({ submitted: false })).toBe(false)
  })

  it("returns false when GAS responds with { ok: true } (new student, no prior submission)", () => {
    expect(parseGasResponse({ ok: true })).toBe(false)
  })

  it("returns false when the submitted field is missing and no error", () => {
    expect(parseGasResponse({ ok: false, error: "Some other error" })).toBe(false)
  })

  it("returns false for null or unexpected responses", () => {
    expect(parseGasResponse(null)).toBe(false)
    expect(parseGasResponse(undefined)).toBe(false)
    expect(parseGasResponse("error")).toBe(false)
  })
})
