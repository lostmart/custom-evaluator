"use client"

import { createContext, useContext, useState } from "react"

type TestState = {
	currentQuestion: number
	points: number
	cancelled: boolean
}

type TestContextValue = {
	test: TestState
	setTest: (data: Partial<TestState>) => void
}

const TestContext = createContext<TestContextValue | null>(null)

export function TestProvider({ children }: { children: React.ReactNode }) {
	const [test, setTestState] = useState<TestState>({
		currentQuestion: 0,
		points: 0,
		cancelled: false,
	})

	function setTest(data: Partial<TestState>) {
		setTestState((prev) => ({ ...prev, ...data }))
	}

	return (
		<TestContext.Provider value={{ test, setTest }}>
			{children}
		</TestContext.Provider>
	)
}

export function useTest() {
	const ctx = useContext(TestContext)
	if (!ctx) throw new Error("useTest must be used inside <TestProvider>")
	return ctx
}
