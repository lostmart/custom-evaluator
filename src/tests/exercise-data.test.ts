/**
 * exercise-data.test.ts
 *
 * Validates the integrity of every exercise across all courses:
 * - required fields are present and non-empty
 * - multiple-choice exercises have options and a valid answer
 * - fill-in exercises have an answer
 * - exercise IDs are unique within each course
 * - exercise IDs are unique globally
 */

import { describe, it, expect } from "vitest"
import { courses } from "@/lib/courses"
import type { Exercise } from "@/lib/courses"

const allCourses = Object.values(courses)

describe("exercise data integrity", () => {
  it("every exercise has id, type, difficulty, and prompt", () => {
    for (const course of allCourses) {
      for (const topic of Object.values(course.topicsMap)) {
        for (const ex of topic.exercises) {
          const ctx = `[${course.id} > ${topic.id} > ${ex.id}]`
          expect(typeof ex.id, `${ctx} id must be a string`).toBe("string")
          expect(ex.id.length, `${ctx} id must not be empty`).toBeGreaterThan(0)
          expect(["multiple-choice", "fill-in", "code"], `${ctx} invalid type`).toContain(ex.type)
          expect(typeof ex.difficulty, `${ctx} difficulty must be a string`).toBe("string")
          expect(typeof ex.prompt, `${ctx} prompt must be a string`).toBe("string")
          expect(ex.prompt.length, `${ctx} prompt must not be empty`).toBeGreaterThan(0)
        }
      }
    }
  })

  it("multiple-choice exercises have options array and answer inside options", () => {
    for (const course of allCourses) {
      for (const topic of Object.values(course.topicsMap)) {
        for (const ex of topic.exercises) {
          if (ex.type !== "multiple-choice") continue
          const ctx = `[${course.id} > ${topic.id} > ${ex.id}]`
          expect(Array.isArray(ex.options), `${ctx} must have options array`).toBe(true)
          expect(ex.options!.length, `${ctx} must have at least 2 options`).toBeGreaterThanOrEqual(2)
          expect(typeof ex.answer, `${ctx} must have an answer`).toBe("string")
          expect(ex.options, `${ctx} answer must be one of the options`).toContain(ex.answer)
          expect(typeof ex.explanation, `${ctx} must have an explanation`).toBe("string")
          expect(ex.explanation!.length, `${ctx} explanation must not be empty`).toBeGreaterThan(0)
        }
      }
    }
  })

  it("fill-in exercises have a non-empty answer", () => {
    for (const course of allCourses) {
      for (const topic of Object.values(course.topicsMap)) {
        for (const ex of topic.exercises) {
          if (ex.type !== "fill-in") continue
          const ctx = `[${course.id} > ${topic.id} > ${ex.id}]`
          expect(typeof ex.answer, `${ctx} must have an answer`).toBe("string")
          expect(ex.answer!.length, `${ctx} answer must not be empty`).toBeGreaterThan(0)
        }
      }
    }
  })

  it("exercise IDs are unique within each course", () => {
    for (const course of allCourses) {
      const seen = new Set<string>()
      for (const topic of Object.values(course.topicsMap)) {
        for (const ex of topic.exercises) {
          expect(seen.has(ex.id), `[${course.id}] duplicate exercise id: ${ex.id}`).toBe(false)
          seen.add(ex.id)
        }
      }
    }
  })

  it("exercise IDs are unique globally across all courses", () => {
    const seen = new Map<string, string>()
    for (const course of allCourses) {
      for (const topic of Object.values(course.topicsMap)) {
        for (const ex of topic.exercises) {
          const existing = seen.get(ex.id)
          expect(
            existing,
            `Duplicate exercise id "${ex.id}" found in both "${existing}" and "${course.id}"`
          ).toBeUndefined()
          seen.set(ex.id, course.id)
        }
      }
    }
  })

  it("typescript-react course has 7 exercises per topic", () => {
    const course = courses["typescript-react"]
    for (const topic of Object.values(course.topicsMap)) {
      expect(
        topic.exercises.length,
        `Topic "${topic.id}" should have 7 exercises, got ${topic.exercises.length}`
      ).toBe(7)
    }
  })
})
