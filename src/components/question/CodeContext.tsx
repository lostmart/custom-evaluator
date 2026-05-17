type CodeContextProps = {
	title: string
	code: string
}

export default function CodeContext({ title, code }: CodeContextProps) {
	return (
		<div className="rounded-sm overflow-hidden border border-zinc-700">
			<div className="bg-zinc-700 flex items-center justify-between px-4 py-2.5">
				<span className="text-xs text-zinc-300 font-mono">{title}</span>
				<button
					aria-label="Close context"
					className="text-zinc-500 hover:text-zinc-300 transition text-xs leading-none"
				>
					✕
				</button>
			</div>
			<pre className="bg-secondary text-zinc-300 font-mono text-xs leading-relaxed p-4 overflow-x-auto whitespace-pre">
				<code>{code}</code>
			</pre>
		</div>
	)
}
