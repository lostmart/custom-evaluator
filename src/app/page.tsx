"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useTest } from "@/context/TestContext";
import { track } from "@/lib/track";

const SETS = [
  {
    id: "set1" as const,
    label: "Bash Scripting",
    description:
      "Arrays, case statements, regex, AWK, and advanced shell features.",
  },
  {
    id: "set2" as const,
    label: "Linux Commands",
    description: "File operations, redirects, loops, functions, sed, and AWK.",
  },
  {
    id: "set3" as const,
    label: "Microservices with Python",
    description: "Python, and microservices architecture",
  },
];

export default function Home() {
  const { user, setUser } = useUser();
  const { setTest } = useTest();
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [selectedSet, setSelectedSet] = useState<
    "set1" | "set2" | "set3" | null
  >(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user.hasStarted) {
      setTest({ cancelled: true });
      router.replace("/cancelled");
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.endsWith("@epita.fr")) {
      setError("Only @epita.fr email addresses are allowed.");
      return;
    }
    if (!selectedSet) return;
    setError("");
    setUser({ name, email, hasStarted: true });
    setTest({ questionSet: selectedSet });
    track({ email, name, event: "started", detail: selectedSet });
    router.push("/question");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-200 font-sans">
      <main className="w-full max-w-xl flex flex-col gap-8 bg-white rounded-sm shadow-sm px-12 py-16">
        <header className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-tertiary">
            EPITA — BSc Computer Science
          </span>
          <h1 className="text-3xl font-semibold text-secondary">
            Diagnostic Assessment
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed">
            This is a calibration exercise — not a grade. Answer honestly so we
            can tailor the program to where you actually are.
          </p>
        </header>

        <div className="h-px bg-zinc-100" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              className={`border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition ${error ? "border-red-400" : "border-zinc-200"}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">
              Your name
            </span>
            <input
              type="text"
              placeholder="Firstname Lastname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </label>

          <div className="flex flex-col gap-1.5 mt-1">
            <span className="text-sm font-medium text-secondary">
              Question set
            </span>
            <div className="flex flex-col gap-2">
              {SETS.map((set) => {
                const active = selectedSet === set.id;
                return (
                  <button
                    key={set.id}
                    type="button"
                    onClick={() => setSelectedSet(set.id)}
                    className={`flex flex-col gap-0.5 text-left px-4 py-3 border rounded-sm transition ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${active ? "text-primary" : "text-secondary"}`}
                    >
                      {set.label}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {set.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedSet}
            className="mt-2 bg-primary text-white text-sm font-medium px-6 py-3 hover:opacity-90 active:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start Assessment →
          </button>
        </form>

        <p className="text-xs text-zinc-400 text-center">
          You can only submit once. Make sure your email is correct before
          starting.
        </p>
      </main>
    </div>
  );
}
