"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import CodeEditor from "./question/CodeEditor";

const PlayGround = ({
  defaultCode,
  onCodeChange,
}: {
  defaultCode: string;
  onCodeChange?: (code: string) => void;
}) => {
  const [runCode, setRunCode] = useState(defaultCode);
  const [runKey, setRunKey] = useState(0);
  const editorCodeRef = useRef(defaultCode);

  function handleEditorChange(value: string) {
    editorCodeRef.current = value;
    onCodeChange?.(value);
  }

  const handleRun = useCallback(() => {
    setRunCode(editorCodeRef.current);
    setRunKey((k) => k + 1);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRun]);

  return (
    <div className="flex h-full w-full" style={{ minHeight: "60vh" }}>
      {/* Editor — left */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-700">
        <CodeEditor
          filename="App.tsx"
          defaultLanguage="typescript"
          defaultValue={defaultCode}
          theme="vs-dark"
          height="100%"
          onChange={handleEditorChange}
          onRun={handleRun}
          disablePaste
        />
      </div>

      {/* Output — right */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border-b border-zinc-700 shrink-0">
          <div className="flex-1 bg-zinc-700 rounded px-3 py-0.5 text-xs text-zinc-400 font-mono">
            Preview
          </div>
          <button
            onClick={handleRun}
            className="px-3 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded transition"
            title="Ctrl+Enter"
          >
            Run
          </button>
        </div>

        {/* Sandpack preview — re-mounts on Run */}
        <SandpackProvider
          key={runKey}
          template="react-ts"
          files={{ "/App.tsx": runCode }}
          options={{ autorun: true, activeFile: "/App.tsx" }}
        >
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
        </SandpackProvider>
      </div>
    </div>
  );
};

export default PlayGround;
