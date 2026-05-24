"use client"

import { useRouter } from "next/navigation"

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter()

  async function handleDelete() {
    await fetch(`/api/events/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs font-mono text-red-400 hover:text-red-600 transition"
    >
      delete
    </button>
  )
}
