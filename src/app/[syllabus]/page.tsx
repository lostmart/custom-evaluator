import { notFound } from "next/navigation";
import { courses } from "@/lib/courses";
import { SyllabusLanding } from "./SyllabusLanding";

export default async function SyllabusPage({
  params,
}: {
  params: Promise<{ syllabus: string }>;
}) {
  const { syllabus } = await params;
  const course = courses[syllabus];
  if (!course) notFound();

  return <SyllabusLanding syllabus={syllabus} courseTitle={course.title} />;
}
