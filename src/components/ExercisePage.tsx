"use client";

import { useState, useEffect, useRef } from "react";
import PlayGround from "./PlayGround";
import { useUser } from "@/context/UserContext";

const TIMER_SECONDS = 3 * 60;

type TaskCheck = {
  type: "code-contains";
  pattern: string;
};

type Task = {
  id: string;
  description: string;
  check: TaskCheck;
};

function evaluateTask(task: Task, code: string): boolean {
  return new RegExp(task.check.pattern, "s").test(code);
}

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function LoginGate({ courseTitle }: { courseTitle: string }) {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleIdentify(e: React.FormEvent) {
    e.preventDefault();
    if (!email.endsWith("@epita.fr")) {
      setError("Only @epita.fr email addresses are allowed.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("This email is not on the roster. Contact your instructor.");
      return;
    }
    setUser({ email });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-200 font-sans">
      <main className="w-full max-w-xl flex flex-col gap-8 bg-white rounded-sm shadow-sm px-12 py-16">
        <header className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-tertiary">
            EPITA | BSC Learning Tool
          </span>
          <h1 className="text-3xl font-semibold text-secondary">{courseTitle}</h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Identify yourself to start the exercise. Use your EPITA email address.
          </p>
        </header>

        <div className="h-px bg-zinc-100" />

        <form onSubmit={handleIdentify} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">Your email</span>
            <input
              type="email"
              placeholder="firstname.lastname@epita.fr"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required
              className={`border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition ${
                error ? "border-red-400" : "border-zinc-200"
              }`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-primary text-white text-sm font-medium px-6 py-3 hover:opacity-90 active:opacity-80 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {loading ? "Checking…" : "Continue →"}
          </button>
        </form>
      </main>
    </div>
  );
}

type ExercisePageProps = {
  defaultCode: string;
  guides: string[];
  tasks: Task[];
  sheetName: string;
  courseTitle: string;
};

export default function ExercisePage({ defaultCode, guides, tasks, sheetName, courseTitle }: ExercisePageProps) {
  const { user } = useUser();
  const [currentCode, setCurrentCode] = useState(defaultCode);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user.email) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t > 1) return t - 1;

        clearInterval(timerRef.current!);
        fetch("/api/study-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sheetName,
            courseTitle,
            email: user.email,
            code: "not finished",
            submittedAt: new Date().toISOString(),
          }),
        }).catch(() => {});
        setTimedOut(true);
        return 0;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [user.email]);

  if (!user.hydrated) return null;
  if (!user.email) return <LoginGate courseTitle={courseTitle} />;

  const completedIds = tasks
    .filter((task) => evaluateTask(task, currentCode))
    .map((task) => task.id);

  const allDone = completedIds.length === tasks.length;

  async function handleSubmit() {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/study-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName,
          courseTitle,
          email: user.email,
          code: currentCode,
          submittedAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Submission failed");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error — try again");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-900">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-emerald-400 text-5xl">✓</span>
          <h1 className="text-2xl font-semibold text-zinc-100">Exercise submitted</h1>
          <p className="text-sm text-zinc-400 max-w-sm">
            Your work on <span className="text-zinc-200">{courseTitle}</span> has been recorded. You can close this tab.
          </p>
        </div>
      </div>
    );
  }

  if (timedOut) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-900">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-red-400 text-5xl">⏱</span>
          <h1 className="text-2xl font-semibold text-zinc-100">Time's up</h1>
          <p className="text-sm text-zinc-400 max-w-sm">
            The 3-minute window has ended. Your attempt has been recorded. You can close this tab.
          </p>
        </div>
      </div>
    );
  }

  const urgent = timeLeft <= 30;

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-900 overflow-hidden">
      <div className="min-h-0">
        <PlayGround defaultCode={defaultCode} onCodeChange={setCurrentCode} />
      </div>

      <div className="shrink-0 overflow-y-auto bg-zinc-800 border-t border-zinc-700 px-6 py-4 flex items-start gap-8">
        {/* Tasks checklist */}
        <div className="flex-1 text-sm">
          <h2 className="font-semibold text-zinc-300 mb-2">Tasks</h2>
          <ul className="space-y-1">
            {tasks.map((task) => {
              const done = completedIds.includes(task.id);
              return (
                <li key={task.id} className="flex items-center gap-2">
                  <span className={done ? "text-emerald-400" : "text-zinc-500"}>
                    {done ? "✓" : "○"}
                  </span>
                  <span className={done ? "text-zinc-200" : "text-zinc-400"}>
                    {task.description}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Guide */}
        <div className="flex-1 text-zinc-100 text-sm">
          <h2 className="font-semibold text-zinc-300 mb-2">Guide</h2>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            {guides.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <span className={`font-mono text-sm font-semibold tabular-nums ${urgent ? "text-red-400" : "text-zinc-400"}`}>
            {formatTime(timeLeft)}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!allDone || submitting}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
      </div>
    </div>
  );
}
