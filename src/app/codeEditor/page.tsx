import fs from "fs";
import path from "path";
import { Fragment } from "react";
import ExercisePage from "@/components/ExercisePage";

const page = () => {
  const defaultCode = fs.readFileSync(
    path.join(process.cwd(), "data/templates/App.tsx"),
    "utf-8",
  );

  const tasks = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/templates/tasks.json"), "utf-8"),
  );

  return (
    <ExercisePage
      defaultCode={defaultCode}
      tasks={tasks}
      guides={[
        <Fragment key={0}>
          Link the button to the `changeValue` function
        </Fragment>,
        <Fragment key={1}>
          Use <code className="font-mono bg-cyan-950 px-1">useState</code> to
          manage state
        </Fragment>,
        <Fragment key={2}>
          The button must update the displayed message when clicked
        </Fragment>,
      ]}
    />
  );
};

export default page;
