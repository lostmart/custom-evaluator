type BadgeColor = "primary" | "secondary" | "tertiary"

const colorClasses: Record<BadgeColor, string> = {
	primary: "border-primary text-primary",
	secondary: "border-secondary text-secondary",
	tertiary: "border-tertiary text-tertiary",
}

type BadgeProps = {
	label: string
	color?: BadgeColor
}

export default function Badge({ label, color = "primary" }: BadgeProps) {
	return (
		<span
			className={`text-xs font-mono uppercase tracking-widest border ${colorClasses[color]} px-2 py-0.5 rounded w-fit`}
		>
			{label}
		</span>
	)
}
