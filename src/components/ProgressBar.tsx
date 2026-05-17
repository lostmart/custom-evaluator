type ProgressBarColor = "primary" | "secondary" | "tertiary"

const colorClasses: Record<ProgressBarColor, string> = {
	primary: "bg-primary",
	secondary: "bg-secondary",
	tertiary: "bg-tertiary",
}

type ProgressBarProps = {
	current: number
	total: number
	color?: ProgressBarColor
}

export default function ProgressBar({ current, total, color = "primary" }: ProgressBarProps) {
	const percent = Math.round((current / total) * 100)

	return (
		<div className="h-1 w-full rounded-full overflow-hidden bg-zinc-100">
			<div
				className={`h-full rounded-full ${colorClasses[color]} transition-all duration-300`}
				style={{ width: `${percent}%` }}
			/>
		</div>
	)
}
