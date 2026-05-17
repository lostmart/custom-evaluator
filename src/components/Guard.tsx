"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext"
import { useTest } from "@/context/TestContext"
import Modal from "@/components/ui/Modal"

export default function Guard({ children }: { children: React.ReactNode }) {
	const { user } = useUser()
	const { setTest } = useTest()
	const router = useRouter()
	const [showModal, setShowModal] = useState(false)

	useEffect(() => {
		if (!user.hasStarted) router.replace("/")
	}, [user.hasStarted, router])

	useEffect(() => {
		if (!user.hasStarted) return

		function handleBeforeUnload(e: BeforeUnloadEvent) {
			e.preventDefault()
		}

		function handlePopState() {
			history.pushState(null, "", window.location.href)
			setShowModal(true)
		}

		history.pushState(null, "", window.location.href)
		window.addEventListener("beforeunload", handleBeforeUnload)
		window.addEventListener("popstate", handlePopState)

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload)
			window.removeEventListener("popstate", handlePopState)
		}
	}, [user.hasStarted])

	function handleConfirm() {
		setTest({ cancelled: true })
		setShowModal(false)
		router.replace("/cancelled")
	}

	if (!user.hasStarted) return null

	return (
		<>
			{children}
			<Modal
				show={showModal}
				title="Cancel evaluation?"
				message="Leaving now will cancel your evaluation. Your answers will not be saved."
				onConfirm={handleConfirm}
				onCancel={() => setShowModal(false)}
				color="tertiary"
			/>
		</>
	)
}
