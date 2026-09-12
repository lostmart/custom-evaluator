"use client";

import type { editor } from "monaco-editor";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from "@codesandbox/sandpack-react";
import CodeEditor from "./question/CodeEditor";

const DEFAULT_CODE = `import {useState} from "react";

export default function App() {
  const [message, setState] = useState("nunca temas")

  const chanegValue = ()=> setState("clicked !")
  
  return (
    <>
      <h1>Hello world</h1>
  
      <button onClick={chanegValue}> Click me !</button>

      <div>{message}</div>
    </>
  )
}`;

function EditorWithSync({
  onValidate,
}: {
  onValidate: (markers: editor.IMarker[]) => void;
}) {
  const { sandpack } = useSandpack();

  function handleChange(value: string) {
    sandpack.updateFile("/App.tsx", value);
  }

  return (
    <CodeEditor
      filename="App.tsx"
      defaultLanguage="typescript"
      defaultValue={DEFAULT_CODE}
      onValidate={onValidate}
      theme="vs-dark"
      height="100%"
      onChange={handleChange}
      disablePaste
    />
  );
}

const PlayGround = () => {
  const handleEditorValidation = (markers: editor.IMarker[]) => {
    console.log(markers);
  };

  return (
    <SandpackProvider
      template="react-ts"
      files={{ "/App.tsx": DEFAULT_CODE }}
      options={{ autorun: true }}
    >
      <div className="flex h-full w-full" style={{ minHeight: "70vh" }}>
        {/* Editor — left */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-700">
          <EditorWithSync onValidate={handleEditorValidation} />
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
