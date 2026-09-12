"use client";

import { ReactNode, useState } from "react";
import PlayGround from "./PlayGround";

type TestResult = {
  name: string;
  passed: boolean;
  error: string | null;
};

type EvalResult = {
  passed: boolean;
  tests: TestResult[];
  error?: string;
};

type ExercisePageProps = {
  defaultCode: string;
  testCode: string;
  guides: ReactNode[];
};

export default function ExercisePage({ defaultCode, testCode, guides }: ExercisePageProps) {
  const [currentCode, setCurrentCode] = useState(defaultCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: currentCode, testCode }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch {
      setResult({ passed: false, tests: [], error: "Evaluation failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-900 overflow-hidden">
      {/* Playground — fills remaining space */}
      <div className="flex-1 min-h-0">
        <PlayGround
          defaultCode={defaultCode}
          testCode={testCode}
          onCodeChange={setCurrentCode}
        />
      </div>

      {/* Guides + Submit + Results panel */}
      <div className="shrink-0 max-h-56 overflow-y-auto bg-zinc-800 border-t border-zinc-700 px-6 py-4 flex items-start gap-8">
        {/* Guides */}
        <div className="flex-1 text-zinc-100 text-sm">
          <h2 className="font-semibold text-zinc-300 mb-2">Guide</h2>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            {guides.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Results */}
        {result && (
          <div className="flex-1 text-sm">
            <h2 className="font-semibold text-zinc-300 mb-2">
              Results{" "}
              <span className={result.passed ? "text-emerald-400" : "text-red-400"}>
                {result.error ? "Error" : result.passed ? "All passed" : "Some failed"}
              </span>
            </h2>
            {result.error ? (
              <p className="text-red-400 text-xs">{result.error}</p>
            ) : (
              <ul className="space-y-1">
                {result.tests.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 font-mono text-xs">
                    <span className={t.passed ? "text-emerald-400" : "text-red-400"}>
                      {t.passed ? "✓" : "✗"}
                    </span>
                    <span className="text-zinc-300">{t.name}</span>
                    {t.error && (
                      <span className="text-red-400 truncate">{t.error.split("\n")[0]}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="shrink-0 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition"
        >
          {loading ? "Running..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
