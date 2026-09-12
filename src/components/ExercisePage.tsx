"use client";

import { ReactNode, useState } from "react";
import PlayGround from "./PlayGround";

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

type ExercisePageProps = {
  defaultCode: string;
  guides: ReactNode[];
  tasks: Task[];
};

export default function ExercisePage({ defaultCode, guides, tasks }: ExercisePageProps) {
  const [currentCode, setCurrentCode] = useState(defaultCode);

  const completedIds = tasks
    .filter((task) => evaluateTask(task, currentCode))
    .map((task) => task.id);

  const allDone = completedIds.length === tasks.length;

  function handleSubmit() {
    console.log("=== Student submission ===");
    console.log(currentCode);
  }

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

        <button
          onClick={handleSubmit}
          disabled={!allDone}
          className="shrink-0 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
