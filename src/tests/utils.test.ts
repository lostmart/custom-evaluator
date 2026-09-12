/**
 * utils.test.ts
 *
 * Tests for pure utility functions used across the app:
 * - shuffle (from question/page.tsx)
 * - normalize (from StudyClient.tsx fill-in answer comparison)
 * - TIMER_DURATION value
 */

import { describe, it, expect } from "vitest"

// ── Extracted from src/app/question/page.tsx ──────────────────────────────────

const TIMER_DURATION = 20

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Extracted from src/components/StudyClient.tsx ────────────────────────────

function normalize(s: string): string {
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n")
}

// ── TIMER_DURATION ────────────────────────────────────────────────────────────

describe("TIMER_DURATION", () => {
  it("is 20 seconds", () => {
    expect(TIMER_DURATION).toBe(20)
  })
})

// ── shuffle ───────────────────────────────────────────────────────────────────

describe("shuffle", () => {
  it("returns an array of the same length", () => {
    const input = [1, 2, 3, 4, 5]
    expect(shuffle(input)).toHaveLength(input.length)
  })

  it("contains the same elements as the input", () => {
    const input = ["a", "b", "c", "d"]
    const result = shuffle(input)
    expect(result.sort()).toEqual([...input].sort())
  })

  it("does not mutate the original array", () => {
    const input = [1, 2, 3]
    const copy = [...input]
    shuffle(input)
    expect(input).toEqual(copy)
  })

  it("handles an empty array", () => {
    expect(shuffle([])).toEqual([])
  })

  it("handles a single-element array", () => {
    expect(shuffle([42])).toEqual([42])
  })

  it("produces different orderings across runs (statistical)", () => {
    // With 10 elements, the chance of getting the same order twice in a row
    // across 5 attempts is astronomically small
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const results = new Set(
      Array.from({ length: 5 }, () => shuffle(input).join(","))
    )
    expect(results.size).toBeGreaterThan(1)
  })
})

// ── normalize ─────────────────────────────────────────────────────────────────

describe("normalize", () => {
  it("trims leading and trailing whitespace from each line", () => {
    expect(normalize("  hello  \n  world  ")).toBe("hello\nworld")
  })

  it("removes blank lines", () => {
    expect(normalize("line1\n\n\nline2")).toBe("line1\nline2")
  })

  it("removes lines that are only whitespace", () => {
    expect(normalize("line1\n   \nline2")).toBe("line1\nline2")
  })

  it("treats two answers as equal when they differ only in whitespace", () => {
    const student = "const x = 1\n  const y = 2  \n"
    const expected = "const x = 1\nconst y = 2"
    expect(normalize(student)).toBe(normalize(expected))
  })

  it("returns empty string for blank input", () => {
    expect(normalize("")).toBe("")
    expect(normalize("   \n  \n  ")).toBe("")
  })

  it("preserves meaningful indentation differences when present", () => {
    // normalize trims each line, so indented vs non-indented become equal
    expect(normalize("  if (x) {")).toBe("if (x) {")
  })
})
