/**
 * auth-logic.test.ts
 *
 * Unit tests for the email validation and credential logic used in the
 * auth API routes — extracted as pure functions so they can be tested
 * without spinning up Next.js.
 */

import { describe, it, expect } from "vitest"

// ── Pure logic extracted from /api/auth/student/route.ts ──────────────────────

function isValidStudentEmail(email: unknown): boolean {
  return typeof email === "string" && /^[^@]+@epita\.fr$/.test(email)
}

// ── Pure logic extracted from /api/auth/login/route.ts ───────────────────────

function isValidAdminCredentials(
  user: unknown,
  pass: unknown,
  expectedUser: string,
  expectedPass: string
): boolean {
  return user === expectedUser && pass === expectedPass
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("student email validation", () => {
  it("accepts valid @epita.fr addresses", () => {
    expect(isValidStudentEmail("firstname.lastname@epita.fr")).toBe(true)
    expect(isValidStudentEmail("a@epita.fr")).toBe(true)
  })

  it("rejects non-epita email addresses", () => {
    expect(isValidStudentEmail("student@gmail.com")).toBe(false)
    expect(isValidStudentEmail("student@epita.com")).toBe(false)
    expect(isValidStudentEmail("student@mail.epita.fr")).toBe(false)
  })

  it("rejects empty string", () => {
    expect(isValidStudentEmail("")).toBe(false)
  })

  it("rejects null and undefined", () => {
    expect(isValidStudentEmail(null)).toBe(false)
    expect(isValidStudentEmail(undefined)).toBe(false)
  })

  it("rejects non-string types", () => {
    expect(isValidStudentEmail(123)).toBe(false)
    expect(isValidStudentEmail({})).toBe(false)
  })

  it("rejects a string that only contains the domain", () => {
    expect(isValidStudentEmail("@epita.fr")).toBe(false)
  })
})

describe("admin credential validation", () => {
  const ADMIN = "admin"
  const PASS = "s3cr3t"

  it("accepts correct credentials", () => {
    expect(isValidAdminCredentials(ADMIN, PASS, ADMIN, PASS)).toBe(true)
  })

  it("rejects wrong username", () => {
    expect(isValidAdminCredentials("wrong", PASS, ADMIN, PASS)).toBe(false)
  })

  it("rejects wrong password", () => {
    expect(isValidAdminCredentials(ADMIN, "wrong", ADMIN, PASS)).toBe(false)
  })

  it("rejects both wrong", () => {
    expect(isValidAdminCredentials("wrong", "wrong", ADMIN, PASS)).toBe(false)
  })

  it("rejects empty strings", () => {
    expect(isValidAdminCredentials("", "", ADMIN, PASS)).toBe(false)
  })
})
