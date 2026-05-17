import Badge from "@/components/Badge"
import CodeEditor from "@/components/CodeEditor"
import Guard from "@/components/Guard"
import Hint from "@/components/Hint"
import Nav from "@/components/Nav"
import ProgressBar from "@/components/ProgressBar"
import Prompt from "@/components/Prompt"

const current = 7
const total = 10

export default function QuestionPage() {
	return (
		<Guard>
		<div className="min-h-screen flex flex-col bg-stone-100 font-sans">
			<ProgressBar current={current} total={total} />
			<Nav title="Assessment Engine" />

			<main className="flex flex-col gap-6 px-8 py-8 w-full max-w-2xl mx-auto">
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
			</main>
		</div>
		</Guard>
	)
}
