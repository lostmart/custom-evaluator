import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import fs from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

const CONFIG_PATH = path.join(process.cwd(), "vitest.eval.config.ts")
const TEST_TEMPLATE_PATH = path.join(process.cwd(), "data/templates/tests/App.test.tsx")

type AssertionResult = {
  title: string
  status: string
  failureMessages: string[]
}

function runVitest(testFile: string, outputFile: string): Promise<void> {
  return new Promise((resolve) => {
    const proc = spawn(
      "npx",
      [
        "vitest", "run", testFile,
        "--config", CONFIG_PATH,
        "--reporter=json",
        `--outputFile=${outputFile}`,
      ],
      { cwd: process.cwd(), shell: true }
    )
    proc.on("close", () => resolve())
  })
}

export async function POST(req: NextRequest) {
  const { code } = await req.json()

  const id = randomUUID()
  const tmpDir = path.join(process.cwd(), "tmp", `eval-${id}`)
  const testFile = path.join(tmpDir, "App.test.tsx")
  const outputFile = path.join(tmpDir, "results.json")

  try {
    await fs.mkdir(tmpDir, { recursive: true })
    await fs.writeFile(path.join(tmpDir, "App.tsx"), code, "utf-8")

    const testContent = await fs.readFile(TEST_TEMPLATE_PATH, "utf-8")
    await fs.writeFile(testFile, testContent, "utf-8")

    await runVitest(testFile, outputFile)

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
  } catch {
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 })
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true })
  }
}
