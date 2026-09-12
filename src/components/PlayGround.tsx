"use client";

import type { editor } from "monaco-editor";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
  useActiveCode,
} from "@codesandbox/sandpack-react";
import CodeEditor from "./question/CodeEditor";

function RefreshButton() {
  const { sandpack } = useSandpack();
  return (
    <button
      onClick={() => sandpack.resetAllFiles()}
      className="text-zinc-400 hover:text-zinc-200 transition text-sm px-1"
      aria-label="Refresh preview"
      title="Refresh preview"
    >
      ↻
    </button>
  );
}

function EditorWithSync({
  defaultCode,
  onValidate,
  onCodeChange,
}: {
  defaultCode: string;
  onValidate: (markers: editor.IMarker[]) => void;
  onCodeChange?: (code: string) => void;
}) {
  const { updateCode } = useActiveCode();

  function handleChange(value: string) {
    updateCode(value);
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
  onCodeChange,
}: {
  defaultCode: string;
  onCodeChange?: (code: string) => void;
}) => {
  return (
    <SandpackProvider
      template="react-ts"
      files={{ "/App.tsx": defaultCode }}
      options={{ autorun: true, recompileMode: "delayed", recompileDelay: 700, activeFile: "/App.tsx" }}
    >
      <div className="flex h-full w-full" style={{ minHeight: "60vh" }}>
        <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-700">
          <EditorWithSync
            defaultCode={defaultCode}
            onValidate={(m) => console.log(m)}
            onCodeChange={onCodeChange}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border-b border-zinc-700 shrink-0">
            <div className="flex-1 bg-zinc-700 rounded px-3 py-0.5 text-xs text-zinc-400 font-mono">
              Preview
            </div>
            <RefreshButton />
          </div>

          <SandpackPreview
            style={{ flex: 1 }}
            showNavigator={false}
            showOpenInCodeSandbox={false}
          />

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
