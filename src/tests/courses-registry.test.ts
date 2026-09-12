/**
 * courses-registry.test.ts
 *
 * Verifies that every course registered in courses.ts is correctly wired up:
 * - all expected course IDs are present
 * - each course has the required top-level fields
 * - topics array and topicsMap stay in sync
 * - the typescript-react course has all 9 topics
 */

import { describe, it, expect } from "vitest"
import { courses } from "@/lib/courses"

const EXPECTED_COURSES = [
  "bash-scripting",
  "linux-fundamentals",
  "modern-js",
  "python-microservices",
  "typescript-react",
]

describe("courses registry", () => {
  it("contains all expected course IDs", () => {
    for (const id of EXPECTED_COURSES) {
      expect(courses, `Missing course: ${id}`).toHaveProperty(id)
    }
  })

  it("has no unexpected course IDs", () => {
    const registered = Object.keys(courses).sort()
    expect(registered).toEqual([...EXPECTED_COURSES].sort())
  })

  for (const id of EXPECTED_COURSES) {
    describe(`course: ${id}`, () => {
      it("has required top-level fields", () => {
        const course = courses[id]
        expect(course.id).toBe(id)
        expect(typeof course.title).toBe("string")
        expect(course.title.length).toBeGreaterThan(0)
        expect(typeof course.description).toBe("string")
        expect(course.description.length).toBeGreaterThan(0)
        expect(Array.isArray(course.topics)).toBe(true)
        expect(course.topics.length).toBeGreaterThan(0)
        expect(typeof course.topicsMap).toBe("object")
      })

      it("topics array and topicsMap are in sync", () => {
        const course = courses[id]
        const topicIds = course.topics.map((t) => t.id)
        const mapKeys = Object.keys(course.topicsMap)

        expect(topicIds.sort()).toEqual(mapKeys.sort())
        for (const tid of topicIds) {
          expect(course.topicsMap[tid]).toBeDefined()
          expect(course.topicsMap[tid].id).toBe(tid)
        }
      })

      it("every topic in topicsMap has required fields", () => {
        const course = courses[id]
        for (const [tid, topic] of Object.entries(course.topicsMap)) {
          expect(typeof topic.id).toBe("string")
          expect(topic.id).toBe(tid)
          expect(typeof topic.title).toBe("string")
          expect(typeof topic.summary).toBe("string")
          expect(topic.summary.length).toBeGreaterThan(0)
          expect(Array.isArray(topic.keyPoints)).toBe(true)
          expect(topic.keyPoints.length).toBeGreaterThan(0)
          expect(Array.isArray(topic.externalLinks)).toBe(true)
          expect(Array.isArray(topic.exercises)).toBe(true)
          expect(topic.exercises.length).toBeGreaterThan(0)
        }
      })
    })
  }

  describe("typescript-react course", () => {
    const EXPECTED_TOPICS = [
      "type-annotations",
      "interfaces",
      "union-types",
      "generics",
      "react-props",
      "react-events",
      "react-hooks",
      "async-typing",
      "utility-types",
    ]

    it("has exactly 9 topics", () => {
      expect(courses["typescript-react"].topics).toHaveLength(9)
    })

    it("contains all expected topic IDs", () => {
      const topicIds = courses["typescript-react"].topics.map((t) => t.id)
      expect(topicIds.sort()).toEqual([...EXPECTED_TOPICS].sort())
    })
  })
})
