"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass }),
    })

    if (res.ok) {
      router.push("/admin")
    } else {
      setError("Invalid credentials.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-200 font-sans">
      <main className="w-full max-w-sm flex flex-col gap-8 bg-white rounded-sm shadow-sm px-10 py-12">
        <header className="flex flex-col gap-1">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            EPITA — Admin
          </span>
          <h1 className="text-2xl font-semibold text-secondary">Sign in</h1>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">Username</span>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              autoFocus
              className="border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">Password</span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              className={`border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition ${error ? "border-red-400" : "border-zinc-200"}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-primary text-white text-sm font-medium px-6 py-3 hover:opacity-90 active:opacity-80 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>
      </main>
    </div>
  )
}
