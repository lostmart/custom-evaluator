"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useTest } from "@/context/TestContext"
import { useUser } from "@/context/UserContext"
import { track } from "@/lib/track"
import set1 from "@/assets/data.json"
import set2 from "@/assets/data-set2.json"
import set3 from "@/assets/microservicesPythonQuestions.json"
import set4 from "@/assets/modern-js-questions.json"
import Badge from "@/components/ui/Badge"
import Guard from "@/components/Guard"
import Modal from "@/components/ui/Modal"
import MultipleChoice from "@/components/question/MultipleChoice"
import Nav from "@/components/ui/Nav"
import ProgressBar from "@/components/ui/ProgressBar"
import Prompt from "@/components/ui/Prompt"

const TIMER_DURATION = 25

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr]
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]]
	}
	return a
}

function CircularTimer({ timeLeft }: { timeLeft: number }) {
	const radius = 20
	const circumference = 2 * Math.PI * radius
	const dashoffset = circumference * (1 - timeLeft / TIMER_DURATION)
	const color =
		timeLeft > 15 ? "#10b981" : timeLeft > 8 ? "#f59e0b" : "#ef4444"

	return (
		<div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0">
			<svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
				<circle cx="24" cy="24" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="4" />
				<circle
					cx="24" cy="24" r={radius}
					fill="none"
					stroke={color}
					strokeWidth="4"
					strokeDasharray={circumference}
					strokeDashoffset={dashoffset}
					strokeLinecap="round"
					style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
				/>
			</svg>
			<span
				className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-mono font-bold"
				style={{ color }}
			>
				{timeLeft}
			</span>
		</div>
	)
}

export default function QuestionPage() {
	const { test, setTest } = useTest()
	const { user } = useUser()
	const router = useRouter()
	const current = test.currentQuestion

	const pool = test.questionSet === "linux-fundamentals" ? set2 : test.questionSet === "python-microservices" ? set3 : test.questionSet === "modern-js" ? set4 : set1
	const [shuffled] = useState(() => shuffle(pool).slice(0, 20))
	const total = shuffled.length

	const [selected, setSelected] = useState<string | null>(null)
	const [showModal, setShowModal] = useState(false)
	const [hasConfirmedOnce, setHasConfirmedOnce] = useState(false)
	const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)

	// Keep a stable ref to handleSubmit so the timer effect never goes stale
	const submitRef = useRef<() => void>(() => {})

	useEffect(() => {
		setTest({ totalQuestions: total })
	}, [])

	// Reset timer and selection on each new question
	useEffect(() => {
		setTimeLeft(TIMER_DURATION)
		setSelected(null)
		setShowModal(false)
	}, [current])

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
		track({ email: user.email, event: "question_answered", detail: `${newPoints} correct so far` })

		if (nextQuestion >= total) {
			setTest({ points: newPoints, currentQuestion: nextQuestion })
			router.push("/score")
		} else {
			setTest({ points: newPoints, currentQuestion: nextQuestion })
		}
	}

	// Keep ref current on every render
	submitRef.current = handleSubmit

	function handleSubmitClick() {
		if (hasConfirmedOnce) {
			handleSubmit()
		} else {
			setShowModal(true)
		}
	}

	// Countdown tick — auto-submits at 0
	useEffect(() => {
		if (timeLeft <= 0) {
			submitRef.current()
			return
		}
		const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
		return () => clearTimeout(id)
	}, [timeLeft])

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

				<main className="flex flex-col gap-6 px-4 sm:px-8 py-8 w-full max-w-2xl mx-auto">
					<div className="flex items-center justify-between gap-4">
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-xs font-mono uppercase tracking-widest text-tertiary truncate">
								{question.title}
							</span>
							<h1 className="text-xl sm:text-2xl font-semibold text-secondary">
								Question {current + 1} of {total}
							</h1>
						</div>
						<CircularTimer timeLeft={timeLeft} />
					</div>

					<div className="bg-white rounded-sm shadow-sm flex flex-col gap-5 p-4 sm:p-6">
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
