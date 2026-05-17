"use client"

type Option = {
	id: string
	label: string
}

type MultipleChoiceProps = {
	options: Option[]
	selected: string | null
	onChange: (id: string) => void
}

export default function MultipleChoice({ options, selected, onChange }: MultipleChoiceProps) {
	return (
		<div className="flex flex-col gap-2">
			{options.map((option) => {
				const isSelected = selected === option.id
				return (
					<button
						key={option.id}
						onClick={() => onChange(option.id)}
						className={`flex items-center gap-3 px-4 py-3 border rounded-sm text-sm text-left transition ${
							isSelected
								? "border-primary bg-primary/5 text-secondary"
								: "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
						}`}
					>
						<span
							className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 transition ${
								isSelected ? "border-primary" : "border-zinc-300"
							}`}
						>
							{isSelected && <span className="w-2 h-2 rounded-sm bg-primary" />}
						</span>
						<span className="flex-1 font-mono">{option.label}</span>
						{isSelected && (
							<span className="w-5 h-5 rounded-sm bg-primary flex items-center justify-center shrink-0">
								<svg width="10" height="8" viewBox="0 0 10 8" fill="none">
									<path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</span>
						)}
					</button>
				)
			})}
		</div>
	)
}
