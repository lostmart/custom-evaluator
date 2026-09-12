"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useTest } from "@/context/TestContext";
import { track } from "@/lib/track";

export function QuizEntry({ syllabus }: { syllabus: string }) {
  const { user, setUser } = useUser();
  const { setTest } = useTest();
  const router = useRouter();
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (!user.hydrated) return;
    if (!user.email) {
      router.replace(`/${syllabus}`);
      return;
    }

    const sheetName = `${syllabus}-assessment`;

    fetch(`/api/check-submission?email=${encodeURIComponent(user.email)}&sheetName=${encodeURIComponent(sheetName)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.submitted) {
          setAlreadySubmitted(true);
          return;
        }
        fetch("/api/auth/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });
        setUser({ hasStarted: true });
        setTest({ questionSet: syllabus });
        track({ email: user.email, event: "started", detail: syllabus });
        router.push("/question");
      })
      .catch(() => {
        // If the check itself fails, proceed — don't block the student
        setUser({ hasStarted: true });
        setTest({ questionSet: syllabus });
        track({ email: user.email, event: "started", detail: syllabus });
        router.push("/question");
      });
  }, [user.hydrated]);

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-200 font-sans">
        <main className="w-full max-w-xl flex flex-col gap-6 bg-white rounded-sm shadow-sm px-12 py-16">
          <header className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-tertiary">
              EPITA | BSC Learning Tool
            </span>
            <h1 className="text-2xl font-semibold text-secondary">
              Already submitted
            </h1>
          </header>
          <div className="h-px bg-zinc-100" />
          <p className="text-sm text-zinc-500 leading-relaxed">
            A submission for <span className="font-mono text-zinc-700">{user.email}</span> already
            exists for this assessment. Each student can only submit once.
          </p>
          <p className="text-sm text-zinc-400">
            If you think this is a mistake, contact your instructor.
          </p>
        </main>
      </div>
    );
  }

  return null;
}
