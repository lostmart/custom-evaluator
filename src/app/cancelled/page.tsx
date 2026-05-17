"use client"

import { useEffect } from "react"

export default function CancelledPage() {
	useEffect(() => {
		function handleBeforeUnload(e: BeforeUnloadEvent) {
			e.preventDefault()
		}

		function handlePopState() {
			history.pushState(null, "", window.location.href)
		}

		history.pushState(null, "", window.location.href)
		window.addEventListener("beforeunload", handleBeforeUnload)
		window.addEventListener("popstate", handlePopState)

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload)
			window.removeEventListener("popstate", handlePopState)
		}
	}, [])

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 font-sans px-8">
			<div className="w-full max-w-md bg-white rounded-sm shadow-sm flex flex-col overflow-hidden">
				<div className="bg-tertiary px-6 py-4">
					<h1 className="text-base font-semibold text-white">
						Evaluation cancelled
					</h1>
				</div>
				<div className="px-6 py-8 flex flex-col gap-3">
					<p className="text-sm text-zinc-700 leading-relaxed">
						You left the assessment before completing it. Your answers have not been saved.
					</p>
					<p className="text-sm text-zinc-500 leading-relaxed">
						If you believe this was a mistake, please contact your instructor to request a new session.
					</p>
				</div>
			</div>
		</div>
	)
}
