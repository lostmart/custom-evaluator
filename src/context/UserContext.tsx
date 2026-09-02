"use client"

import { createContext, useContext, useEffect, useState } from "react"

type UserState = {
	email: string
	hasStarted: boolean
	hydrated: boolean
}

type UserContextValue = {
	user: UserState
	setUser: (data: Partial<UserState>) => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUserState] = useState<UserState>({
		email: "",
		hasStarted: false,
		hydrated: false,
	})

	useEffect(() => {
		setUserState((prev) => ({
			...prev,
			email: localStorage.getItem("user_email") ?? "",
			hydrated: true,
		}))
	}, [])

	function setUser(data: Partial<UserState>) {
		if (data.email !== undefined) localStorage.setItem("user_email", data.email)
		setUserState((prev) => ({ ...prev, ...data }))
	}

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	)
}

export function useUser() {
	const ctx = useContext(UserContext)
	if (!ctx) throw new Error("useUser must be used inside <UserProvider>")
	return ctx
}
