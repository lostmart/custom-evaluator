"use client"

import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs font-mono text-zinc-400 hover:text-zinc-600 transition"
    >
      Sign out
    </button>
  )
}
