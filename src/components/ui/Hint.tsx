type HintColor = "primary" | "secondary" | "tertiary"

const colorClasses: Record<HintColor, { border: string; icon: string }> = {
	primary: { border: "border-primary", icon: "text-primary" },
	secondary: { border: "border-secondary", icon: "text-secondary" },
	tertiary: { border: "border-tertiary", icon: "text-tertiary" },
}

type HintProps = {
	text: string
	color?: HintColor
}

export default function Hint({ text, color = "primary" }: HintProps) {
	const { border, icon } = colorClasses[color]

	return (
		<div
			className={`flex gap-3 bg-zinc-50 border-l-2 ${border} px-4 py-3 rounded-r-sm`}
		>
			<span className={`${icon} mt-0.5 text-sm`}>◎</span>
			<div className="flex flex-col gap-1">
				<p className="text-sm font-semibold text-secondary">Hint</p>
				<p className="text-sm text-zinc-500 leading-relaxed">{text}</p>
			</div>
		</div>
	)
}
