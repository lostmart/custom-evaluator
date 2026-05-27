import Link from "next/link";
import courseIndex from "@/assets/courses/index.json";
import { courses } from "@/lib/courses";

export default function StudyIndexPage() {
  return (
    <div className="min-h-screen bg-stone-100 font-sans flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            EPITA — BSc Computer Science
          </span>
          <h1 className="text-2xl font-semibold text-zinc-800">Study</h1>
          <p className="text-sm text-zinc-500">
            Choose a subject to review key concepts and practice exercises.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {courseIndex.map((entry) => {
            const course = courses[entry.id];
            const totalExercises = course
              ? Object.values(course.topicsMap).reduce(
                  (sum, t) => sum + t.exercises.length,
                  0
                )
              : 0;

            return (
              <Link
                key={entry.id}
                href={`/study/${entry.id}`}
                className="flex items-center justify-between bg-white rounded-sm shadow-sm px-8 py-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-base font-medium text-zinc-800 group-hover:text-zinc-900">
                    {entry.title}
                  </span>
                  <span className="text-sm text-zinc-400">
                    {entry.description}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-8">
                  {course && (
                    <>
                      <span className="text-xs font-mono text-zinc-400">
                        {course.topics.length} topics
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {totalExercises} exercises
                      </span>
                    </>
                  )}
                  <span className="text-zinc-300 group-hover:text-zinc-500 transition-colors text-sm mt-1">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
