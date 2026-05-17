type NavProps = {
	title: string
}

export default function Nav({ title }: NavProps) {
	return (
		<nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-200 bg-white">
			<span className="text-sm font-medium text-secondary">{title}</span>
			<div className="flex gap-4 text-zinc-400">
				<button aria-label="Help" className="hover:text-zinc-600 transition text-base">
					?
				</button>
				<button aria-label="Settings" className="hover:text-zinc-600 transition text-base">
					⚙
				</button>
			</div>
		</nav>
	)
}
