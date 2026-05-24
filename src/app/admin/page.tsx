import db, { ready } from "@/lib/db"
import LogoutButton from "./LogoutButton"
import DeleteButton from "./DeleteButton"

export const dynamic = "force-dynamic"

type Event = {
  id: number
  timestamp: string
  email: string
  name: string
  event: string
  detail: string
}

const EVENT_STYLES: Record<string, { label: string; className: string }> = {
  started: {
    label: "started",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  completed: {
    label: "completed",
    className: "bg-sky-50 text-sky-700 border border-sky-200",
  },
}

function EventBadge({ event }: { event: string }) {
  const style = EVENT_STYLES[event] ?? {
    label: event,
    className: "bg-zinc-100 text-zinc-500 border border-zinc-200",
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-sm text-xs font-mono ${style.className}`}>
      {style.label}
    </span>
  )
}

export default async function AdminPage() {
  await ready
  const result = await db.execute("SELECT * FROM events ORDER BY id DESC")
  const events = result.rows as unknown as Event[]

  const total = events.length
  const started = events.filter((e) => e.event === "started").length
  const completed = events.filter((e) => e.event === "completed").length

  return (
    <div className="min-h-screen bg-stone-100 font-sans">
      <header className="bg-white border-b border-zinc-200 px-10 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              EPITA — Admin
            </span>
            <h1 className="text-lg font-semibold text-secondary">Event Log</h1>
          </div>
          <LogoutButton />
          <div className="flex items-center gap-6 text-right">
            <div>
              <p className="text-xs text-zinc-400 font-mono">Sessions started</p>
              <p className="text-xl font-semibold text-secondary">{started}</p>
            </div>
            <div className="w-px h-8 bg-zinc-200" />
            <div>
              <p className="text-xs text-zinc-400 font-mono">Completed</p>
              <p className="text-xl font-semibold text-secondary">{completed}</p>
            </div>
            <div className="w-px h-8 bg-zinc-200" />
            <div>
              <p className="text-xs text-zinc-400 font-mono">Total events</p>
              <p className="text-xl font-semibold text-secondary">{total}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-10 py-8">
        {events.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm p-16 text-center">
            <p className="text-sm text-zinc-400 font-mono">No events recorded yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-zinc-400 w-8">#</th>
                  <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-zinc-400">Timestamp</th>
                  <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-zinc-400">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-zinc-400">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-zinc-400">Event</th>
                  <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-zinc-400">Detail</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {events.map((event, i) => (
                  <tr
                    key={event.id}
                    className={`border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-stone-50/60"}`}
                  >
                    <td className="px-5 py-3 text-xs text-zinc-300 font-mono">{event.id}</td>
                    <td className="px-5 py-3 text-xs text-zinc-400 font-mono whitespace-nowrap">{event.timestamp}</td>
                    <td className="px-5 py-3 text-sm text-secondary font-medium">{event.name}</td>
                    <td className="px-5 py-3 text-xs text-zinc-400 font-mono">{event.email}</td>
                    <td className="px-5 py-3">
                      <EventBadge event={event.event} />
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-400 font-mono">{event.detail || "—"}</td>
                    <td className="px-5 py-3 text-right">
                      <DeleteButton id={event.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
