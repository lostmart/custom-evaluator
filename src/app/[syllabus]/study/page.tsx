import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/lib/courses";
import { StudyClient } from "@/components/StudyClient";

export default async function SyllabusStudyPage({
  params,
}: {
  params: Promise<{ syllabus: string }>;
}) {
  const { syllabus } = await params;
  const course = courses[syllabus];
  if (!course) notFound();

  return (
    <div className="min-h-screen bg-stone-100 font-sans">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-8">
        <header className="flex flex-col gap-1">
          <Link
            href={`/${syllabus}`}
            className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors w-fit"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-800 mt-1">
            {course.title}
          </h1>
          <p className="text-sm text-zinc-500">{course.description}</p>
        </header>

        <StudyClient course={course} />
      </div>
    </div>
  );
}
