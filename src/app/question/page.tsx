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
import set5 from "@/assets/react-fundamentals-questions.json"
import set6 from "@/assets/react-fundamentals-2-questions.json"
import set7 from "@/assets/frontends-milestone-one-questions.json"
import Badge from "@/components/ui/Badge"
import CodeEditor from "@/components/question/CodeEditor"
import Guard from "@/components/Guard"
import Modal from "@/components/ui/Modal"
import MultipleChoice from "@/components/question/MultipleChoice"
import Nav from "@/components/ui/Nav"
import ProgressBar from "@/components/ui/ProgressBar"
import Prompt from "@/components/ui/Prompt"

const DEFAULT_TIMER = 20
const DEFAULT_QUESTION_COUNT = 20

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const POOLS: Record<string, { pool: any[]; count?: number }> = {
	"linux-fundamentals": { pool: set2 },
	"python-microservices": { pool: set3 },
	"modern-js": { pool: set4 },
	"react-fundamentals": { pool: set5 },
	"react-fundamentals-2": { pool: set6 },
	"frontends-milestone-one": { pool: set7, count: 40 },
}

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr]
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]]
	}
	return a
}

function CircularTimer({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
	const radius = 20
	const circumference = 2 * Math.PI * radius
	const dashoffset = circumference * (1 - timeLeft / maxTime)
	const color =
		timeLeft > maxTime * 0.5 ? "#10b981" : timeLeft > maxTime * 0.25 ? "#f59e0b" : "#ef4444"

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

	const config = POOLS[test.questionSet ?? ""] ?? { pool: set1 }
	const questionCount = config.count ?? DEFAULT_QUESTION_COUNT
	const [shuffled] = useState(() => shuffle(config.pool).slice(0, questionCount))
	const total = shuffled.length

	const [selected, setSelected] = useState<string | null>(null)
	const [codeValue, setCodeValue] = useState("")
	const [showModal, setShowModal] = useState(false)
	const [hasConfirmedOnce, setHasConfirmedOnce] = useState(false)

	const question = shuffled[current]
	const questionTimer = question?.timer ?? DEFAULT_TIMER
	const [timeLeft, setTimeLeft] = useState(questionTimer)

	// Keep a stable ref to handleSubmit so the timer effect never goes stale
	const submitRef = useRef<() => void>(() => {})

	useEffect(() => {
		setTest({ totalQuestions: total })
	}, [])

	// Reset timer, selection, and code on each new question
	useEffect(() => {
		const q = shuffled[current]
		setTimeLeft(q?.timer ?? DEFAULT_TIMER)
		setSelected(null)
		setCodeValue(q?.code ?? "")
		setShowModal(false)
	}, [current])

	const options = question?.options ? question.options.map((opt: string) => ({ id: opt, label: opt })) : []

	function handleSubmit() {
		if (!question) return
		let isCorrect: boolean
		if (question.type === "code") {
			try {
				isCorrect = new RegExp(question.answer, "s").test(codeValue)
			} catch {
				isCorrect = false
			}
		} else {
			isCorrect = selected === question.answer
		}
		const newPoints = isCorrect ? test.points + 1 : test.points
		const nextQuestion = current + 1
		const updatedCodeAnswers = question.type === "code"
			? { ...test.codeAnswers, [`q${current}`]: codeValue }
			: test.codeAnswers

		setShowModal(false)
		setHasConfirmedOnce(true)
		setSelected(null)
		track({ email: user.email, event: "question_answered", detail: `${newPoints} correct so far` })

		if (nextQuestion >= total) {
			setTest({ points: newPoints, currentQuestion: nextQuestion, codeAnswers: updatedCodeAnswers })
			router.push(`/score?points=${newPoints}&total=${total}&set=${test.questionSet ?? ""}`)
		} else {
			setTest({ points: newPoints, currentQuestion: nextQuestion, codeAnswers: updatedCodeAnswers })
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

	// Countdown tick — auto-submits at 0 (must be before early return)
	useEffect(() => {
		if (timeLeft <= 0) {
			submitRef.current()
			return
		}
		const id = setTimeout(() => setTimeLeft((t: number) => t - 1), 1000)
		return () => clearTimeout(id)
	}, [timeLeft])

	if (!question) return null

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
						<CircularTimer timeLeft={timeLeft} maxTime={questionTimer} />
					</div>

					<div className="bg-white rounded-sm shadow-sm flex flex-col gap-5 p-4 sm:p-6">
						<Badge label={question.type === "code" ? "Code" : "Multiple Choice"} color="primary" />
						<Prompt title={question.question} />
						{question.type === "code" ? (
							<CodeEditor
								key={current}
								filename="exercise.tsx"
								defaultValue={question.code ?? ""}
								defaultLanguage="typescript"
								height="350px"
								disablePaste
								onChange={(v) => setCodeValue(v)}
							/>
						) : (
							<MultipleChoice
								options={options}
								selected={selected}
								onChange={setSelected}
							/>
						)}
						<div className="flex justify-end">
							<button
								disabled={question.type === "code" ? false : !selected}
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
