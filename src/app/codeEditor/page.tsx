import fs from "fs";
import path from "path";
import { Fragment } from "react";
import ExercisePage from "@/components/ExercisePage";

const page = () => {
  const defaultCode = fs.readFileSync(
    path.join(process.cwd(), "data/templates/App.tsx"),
    "utf-8",
  );
  const testCode = fs.readFileSync(
    path.join(process.cwd(), "data/templates/tests/App.test.tsx"),
    "utf-8",
  );

  return (
    <ExercisePage
      defaultCode={defaultCode}
      testCode={testCode}
      guides={[
        <Fragment key={0}>Use <code className="font-mono bg-cyan-950 px-1">useState</code> to manage state</Fragment>,
        <Fragment key={1}>The button must update the displayed message when clicked</Fragment>,
      ]}
    />
  );
};

export default page;
