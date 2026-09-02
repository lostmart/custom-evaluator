"use client";

import { useState } from "react";
import type { CourseData, Exercise, Topic } from "@/lib/courses";

// ── Exercise components ────────────────────────────────────────────────────────

function MultipleChoiceExercise({ exercise }: { exercise: Exercise }) {
  const [selected, setSelected] = useState<string | null>(null);

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
          <button key={opt} className={cls} onClick={() => setSelected(opt)}>
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

function FillInExercise({ exercise }: { exercise: Exercise }) {
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState(false);
  const correct = value.trim() === exercise.answer?.trim();

  return (
    <div className="flex flex-col gap-3">
      {exercise.code && (
        <pre className="bg-zinc-950 text-zinc-200 text-xs font-mono px-4 py-3 rounded-sm overflow-x-auto leading-relaxed">
          {exercise.code}
        </pre>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your answer…"
          className="flex-1 text-sm font-mono border border-zinc-200 rounded-sm px-3 py-2 focus:outline-none focus:border-zinc-400 bg-white"
        />
        <button
          onClick={() => setRevealed(true)}
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
            {correct ? "Correct! " : "Answer: "}
            <span className="font-semibold">{exercise.answer}</span>
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

function CodeExercise({ exercise }: { exercise: Exercise }) {
  const [revealed, setRevealed] = useState(false);

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
          onClick={() => setRevealed(true)}
          className="text-xs px-4 py-2 self-start bg-zinc-100 text-zinc-600 rounded-sm hover:bg-zinc-200 transition-colors"
        >
          Show solution
        </button>
      )}
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const diffBadge =
    exercise.difficulty === "beginner"
      ? "text-emerald-700 bg-emerald-50"
      : "text-amber-700 bg-amber-50";

  return (
    <div className="border border-zinc-100 rounded-sm p-5 flex flex-col gap-4">
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
        <MultipleChoiceExercise exercise={exercise} />
      )}
      {exercise.type === "fill-in" && <FillInExercise exercise={exercise} />}
      {exercise.type === "code" && <CodeExercise exercise={exercise} />}
    </div>
  );
}

function TopicView({ topic }: { topic: Topic }) {
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
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </div>
  );
}

// ── Main client component ─────────────────────────────────────────────────────

export function StudyClient({ course }: { course: CourseData }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTopic = activeId ? course.topicsMap[activeId] : null;

  return (
    <div className="flex gap-8 items-start">
      {/* Sidebar */}
      <nav className="w-48 shrink-0 flex flex-col gap-0.5 sticky top-8">
        {course.topics.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id === activeId ? null : t.id)}
            className={`text-left text-sm px-3 py-2 rounded-sm transition-colors ${
              activeId === t.id
                ? "bg-white text-zinc-900 font-medium shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 hover:bg-white/60"
            }`}
          >
            {t.title}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {activeTopic ? (
          <div className="bg-white rounded-sm shadow-sm px-10 py-10">
            <TopicView topic={activeTopic} />
          </div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm px-10 py-10 flex flex-col gap-6">
            <p className="text-sm text-zinc-400">
              Select a topic from the sidebar to start reviewing.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {course.topics.map((t) => {
                const topic = course.topicsMap[t.id];
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveId(t.id)}
                    className="text-left flex flex-col gap-1.5 p-4 border border-zinc-100 rounded-sm hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-zinc-800">
                      {t.title}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {topic.exercises.length} exercises
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
