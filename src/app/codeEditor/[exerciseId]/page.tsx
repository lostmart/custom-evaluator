import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ExercisePage from "@/components/ExercisePage";

export default async function CodeEditorPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const exerciseDir = path.join(process.cwd(), "..", "data/templates", exerciseId);
  if (!fs.existsSync(exerciseDir)) notFound();

  const defaultCode = fs.readFileSync(path.join(exerciseDir, "App.tsx"), "utf-8");
  const tasks = JSON.parse(fs.readFileSync(path.join(exerciseDir, "tasks.json"), "utf-8"));
  const meta = JSON.parse(fs.readFileSync(path.join(exerciseDir, "meta.json"), "utf-8"));

  return (
    <ExercisePage
      defaultCode={defaultCode}
      tasks={tasks}
      sheetName={meta.sheetName}
      courseTitle={meta.courseTitle}
      guides={meta.guides}
    />
  );
}
