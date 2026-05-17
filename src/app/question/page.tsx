"use client"

import { useState } from "react"
import Badge from "@/components/Badge"
import CodeContext from "@/components/CodeContext"
import Guard from "@/components/Guard"
import Hint from "@/components/Hint"
import MultipleChoice from "@/components/MultipleChoice"
import Nav from "@/components/Nav"
import ProgressBar from "@/components/ProgressBar"
import Prompt from "@/components/Prompt"

const current = 3
const total = 10

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
	const [selected, setSelected] = useState<string | null>(null)

	return (
		<Guard>
			<div className="min-h-screen flex flex-col bg-stone-100 font-sans">
				<ProgressBar current={current} total={total} />
				<Nav title="Assessment Engine" />

				<main className="flex flex-col gap-6 px-8 py-8 w-full max-w-2xl mx-auto">
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
				</main>
			</div>
		</Guard>
	)
}
