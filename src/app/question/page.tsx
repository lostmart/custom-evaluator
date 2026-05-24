"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTest } from "@/context/TestContext"
import { useUser } from "@/context/UserContext"
import { track } from "@/lib/track"
import set1 from "@/assets/data.json"
import set2 from "@/assets/data-set2.json"
import set3 from "@/assets/microservicesPythonQuestions.json"
import Badge from "@/components/ui/Badge"
import Guard from "@/components/Guard"
import Modal from "@/components/ui/Modal"
import MultipleChoice from "@/components/question/MultipleChoice"
import Nav from "@/components/ui/Nav"
import ProgressBar from "@/components/ui/ProgressBar"
import Prompt from "@/components/ui/Prompt"

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr]
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]]
	}
	return a
}

export default function QuestionPage() {
	const { test, setTest } = useTest()
	const { user } = useUser()
	const router = useRouter()
	const current = test.currentQuestion

	const pool = test.questionSet === "set2" ? set2 : test.questionSet === "set3" ? set3 : set1
	const [shuffled] = useState(() => shuffle(pool).slice(0, 20))
	const total = shuffled.length

	const [selected, setSelected] = useState<string | null>(null)
	const [showModal, setShowModal] = useState(false)
	const [hasConfirmedOnce, setHasConfirmedOnce] = useState(false)

	useEffect(() => {
		setTest({ totalQuestions: total })
	}, [])

	const question = shuffled[current]
	if (!question) return null

	const options = question.options.map((opt) => ({ id: opt, label: opt }))

	function handleSubmit() {
		const isCorrect = selected === question.answer
		const newPoints = isCorrect ? test.points + 1 : test.points
		const nextQuestion = current + 1

		setShowModal(false)
		setHasConfirmedOnce(true)
		setSelected(null)
		track({ email: user.email, name: user.name, event: "question_answered", detail: `${newPoints} correct so far` })

		if (nextQuestion >= total) {
			setTest({ points: newPoints, currentQuestion: nextQuestion })
			router.push("/score")
		} else {
			setTest({ points: newPoints, currentQuestion: nextQuestion })
		}
	}

	function handleSubmitClick() {
		if (hasConfirmedOnce) {
			handleSubmit()
		} else {
			setShowModal(true)
		}
	}

	return (
		<Guard>
			<div className="min-h-screen flex flex-col bg-stone-100 font-sans">
				<ProgressBar current={current + 1} total={total} />
				<Nav title="Assessment Engine" />

				<Modal
					show={showModal}
					title="Confirm submission"
					message="Are you sure you want to submit your answer? You cannot go back."
					color="secondary"
					onConfirm={handleSubmit}
					onCancel={() => setShowModal(false)}
				/>

				<main className="flex flex-col gap-6 px-8 py-8 w-full max-w-2xl mx-auto">
					<div className="flex flex-col gap-1">
						<span className="text-xs font-mono uppercase tracking-widest text-tertiary">
							{question.title}
						</span>
						<h1 className="text-2xl font-semibold text-secondary">
							Question {current + 1} of {total}
						</h1>
					</div>

					<div className="bg-white rounded-sm shadow-sm flex flex-col gap-5 p-6">
						<Badge label="Multiple Choice" color="primary" />
						<Prompt title={question.question} />
						<MultipleChoice
							options={options}
							selected={selected}
							onChange={setSelected}
						/>
						<div className="flex justify-end">
							<button
								disabled={!selected}
								onClick={handleSubmitClick}
								className="bg-primary text-white text-sm font-medium px-6 py-2.5 hover:opacity-90 active:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
							>
								Submit Answer →
							</button>
						</div>
					</div>
				</main>
			</div>
		</Guard>
	)
}
