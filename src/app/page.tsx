"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { user, setUser } = useUser();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleIdentify(e: React.FormEvent) {
    e.preventDefault();
    if (!email.endsWith("@epita.fr")) {
      setError("Wrong email address.");
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
            EPITA : BSC Learning Tool
          </span>
          <h1 className="text-3xl font-semibold text-secondary">Welcome</h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Use this tool to study and take assessments. Once you're logged in,
            you can go through the study materials as many times as you want.
            When you're ready, you can take the assessment. You can only submit
            once!
          </p>
        </header>

        <div className="h-px bg-zinc-100" />

        {user.hydrated && user.email ? (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono text-zinc-400">{user.email}</p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              You&apos;re identified. Open the link shared by your instructor to
              access your assessment or study materials.
            </p>
            <p className="text-xs text-zinc-400">
              You can only submit once. Make sure your email is correct before
              starting.
            </p>
            <button
              onClick={() => setUser({ email: "" })}
              className="self-start text-xs text-zinc-400 hover:text-zinc-600 underline underline-offset-2 transition"
            >
              Not you? Log out
            </button>
          </div>
        ) : (
          <form onSubmit={handleIdentify} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-secondary">
                Your email
              </span>
              <input
                type="email"
                placeholder="firstname.lastname@epita.fr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
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
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? "Checking…" : "Continue →"}
            </button>
            <p className="text-xs text-zinc-400 text-center">
              You can only submit once. Make sure your email is correct before
              starting.
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
