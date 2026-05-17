"use client"

import { useState } from "react"
import Badge from "@/components/ui/Badge"
import CodeContext from "@/components/question/CodeContext"
import CodeEditor from "@/components/question/CodeEditor"
import Guard from "@/components/Guard"
import Hint from "@/components/ui/Hint"
import MultipleChoice from "@/components/question/MultipleChoice"
import Nav from "@/components/ui/Nav"
import ProgressBar from "@/components/ui/ProgressBar"
import Prompt from "@/components/ui/Prompt"

const current = 3
const total = 10

type QuestionType = "multiple" | "code"

const options = [
	{ id: "o1",    label: "O(1)" },
	{ id: "on",    label: "O(n)" },
	{ id: "ologn", label: "O(log n)" },
	{ id: "on2",   label: "O(n²)" },
]

const contextCode = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    // ... logic continues
  }
}`

export default function QuestionPage() {
	const [type, setType] = useState<QuestionType>("multiple")
	const [selected, setSelected] = useState<string | null>(null)

	return (
		<Guard>
			<div className="min-h-screen flex flex-col bg-stone-100 font-sans">
				<ProgressBar current={current} total={total} />
				<Nav title="Assessment Engine" />

				<main className="flex flex-col gap-6 px-8 py-8 w-full max-w-2xl mx-auto">
					{/* Dev toggle — remove when questions are driven by data */}
					<div className="flex gap-2">
						<button
							onClick={() => setType("multiple")}
							className={`text-xs font-mono px-3 py-1.5 border transition ${type === "multiple" ? "bg-secondary text-white border-secondary" : "border-zinc-300 text-zinc-500 hover:border-zinc-400"}`}
						>
							multiple
						</button>
						<button
							onClick={() => setType("code")}
							className={`text-xs font-mono px-3 py-1.5 border transition ${type === "code" ? "bg-secondary text-white border-secondary" : "border-zinc-300 text-zinc-500 hover:border-zinc-400"}`}
						>
							code
						</button>
					</div>

					{type === "multiple" && (
						<>
							<div className="flex flex-col gap-1">
								<span className="text-xs font-mono uppercase tracking-widest text-tertiary">
									Module 2: Search Algorithms
								</span>
								<h1 className="text-2xl font-semibold text-secondary">
									Question {current} of {total}
								</h1>
							</div>

							<div className="bg-white rounded-sm shadow-sm flex flex-col gap-5 p-6">
								<div className="flex gap-2 flex-wrap">
									<Badge label="Code Input" color="primary" />
									<Badge label="Complexity Analysis" color="secondary" />
								</div>
								<Prompt title="Which of the following best describes the time complexity of a binary search in the average and worst cases?" />
								<MultipleChoice
									options={options}
									selected={selected}
									onChange={setSelected}
								/>
								<CodeContext
									title="Context: Binary Search Implementation"
									code={contextCode}
								/>
								<div className="flex justify-end">
									<button
										disabled={!selected}
										className="bg-primary text-white text-sm font-medium px-6 py-2.5 hover:opacity-90 active:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
									>
										Submit Answer →
									</button>
								</div>
							</div>

							<Hint
								text="Think about how binary search halves the search space at every step."
								color="primary"
							/>
						</>
					)}

					{type === "code" && (
						<>
							<div className="flex items-start justify-between gap-4">
								<div className="flex flex-col gap-2 flex-1">
									<h1 className="text-2xl font-semibold text-secondary">
										Question {current} of {total}
									</h1>
									<ProgressBar current={current} total={total} />
								</div>
								<span className="mt-1 text-xs font-mono bg-zinc-100 text-zinc-500 px-3 py-1.5 rounded shrink-0">
									30 Points
								</span>
							</div>

							<div className="bg-white rounded-sm shadow-sm flex flex-col gap-5 p-6">
								<Badge label="Code Input" color="primary" />
								<Prompt
									title="Write a JavaScript function to reverse a string."
									description="The function should take one argument str and return the reversed version of that string."
								/>
								<CodeEditor
									filename="solution.js"
									defaultValue={`function reverseString(str) {\n  // Your code here\n\n}`}
								/>
								<div className="flex justify-end">
									<button className="bg-primary text-white text-sm font-medium px-6 py-2.5 hover:opacity-90 active:opacity-80 transition">
										Submit Answer
									</button>
								</div>
							</div>

							<Hint
								text="Consider using built-in string and array methods like split(), reverse(), and join()."
								color="primary"
							/>
						</>
					)}
				</main>
			</div>
		</Guard>
	)
}
