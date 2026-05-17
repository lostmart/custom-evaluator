"use client"

import { createContext, useContext, useState } from "react"

type UserState = {
	name: string
	email: string
	hasStarted: boolean
}

type UserContextValue = {
	user: UserState
	setUser: (data: Partial<UserState>) => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUserState] = useState<UserState>({
		name: "",
		email: "",
		hasStarted: false,
	})

	function setUser(data: Partial<UserState>) {
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
