"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useTest } from "@/context/TestContext";
import { track } from "@/lib/track";

export function QuizEntry({ syllabus }: { syllabus: string }) {
  const { user, setUser } = useUser();
  const { setTest } = useTest();
  const router = useRouter();

  useEffect(() => {
    if (!user.hydrated) return;
    if (!user.email) {
      router.replace(`/${syllabus}`);
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
  }, [user.hydrated]);

  return null;
}
