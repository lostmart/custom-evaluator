/**
 * course-index.test.ts
 *
 * Verifies that index.json (the course catalogue shown in the UI)
 * stays in sync with the courses registered in courses.ts.
 */

import { describe, it, expect } from "vitest"
import { courses } from "@/lib/courses"
import courseIndex from "@/assets/courses/index.json"

describe("course index.json", () => {
  it("every entry in index.json has an id and title", () => {
    for (const entry of courseIndex) {
      expect(typeof entry.id).toBe("string")
      expect(entry.id.length).toBeGreaterThan(0)
      expect(typeof entry.title).toBe("string")
      expect(entry.title.length).toBeGreaterThan(0)
    }
  })

  it("every course in index.json is registered in courses.ts", () => {
    for (const entry of courseIndex) {
      expect(
        courses,
        `"${entry.id}" is listed in index.json but not registered in courses.ts`
      ).toHaveProperty(entry.id)
    }
  })

  it("every course registered in courses.ts appears in index.json", () => {
    const indexIds = courseIndex.map((e) => e.id)
    for (const id of Object.keys(courses)) {
      expect(
        indexIds,
        `"${id}" is registered in courses.ts but missing from index.json`
      ).toContain(id)
    }
  })

  it("index.json has no duplicate IDs", () => {
    const ids = courseIndex.map((e) => e.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it("includes typescript-react", () => {
    const ids = courseIndex.map((e) => e.id)
    expect(ids).toContain("typescript-react")
  })
})
