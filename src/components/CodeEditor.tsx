type CodeEditorProps = {
	filename: string
	defaultValue?: string
}

export default function CodeEditor({ filename, defaultValue = "" }: CodeEditorProps) {
	return (
		<div className="rounded-lg overflow-hidden border border-zinc-200">
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

			{/* Editable area */}
			<textarea
				className="w-full bg-secondary text-zinc-200 font-mono text-sm leading-relaxed p-4 resize-none outline-none min-h-44 placeholder:text-zinc-600"
				defaultValue={defaultValue}
				spellCheck={false}
			/>
		</div>
	)
}
