"use client"

type ModalColor = "primary" | "secondary" | "tertiary"

const colorClasses: Record<ModalColor, { header: string; confirm: string }> = {
	primary: { header: "bg-primary", confirm: "bg-primary" },
	secondary: { header: "bg-secondary", confirm: "bg-secondary" },
	tertiary: { header: "bg-tertiary", confirm: "bg-tertiary" },
}

type ModalProps = {
	show: boolean
	title: string
	message: string
	onConfirm: () => void
	onCancel: () => void
	color?: ModalColor
}

export default function Modal({
	show,
	title,
	message,
	onConfirm,
	onCancel,
	color = "primary",
}: ModalProps) {
	if (!show) return null

	const { header, confirm } = colorClasses[color]

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-md bg-white rounded-sm shadow-xl flex flex-col overflow-hidden">
				{/* Header */}
				<div className={`${header} px-6 py-4`}>
					<h2 className="text-base font-semibold text-white">{title}</h2>
				</div>

				{/* Body */}
				<div className="px-6 py-5">
					<p className="text-sm text-zinc-600 leading-relaxed">{message}</p>
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-100">
					<button
						onClick={onCancel}
						className="text-sm font-medium text-zinc-500 px-4 py-2 hover:text-zinc-700 transition"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className={`${confirm} text-white text-sm font-medium px-5 py-2 hover:opacity-90 transition`}
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	)
}
