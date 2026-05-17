type PromptProps = {
	title: string
	description?: string
}

export default function Prompt({ title, description }: PromptProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<p className="font-semibold text-secondary">{title}</p>
			{description && (
				<p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
			)}
		</div>
	)
}
