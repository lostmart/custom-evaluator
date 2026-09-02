import { notFound } from "next/navigation";
import { courses } from "@/lib/courses";
import { QuizEntry } from "./QuizEntry";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ syllabus: string }>;
}) {
  const { syllabus } = await params;
  if (!courses[syllabus]) notFound();

  return <QuizEntry syllabus={syllabus} />;
}
