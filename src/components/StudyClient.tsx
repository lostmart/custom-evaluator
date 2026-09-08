"use client";

import { useState, useEffect } from "react";
import type { CourseData, Exercise, Topic } from "@/lib/courses";
import CodeEditor from "@/components/question/CodeEditor";
import { useUser } from "@/context/UserContext";

// ── Progress hook ─────────────────────────────────────────────────────────────

function useStudyProgress(courseId: string) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const raw = localStorage.getItem(`study:${courseId}`);
    if (raw) {
      try {
        setCompleted(new Set(JSON.parse(raw)));
      } catch {
        // ignore corrupt data
      }
    }
  }, [courseId]);

  function toggle(exerciseId: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(exerciseId)) next.delete(exerciseId);
      else next.add(exerciseId);
      localStorage.setItem(`study:${courseId}`, JSON.stringify([...next]));
      return next;
    });
  }

  return { completed, toggle };
}

// ── Exercise components ────────────────────────────────────────────────────────

function MultipleChoiceExercise({
  exercise,
  onSolved,
}: {
  exercise: Exercise;
  onSolved: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(opt: string) {
    setSelected(opt);
    if (opt === exercise.answer) onSolved();
  }

  return (
    <div className="flex flex-col gap-3">
      {exercise.options!.map((opt) => {
        const isAnswer = opt === exercise.answer;
        const isSelected = selected === opt;
        let cls =
          "flex items-center gap-3 px-4 py-2.5 rounded-sm border text-sm cursor-pointer transition-colors font-mono ";
        if (!selected) {
          cls += "border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50";
        } else if (isAnswer) {
          cls += "border-emerald-400 bg-emerald-50 text-emerald-800";
        } else if (isSelected) {
          cls += "border-red-300 bg-red-50 text-red-700";
        } else {
          cls += "border-zinc-100 text-zinc-400";
        }
        return (
          <button key={opt} className={cls} onClick={() => handleSelect(opt)}>
            <span className="w-4 shrink-0 text-xs">
              {selected && isAnswer ? "✓" : selected && isSelected ? "✗" : "○"}
            </span>
            {opt}
          </button>
        );
      })}
      {selected && exercise.explanation && (
        <p className="text-xs text-zinc-500 leading-relaxed border-t border-zinc-100 pt-3">
          {exercise.explanation}
        </p>
      )}
    </div>
  );
}

function FillInExercise({
  exercise,
  onSolved,
}: {
  exercise: Exercise;
  onSolved: () => void;
}) {
  const [value, setValue] = useState(exercise.code ?? "");
  const [revealed, setRevealed] = useState(false);

  function normalize(s: string) {
    return s.split("\n").map((l) => l.trim()).filter(Boolean).join("\n");
  }
  const correct = normalize(value) === normalize(exercise.answer ?? "");

  function handleCheck() {
    setRevealed(true);
    if (correct) onSolved();
  }

  return (
    <div className="flex flex-col gap-3">
      <CodeEditor
        filename="exercise.js"
        defaultValue={exercise.code ?? ""}
        onChange={setValue}
      />
      <div className="flex justify-end">
        <button
          onClick={handleCheck}
          className="text-xs px-4 py-2 bg-zinc-800 text-white rounded-sm hover:bg-zinc-700 transition-colors"
        >
          Check
        </button>
      </div>
      {revealed && (
        <>
          <div
            className={`text-xs font-mono px-3 py-2 rounded-sm ${correct ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-700"}`}
          >
            {correct ? "Correct!" : "Answer:"}
            {!correct && (
              <pre className="mt-1 whitespace-pre-wrap font-semibold">{exercise.answer}</pre>
            )}
          </div>
          {exercise.explanation && (
            <p className="text-xs text-zinc-500 leading-relaxed">
              {exercise.explanation}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function CodeExercise({
  exercise,
  onSolved,
}: {
  exercise: Exercise;
  onSolved: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  function handleReveal() {
    setRevealed(true);
    onSolved();
  }

  return (
    <div className="flex flex-col gap-3">
      {exercise.hint && (
        <p className="text-xs text-zinc-400 italic">Hint: {exercise.hint}</p>
      )}
      {revealed ? (
        <pre className="bg-zinc-950 text-zinc-200 text-xs font-mono px-4 py-3 rounded-sm overflow-x-auto leading-relaxed">
          {exercise.solution}
        </pre>
      ) : (
        <button
          onClick={handleReveal}
          className="text-xs px-4 py-2 self-start bg-zinc-100 text-zinc-600 rounded-sm hover:bg-zinc-200 transition-colors"
        >
          Show solution
        </button>
      )}
    </div>
  );
}

function ExerciseCard({
  exercise,
  isCompleted,
  onToggleDone,
}: {
  exercise: Exercise;
  isCompleted: boolean;
  onToggleDone: () => void;
}) {
  const [solved, setSolved] = useState(isCompleted);

  const diffBadge =
    exercise.difficulty === "beginner"
      ? "text-emerald-700 bg-emerald-50"
      : "text-amber-700 bg-amber-50";

  const canMark = solved;

  return (
    <div
      className={`border rounded-sm p-5 flex flex-col gap-4 transition-colors ${isCompleted ? "border-emerald-200 bg-emerald-50/30" : "border-zinc-100"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-zinc-700 leading-relaxed font-medium">
          {exercise.prompt}
        </p>
        <span
          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${diffBadge}`}
        >
          {exercise.difficulty}
        </span>
      </div>
      {exercise.type === "multiple-choice" && (
        <MultipleChoiceExercise exercise={exercise} onSolved={() => setSolved(true)} />
      )}
      {exercise.type === "fill-in" && (
        <FillInExercise exercise={exercise} onSolved={() => setSolved(true)} />
      )}
      {exercise.type === "code" && (
        <CodeExercise exercise={exercise} onSolved={() => setSolved(true)} />
      )}
      <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-3">
        {!canMark && !isCompleted && (
          <span className="text-[10px] font-mono text-zinc-400">
            Answer correctly to unlock
          </span>
        )}
        <button
          onClick={canMark ? onToggleDone : undefined}
          disabled={!canMark}
          className={`text-xs px-3 py-1.5 rounded-sm font-mono transition-colors ${
            isCompleted
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : canMark
              ? "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 cursor-pointer"
              : "bg-zinc-50 text-zinc-300 cursor-not-allowed"
          }`}
        >
          {isCompleted ? "✓ Done" : "Mark as done"}
        </button>
      </div>
    </div>
  );
}

function TopicView({
  topic,
  completed,
  onToggle,
}: {
  topic: Topic;
  completed: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-zinc-800">{topic.title}</h2>
        <p className="text-sm text-zinc-500 leading-relaxed">{topic.summary}</p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
          Key Points
        </h3>
        <ul className="flex flex-col gap-2">
          {topic.keyPoints.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 items-start text-xs font-mono text-zinc-700 leading-relaxed"
            >
              <span className="text-zinc-300 shrink-0 mt-0.5">—</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {topic.externalLinks.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
            References
          </h3>
          <ul className="flex flex-col gap-1">
            {topic.externalLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
          Exercises
        </h3>
        {topic.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            isCompleted={completed.has(ex.id)}
            onToggleDone={() => onToggle(ex.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main client component ─────────────────────────────────────────────────────

export function StudyClient({ course }: { course: CourseData }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { completed, toggle } = useStudyProgress(course.id);
  const { user } = useUser();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const activeTopic = activeId ? course.topicsMap[activeId] : null;

  const totalExercises = Object.values(course.topicsMap).reduce(
    (acc, t) => acc + t.exercises.length,
    0
  );
  const allDone = completed.size >= totalExercises;

  function topicProgress(topicId: string) {
    const topic = course.topicsMap[topicId];
    const done = topic.exercises.filter((ex) => completed.has(ex.id)).length;
    return { done, total: topic.exercises.length };
  }

  async function handleSubmit() {
    if (!allDone || submitting || submitted) return;
    setSubmitting(true);

    const payload = {
      courseId: course.id,
      sheetName: `${course.id}-materials`,
      submittedAt: new Date().toISOString(),
      email: user.email,
      courseTitle: course.title,
    };

    const res = await fetch("/api/study-submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);

    setSubmitting(false);

    const json = await res?.json().catch(() => null);
    if (!res?.ok || json?.ok === false) {
      setSubmitError(json?.error ?? "Submission failed. Try again.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="flex gap-8 items-start">
      {/* Sidebar */}
      <nav className="w-48 shrink-0 flex flex-col gap-0.5 sticky top-8">
        {course.topics.map((t) => {
          const { done, total } = topicProgress(t.id);
          return (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id === activeId ? null : t.id)}
              className={`text-left text-sm px-3 py-2 rounded-sm transition-colors flex items-center justify-between gap-2 ${
                activeId === t.id
                  ? "bg-white text-zinc-900 font-medium shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-white/60"
              }`}
            >
              <span className="truncate">{t.title}</span>
              {done > 0 && (
                <span
                  className={`text-[10px] font-mono shrink-0 ${done === total ? "text-emerald-600" : "text-zinc-400"}`}
                >
                  {done}/{total}
                </span>
              )}
            </button>
          );
        })}

        {/* Overall progress */}
        <div className="mt-4 px-3 flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>Progress</span>
            <span>{completed.size}/{totalExercises}</span>
          </div>
          <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${totalExercises ? (completed.size / totalExercises) * 100 : 0}%` }}
            />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {activeTopic ? (
          <div className="bg-white rounded-sm shadow-sm px-10 py-10">
            <TopicView
              topic={activeTopic}
              completed={completed}
              onToggle={toggle}
            />
          </div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm px-10 py-10 flex flex-col gap-6">
            <p className="text-sm text-zinc-400">
              Select a topic from the sidebar to start reviewing.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {course.topics.map((t) => {
                const { done, total } = topicProgress(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveId(t.id)}
                    className={`text-left flex flex-col gap-1.5 p-4 border rounded-sm hover:border-zinc-300 hover:bg-zinc-50 transition-colors ${
                      done === total && total > 0
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-zinc-100"
                    }`}
                  >
                    <span className="text-sm font-medium text-zinc-800">
                      {t.title}
                    </span>
                    <span className={`text-xs ${done === total && total > 0 ? "text-emerald-600" : "text-zinc-400"}`}>
                      {done}/{total} done
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit banner */}
        <div className="bg-white rounded-sm shadow-sm px-10 py-6 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-zinc-800">
              {allDone ? "All exercises completed" : `${completed.size} / ${totalExercises} exercises completed`}
            </p>
            <p className="text-xs text-zinc-400">
              {allDone ? "Send your progress to your instructor." : "Complete all exercises to submit."}
            </p>
          </div>
          {submitted ? (
            <span className="text-xs font-mono text-emerald-600">
              ✓ Sent
            </span>
          ) : (
            <div className="flex flex-col items-end gap-1 shrink-0">
              <button
                onClick={handleSubmit}
                disabled={!allDone || submitting}
                className={`text-sm px-5 py-2.5 rounded-sm font-medium transition-opacity ${
                  allDone && !submitting
                    ? "bg-primary text-white hover:opacity-90"
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                }`}
              >
                {submitting ? "Sending…" : "Submit progress →"}
              </button>
              {submitError && (
                <p className="text-xs text-red-500">{submitError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
