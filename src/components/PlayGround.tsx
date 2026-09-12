"use client";

import type { editor } from "monaco-editor";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from "@codesandbox/sandpack-react";
import CodeEditor from "./question/CodeEditor";


function EditorWithSync({
  defaultCode,
  onValidate,
  onCodeChange,
}: {
  defaultCode: string;
  onValidate: (markers: editor.IMarker[]) => void;
  onCodeChange?: (code: string) => void;
}) {
  const { sandpack } = useSandpack();

  function handleChange(value: string) {
    sandpack.updateFile("/App.tsx", value);
    onCodeChange?.(value);
  }

  return (
    <CodeEditor
      filename="App.tsx"
      defaultLanguage="typescript"
      defaultValue={defaultCode}
      onValidate={onValidate}
      theme="vs-dark"
      height="100%"
      onChange={handleChange}
      disablePaste
    />
  );
}

const PlayGround = ({
  defaultCode,
  testCode,
  showTests = false,
  onCodeChange,
}: {
  defaultCode: string;
  testCode?: string;
  showTests?: boolean;
  onCodeChange?: (code: string) => void;
}) => {
  const handleEditorValidation = (markers: editor.IMarker[]) => {
    console.log(markers);
  };

  const files: Record<string, string> = { "/App.tsx": defaultCode };
  if (testCode) files["/App.test.tsx"] = testCode;

  return (
    <SandpackProvider
      template="react-ts"
      files={files}
      options={{ autorun: true }}
      customSetup={{
        dependencies: {
          "@testing-library/react": "^14.0.0",
        },
      }}
    >
      <div className="flex h-full w-full" style={{ minHeight: "60vh" }}>
        {/* Editor — left */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-700">
          <EditorWithSync defaultCode={defaultCode} onValidate={handleEditorValidation} onCodeChange={onCodeChange} />
        </div>

        {/* Output — right */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border-b border-zinc-700 shrink-0">
            <div className="flex-1 bg-zinc-700 rounded px-3 py-0.5 text-xs text-zinc-400 font-mono">
              Preview
            </div>
          </div>

          {/* Sandpack preview */}
          <SandpackPreview
            style={{ flex: 1 }}
            showNavigator={false}
            showOpenInCodeSandbox={false}
          />

          {/* Console */}
          <div className="border-t border-zinc-200 shrink-0">
            <div className="px-3 py-1.5 bg-zinc-100 border-b border-zinc-200 text-xs font-mono text-zinc-500">
              Console
            </div>
            <div className="h-40 overflow-auto">
              <SandpackConsole style={{ height: "100%" }} />
            </div>
          </div>

        </div>
      </div>
    </SandpackProvider>
  );
};

export default PlayGround;
