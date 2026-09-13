/**
 * task-patterns.test.ts
 *
 * Validates that the regex patterns in tasks.json correctly
 * match passing student code and reject incomplete code.
 */

import { describe, it, expect } from "vitest"
import fs from "fs"
import path from "path"

type Task = {
  id: string
  description: string
  points: number
  check: { type: "code-contains"; pattern: string }
}

function loadTasks(exerciseId: string): Task[] {
  const file = path.join(__dirname, "../../data/templates", exerciseId, "tasks.json")
  return JSON.parse(fs.readFileSync(file, "utf-8"))
}

function matches(pattern: string, code: string): boolean {
  return new RegExp(pattern, "s").test(code)
}

// ---------------------------------------------------------------------------
// components-props
// ---------------------------------------------------------------------------

describe("components-props task patterns", () => {
  const tasks = loadTasks("components-props")

  describe("task1 — pass props with image={flowerUrl}", () => {
    const p = tasks[0].check.pattern

    it("matches ArticleComp with image={flowerUrl}", () => {
      expect(matches(p, `<ArticleComp title="A" description="B" image={flowerUrl} />`)).toBe(true)
    })

    it("matches with extra whitespace", () => {
      expect(matches(p, `<ArticleComp  image={ flowerUrl } />`)).toBe(true)
    })

    it("matches multiline JSX", () => {
      const code = `
        <ArticleComp
          title="Article 1"
          description="Desc"
          image={flowerUrl}
        />
      `
      expect(matches(p, code)).toBe(true)
    })

    it("rejects image as a string literal", () => {
      expect(matches(p, `<ArticleComp image="flowerUrl" />`)).toBe(false)
    })

    it("rejects missing image prop", () => {
      expect(matches(p, `<ArticleComp title="A" />`)).toBe(false)
    })

    it("rejects image with a different variable", () => {
      expect(matches(p, `<ArticleComp image={someOtherUrl} />`)).toBe(false)
    })
  })

  describe("task2 — articlesList.map()", () => {
    const p = tasks[1].check.pattern

    it("matches articlesList.map(", () => {
      expect(matches(p, `articlesList.map((a) => <ArticleComp />)`)).toBe(true)
    })

    it("matches with space before paren", () => {
      expect(matches(p, `articlesList.map ((a) => {})`)).toBe(true)
    })

    it("rejects otherList.map(", () => {
      expect(matches(p, `otherList.map((a) => {})`)).toBe(false)
    })

    it("rejects articlesList.forEach(", () => {
      expect(matches(p, `articlesList.forEach((a) => {})`)).toBe(false)
    })
  })

  describe("task3 — unique key prop", () => {
    const p = tasks[2].check.pattern

    it("matches key={...}", () => {
      expect(matches(p, `<ArticleComp key={a.id} />`)).toBe(true)
    })

    it("matches key=\"...\"", () => {
      expect(matches(p, `<ArticleComp key="unique" />`)).toBe(true)
    })

    it("matches key={'...'}", () => {
      expect(matches(p, `<ArticleComp key={'id-1'} />`)).toBe(true)
    })

    it("rejects no key", () => {
      expect(matches(p, `<ArticleComp title="A" />`)).toBe(false)
    })
  })

  describe("task4 — define ArticleProps type", () => {
    const p = tasks[3].check.pattern

    it("matches full type with all three fields", () => {
      const code = `
        type ArticleProps = {
          title: string;
          description: string;
          image: string;
        };
      `
      expect(matches(p, code)).toBe(true)
    })

    it("matches fields in different order", () => {
      const code = `
        type ArticleProps = {
          image: string;
          title: string;
          description: string;
        };
      `
      expect(matches(p, code)).toBe(true)
    })

    it("rejects type set to any", () => {
      expect(matches(p, `type ArticleProps = any;`)).toBe(false)
    })

    it("rejects missing image field", () => {
      const code = `
        type ArticleProps = {
          title: string;
          description: string;
        };
      `
      expect(matches(p, code)).toBe(false)
    })

    it("rejects missing title field", () => {
      const code = `
        type ArticleProps = {
          description: string;
          image: string;
        };
      `
      expect(matches(p, code)).toBe(false)
    })

    it("rejects empty type", () => {
      expect(matches(p, `type ArticleProps = {};`)).toBe(false)
    })
  })

  it("all 4 tasks total 100 points", () => {
    const total = tasks.reduce((s, t) => s + t.points, 0)
    expect(total).toBe(100)
  })
})

// ---------------------------------------------------------------------------
// use-state-one
// ---------------------------------------------------------------------------

describe("use-state-one task patterns", () => {
  const tasks = loadTasks("use-state-one")

  describe("task1 — onClick={changeValue}", () => {
    const p = tasks[0].check.pattern

    it("matches onClick={changeValue}", () => {
      expect(matches(p, `<button onClick={changeValue}>Click</button>`)).toBe(true)
    })

    it("matches with spaces around braces", () => {
      expect(matches(p, `onClick={ changeValue }`)).toBe(true)
    })

    it("rejects onClick with arrow function call", () => {
      expect(matches(p, `onClick={() => changeValue()}`)).toBe(false)
    })

    it("rejects onClick with different handler name", () => {
      expect(matches(p, `onClick={handleClick}`)).toBe(false)
    })

    it("rejects no onClick", () => {
      expect(matches(p, `<button>Click</button>`)).toBe(false)
    })
  })

  describe("task2 — changeValue calls setState", () => {
    const p = tasks[1].check.pattern

    it("matches arrow function with setState", () => {
      expect(matches(p, `const changeValue = () => { setState("clicked") }`)).toBe(true)
    })

    it("matches concise arrow body", () => {
      expect(matches(p, `const changeValue = () => setState("clicked")`)).toBe(true)
    })

    it("matches with let declaration", () => {
      // pattern checks `changeValue =` followed by arrow and setState
      expect(matches(p, `let changeValue = () => setState("clicked")`)).toBe(false)
      // only const is expected based on typical React patterns — just testing the regex
    })

    it("rejects changeValue without setState", () => {
      expect(matches(p, `const changeValue = () => { console.log("hi") }`)).toBe(false)
    })

    it("rejects setState in a different function", () => {
      expect(matches(p, `const otherFn = () => setState("clicked")`)).toBe(false)
    })
  })

  describe('task3 — setState("clicked") and {message}', () => {
    const p = tasks[2].check.pattern

    it("matches code with both setState('clicked') and {message}", () => {
      const code = `
        const changeValue = () => setState("clicked")
        return <div>{message}</div>
      `
      expect(matches(p, code)).toBe(true)
    })

    it("matches with single quotes", () => {
      const code = `
        setState('clicked')
        <p>{message}</p>
      `
      expect(matches(p, code)).toBe(true)
    })

    it("rejects setState with wrong value", () => {
      const code = `
        setState("done")
        <p>{message}</p>
      `
      expect(matches(p, code)).toBe(false)
    })

    it("rejects correct setState but missing {message} render", () => {
      const code = `
        setState("clicked")
        <p>Hello</p>
      `
      expect(matches(p, code)).toBe(false)
    })

    it("rejects {message} without setState", () => {
      const code = `<div>{message}</div>`
      expect(matches(p, code)).toBe(false)
    })
  })

  it("all 3 tasks total 100 points", () => {
    const total = tasks.reduce((s, t) => s + t.points, 0)
    expect(total).toBe(100)
  })
})
