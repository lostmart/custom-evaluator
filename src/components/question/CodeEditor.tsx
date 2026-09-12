"use client"

import Editor, { type OnMount } from "@monaco-editor/react"

import type { editor } from "monaco-editor"

type CodeEditorProps = {
	filename: string
	defaultValue?: string
	defaultLanguage?: string
	theme?: string
	height?: string
	disablePaste?: boolean
	onChange?: (value: string) => void
	onValidate?: (markers: editor.IMarker[]) => void
}

export default function CodeEditor({ filename, defaultValue = "", defaultLanguage = "javascript", theme = "vs-dark", height = "300px", disablePaste = false, onChange, onValidate }: CodeEditorProps) {
	const handleMount: OnMount = (editorInstance, monaco) => {
		if (disablePaste) {
			// Block paste on Monaco's internal textarea
			editorInstance.getDomNode()?.querySelector("textarea")?.addEventListener("paste", (e) => e.preventDefault())
			// Block Ctrl+V and Shift+Insert
			editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => null)
			editorInstance.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Insert, () => null)
		}

		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
			jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
		})

		monaco.languages.typescript.typescriptDefaults.addExtraLib(
			`declare module 'react' {
				export function useState<T>(initial: T): [T, (value: T) => void]
				export function useEffect(effect: () => void | (() => void), deps?: any[]): void
				export function useRef<T>(initial: T): { current: T }
				export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T
				export function useMemo<T>(fn: () => T, deps: any[]): T
				export function useContext<T>(context: any): T
				export function createContext<T>(defaultValue: T): any
				export const Fragment: any
				export default any
			}`,
			"file:///node_modules/react/index.d.ts"
		)

		monaco.languages.typescript.typescriptDefaults.addExtraLib(
			`declare module 'react/jsx-runtime' {
				export function jsx(type: any, props: any, key?: any): any
				export function jsxs(type: any, props: any, key?: any): any
				export const Fragment: any
			}`,
			"file:///node_modules/react/jsx-runtime.d.ts"
		)
	}
	return (
		<div className="flex flex-col h-full rounded-sm overflow-hidden border border-zinc-200">
			{/* Titlebar */}
			<div className="bg-zinc-700 flex items-center justify-between px-4 py-2.5">
				<div className="flex gap-1.5">
					<div className="w-3 h-3 rounded-full bg-red-400" />
					<div className="w-3 h-3 rounded-full bg-yellow-400" />
					<div className="w-3 h-3 rounded-full bg-green-400" />
				</div>
				<span className="text-xs text-zinc-400 font-mono">{filename}</span>
				<button
					aria-label="Copy code"
					className="text-zinc-400 hover:text-zinc-200 transition text-xs font-mono"
				>
					⧉
				</button>
			</div>

			{/* Editor area */}
			<Editor
				height={height}
				defaultLanguage={defaultLanguage}
				defaultValue={defaultValue}
				theme={theme}
				path={filename}
				onMount={handleMount}
				onChange={(value) => onChange?.(value ?? "")}
				onValidate={onValidate}
				options={{
					minimap: { enabled: false },
					fontSize: 14,
					scrollBeyondLastLine: false,
					lineNumbers: "on",
				}}
			/>
		</div>
	)
}
