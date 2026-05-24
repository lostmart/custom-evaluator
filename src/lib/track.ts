type TrackEvent = "started" | "question_answered" | "completed"

type TrackPayload = {
  email: string
  name: string
  event: TrackEvent
  detail: string
}

export function track(payload: TrackPayload) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp: new Date().toLocaleString("sv-SE", { timeZone: "Europe/Paris" }),
      ...payload,
    }),
  }).catch(() => {})
}
