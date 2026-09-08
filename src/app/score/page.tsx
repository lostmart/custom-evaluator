"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTest } from "@/context/TestContext";
import { useUser } from "@/context/UserContext";
import { track } from "@/lib/track";
import Nav from "@/components/ui/Nav";

const COURSE_LABELS: Record<string, string> = {
  "bash-scripting": "Bash Scripting",
  "linux-fundamentals": "Linux Fundamentals",
  "python-microservices": "Python Microservices",
};

function getDiagnosticMessage(score: number, total: number): string {
  const pct = score / total;
  if (pct >= 0.85)
    return "Strong foundation — you're well prepared for the program.";
  if (pct >= 0.65)
    return "Good baseline — a few areas to revisit before the course starts.";
  if (pct >= 0.4)
    return "Some gaps to address — the program will cover these, and that's expected.";
  return "Lots of ground to cover — this is exactly what the program is here for.";
}

function ScoreContent() {
  const { test } = useTest();
  const { user } = useUser();
  const params = useSearchParams();

  // URL params are the source of truth (survive refresh); context is fallback
  const points =
    params.get("points") !== null ? Number(params.get("points")) : test.points;
  const totalQuestions =
    params.get("total") !== null
      ? Number(params.get("total"))
      : test.totalQuestions;
  const questionSet = params.get("set") || test.questionSet;

  const pct =
    totalQuestions > 0 ? Math.round((points / totalQuestions) * 100) : 0;
  const errors = totalQuestions - points;
  const courseLabel = questionSet ? (COURSE_LABELS[questionSet] ?? null) : null;

  const tracked = useRef(false);
  useEffect(() => {
    if (totalQuestions > 0 && !tracked.current) {
      tracked.current = true;
      track({
        email: user.email,
        event: "completed",
        detail: `${points}/${totalQuestions} correct`,
      });

      fetch("/api/study-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: `${questionSet ?? "unknown"}-assessment`,
          email: user.email,
          submittedAt: new Date().toLocaleString("sv-SE", {
            timeZone: "Europe/Paris",
          }),
          courseTitle: `${questionSet ?? "unknown"} — ${points}/${totalQuestions}`,
        }),
      }).catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 font-sans">
      <Nav title="Assessment Engine" />

      <main className="flex flex-col items-center gap-8 px-8 py-16 w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-tertiary">
            Assessment complete
          </span>
          <h1 className="text-3xl font-semibold text-secondary">Nice work.</h1>
        </div>

        <div className="bg-white rounded-sm shadow-sm w-full flex flex-col items-center gap-6 p-10">
          <div className="flex flex-col items-center gap-1">
            <span className="text-6xl font-bold text-secondary">{pct}%</span>
            <span className="text-sm text-zinc-500 font-mono">
              {points} / {totalQuestions} correct
            </span>
            {errors > 0 && (
              <span className="text-sm text-red-400 font-mono">
                {errors} incorrect
              </span>
            )}
          </div>

          <div className="h-px w-full bg-zinc-100" />

          <p className="text-sm text-zinc-600 text-center leading-relaxed max-w-sm">
            {getDiagnosticMessage(points, totalQuestions)}
          </p>

          {courseLabel && errors > 0 && (
            <Link
              href={`/${questionSet}/study`}
              className="flex items-center justify-between w-full px-4 py-3 border border-zinc-200 rounded-sm hover:border-zinc-300 hover:bg-zinc-50 transition-colors group"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-secondary">
                  Review {courseLabel}
                </span>
                <span className="text-xs text-zinc-400">
                  Study materials and practice exercises
                </span>
              </div>
              <span className="text-zinc-300 group-hover:text-zinc-500 transition-colors">
                →
              </span>
            </Link>
          )}
        </div>

        <p className="text-xs text-zinc-400 text-center">
          Your results have been recorded. You can close this tab.
        </p>
      </main>
    </div>
  );
}

export default function ScorePage() {
  return (
    <Suspense>
      <ScoreContent />
    </Suspense>
  );
}
