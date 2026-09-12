import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

type AssertionResult = {
  title: string
  status: string
  failureMessages: string[]
}

export async function POST(req: NextRequest) {
  const { code, testCode } = await req.json()

  const id = randomUUID()
  const tmpDir = path.join("/tmp", `eval-${id}`)
  const testFile = path.join(tmpDir, "App.test.tsx")
  const outputFile = path.join("/tmp", `results-${id}.json`)

  try {
    await fs.mkdir(tmpDir, { recursive: true })
    await fs.writeFile(path.join(tmpDir, "App.tsx"), code, "utf-8")
    await fs.writeFile(testFile, testCode, "utf-8")

    const { startVitest } = await import("vitest/node")

    const vitest = await startVitest(
      "test",
      [testFile],
      {
        configFile: false,
        watch: false,
        reporters: ["json"],
        outputFile: { json: outputFile },
        environment: "jsdom",
      },
      {
        esbuild: {
          jsx: "automatic",
          jsxImportSource: "react",
        },
      }
    )

    if (vitest) await vitest.close()

    const raw = await fs.readFile(outputFile, "utf-8")
    const json = JSON.parse(raw)

    const tests = (json.testResults?.[0]?.assertionResults ?? []).map(
      (t: AssertionResult) => ({
        name: t.title,
        passed: t.status === "passed",
        error: t.failureMessages?.[0] ?? null,
      })
    )

    return NextResponse.json({
      passed: json.numFailedTests === 0,
      tests,
    })
  } catch (err) {
    console.error("Evaluation error:", err)
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 })
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {})
    await fs.rm(outputFile, { force: true }).catch(() => {})
  }
}
