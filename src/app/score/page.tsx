"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTest } from "@/context/TestContext"
import { useUser } from "@/context/UserContext"
import { track } from "@/lib/track"
import Nav from "@/components/ui/Nav"

const STUDY_LINKS: Record<string, { courseId: string; label: string }> = {
	set1: { courseId: "bash-scripting", label: "Bash Scripting" },
	set2: { courseId: "linux-fundamentals", label: "Linux Fundamentals" },
	set3: { courseId: "python-microservices", label: "Python Microservices" },
}

function getDiagnosticMessage(score: number, total: number): string {
	const pct = score / total
	if (pct >= 0.85) return "Strong foundation — you're well prepared for the program."
	if (pct >= 0.65) return "Good baseline — a few areas to revisit before the course starts."
	if (pct >= 0.40) return "Some gaps to address — the program will cover these, and that's expected."
	return "Lots of ground to cover — this is exactly what the program is here for."
}

export default function ScorePage() {
	const { test, setTest } = useTest()
	const { user, setUser } = useUser()
	const router = useRouter()
	const { points, totalQuestions, questionSet } = test
	const pct = totalQuestions > 0 ? Math.round((points / totalQuestions) * 100) : 0
	const errors = totalQuestions - points
	const studyLink = questionSet ? STUDY_LINKS[questionSet] ?? null : null

	const tracked = useRef(false)
	useEffect(() => {
		if (totalQuestions > 0 && !tracked.current) {
			tracked.current = true
			track({ email: user.email, name: user.name, event: "completed", detail: `${points}/${totalQuestions} correct` })
		}
	}, [])

	function handleRestart() {
		setTest({ currentQuestion: 0, points: 0, totalQuestions: 0, cancelled: false, questionSet: null })
		setUser({ hasStarted: false })
		router.push("/")
	}

	return (
		<div className="min-h-screen flex flex-col bg-stone-100 font-sans">
			<Nav title="Assessment Engine" />

			<main className="flex flex-col items-center gap-8 px-8 py-16 w-full max-w-2xl mx-auto">
				<div className="flex flex-col items-center gap-2 text-center">
					<span className="text-xs font-mono uppercase tracking-widest text-tertiary">
						Assessment complete
					</span>
					<h1 className="text-3xl font-semibold text-secondary">
						{user.name ? `Nice work, ${user.name.split(" ")[0]}.` : "Nice work."}
					</h1>
				</div>

				<div className="bg-white rounded-sm shadow-sm w-full flex flex-col items-center gap-6 p-10">
					<div className="flex flex-col items-center gap-1">
						<span className="text-6xl font-bold text-secondary">{pct}%</span>
						<span className="text-sm text-zinc-500 font-mono">
							{points} / {totalQuestions} correct
						</span>
						{errors > 0 && (
							<span className="text-sm text-red-400 font-mono">
								{errors} incorrect
							</span>
						)}
					</div>

					<div className="h-px w-full bg-zinc-100" />

					<p className="text-sm text-zinc-600 text-center leading-relaxed max-w-sm">
						{getDiagnosticMessage(points, totalQuestions)}
					</p>

					{studyLink && errors > 0 && (
						<Link
							href={`/study/${studyLink.courseId}`}
							className="flex items-center justify-between w-full px-4 py-3 border border-zinc-200 rounded-sm hover:border-zinc-300 hover:bg-zinc-50 transition-colors group"
						>
							<div className="flex flex-col gap-0.5">
								<span className="text-sm font-medium text-secondary">Review {studyLink.label}</span>
								<span className="text-xs text-zinc-400">Study materials and practice exercises</span>
							</div>
							<span className="text-zinc-300 group-hover:text-zinc-500 transition-colors">→</span>
						</Link>
					)}
				</div>

				<div className="flex flex-col items-center gap-3">
					<button
						onClick={handleRestart}
						className="bg-primary text-white text-sm font-medium px-6 py-2.5 hover:opacity-90 active:opacity-80 transition"
					>
						Try again →
					</button>
					<p className="text-xs text-zinc-400 text-center">
						Your results have been recorded. You can close this tab.
					</p>
				</div>
			</main>
		</div>
	)
}
