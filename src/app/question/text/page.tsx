"use client"

import { useState } from "react"
import Badge from "@/components/ui/Badge"
import Guard from "@/components/Guard"
import Hint from "@/components/ui/Hint"
import Nav from "@/components/ui/Nav"
import ProgressBar from "@/components/ui/ProgressBar"
import Prompt from "@/components/ui/Prompt"

const current = 5
const total = 10

export default function TextQuestionPage() {
	const [answer, setAnswer] = useState("")

	return (
		<Guard>
			<div className="min-h-screen flex flex-col bg-stone-100 font-sans">
				<ProgressBar current={current} total={total} />
				<Nav title="Assessment Engine" />

				<main className="flex flex-col gap-6 px-8 py-8 w-full max-w-2xl mx-auto">
					<div className="flex flex-col gap-1">
						<h1 className="text-2xl font-semibold text-secondary">
							Question {current} of {total}
						</h1>
					</div>

					<div className="bg-white rounded-sm shadow-sm flex flex-col gap-5 p-6">
						<Badge label="Text" color="tertiary" />
						<Prompt
							title="In your own words, explain the difference between a stack and a queue."
							description="Focus on how each structure handles insertion and retrieval order."
						/>
						<textarea
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							placeholder="Write your answer here…"
							rows={6}
							className="w-full border border-zinc-200 rounded-sm px-4 py-3 text-sm text-secondary placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition"
						/>
						<div className="flex items-center justify-between">
							<span className="text-xs text-zinc-400 font-mono">
								{answer.length} characters
							</span>
							<button
								disabled={answer.trim().length === 0}
								className="bg-primary text-white text-sm font-medium px-6 py-2.5 hover:opacity-90 active:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
							>
								Submit Answer →
							</button>
						</div>
					</div>

					<Hint
						text="There is no single correct answer — write what you understand. This helps us calibrate, not grade."
						color="tertiary"
					/>
				</main>
			</div>
		</Guard>
	)
}
