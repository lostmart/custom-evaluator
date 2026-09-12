"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import PlayGround from "./PlayGround";

type TaskCheck =
  | { type: "button-connected"; targetSelector: string; initialText: string }
  | { type: "dom-changed"; targetSelector: string; notEqual: string }
  | { type: "dom-equals"; targetSelector: string; expected: string };

type Task = {
  id: string;
  description: string;
  check: TaskCheck;
};

type SandpackMessage = {
  type: "sandpack-check";
  consoleFired: boolean;
  elements: Record<string, string>;
};

function evaluateTask(task: Task, msg: SandpackMessage): boolean {
  const { check } = task;
  const text = msg.elements[check.targetSelector] ?? "";

  switch (check.type) {
    case "button-connected":
      return msg.consoleFired;
    case "dom-changed":
      return text !== check.notEqual;
    case "dom-equals":
      return text === check.expected;
  }
}

type ExercisePageProps = {
  defaultCode: string;
  guides: ReactNode[];
  tasks: Task[];
};

export default function ExercisePage({ defaultCode, guides, tasks }: ExercisePageProps) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const completedRef = useRef<string[]>([]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const msg = event.data as SandpackMessage;
      if (!msg || msg.type !== "sandpack-check") return;

      const current = completedRef.current;
      const nextTaskIndex = current.length;
      if (nextTaskIndex >= tasks.length) return;

      const nextTask = tasks[nextTaskIndex];
      if (evaluateTask(nextTask, msg)) {
        const updated = [...current, nextTask.id];
        completedRef.current = updated;
        setCompletedIds(updated);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [tasks]);

  const allDone = completedIds.length === tasks.length;

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-900 overflow-hidden">
      <div className="flex-1 min-h-0">
        <PlayGround defaultCode={defaultCode} />
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

        <button
          disabled={!allDone}
          className="shrink-0 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
