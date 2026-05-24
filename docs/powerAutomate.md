# Power Automate Integration

Track student assessment events in real time by POSTing to a Power Automate HTTP trigger, which appends rows to a Google Sheets spreadsheet.

---

## Google Sheets Setup

1. Create a new spreadsheet on Google Sheets, e.g. `Assessment Events`
2. On the first row, add these headers exactly:

| timestamp | email | name | event | detail |
|---|---|---|---|---|

3. Note the spreadsheet name (you'll need it when configuring Power Automate)

---

## Power Automate Flow Setup

1. Go to [Power Automate](https://make.powerautomate.com) → **Create** → **Instant cloud flow**
2. Name it `Assessment Events`, trigger: **When an HTTP request is received**
3. Set **Request Body JSON Schema**:

```json
{
  "type": "object",
  "properties": {
    "timestamp": { "type": "string" },
    "email":     { "type": "string" },
    "name":      { "type": "string" },
    "event":     { "type": "string" },
    "detail":    { "type": "string" }
  }
}
```

4. Add action: **Google Sheets** → **Insert row**
   - Sign in with your Google account when prompted
   - File: `Assessment Events`
   - Worksheet: `Sheet1` (or whatever your sheet tab is named)
   - Map each column to the matching field from the HTTP body

5. Save the flow — copy the generated **HTTP POST URL**

---

## App Setup

Add the webhook URL to your environment:

```
# .env.local
NEXT_PUBLIC_PA_WEBHOOK_URL=https://prod-xx.westeurope.logic.azure.com/...
```

---

## Events Tracked

| event | when | detail |
|---|---|---|
| `started` | Student submits registration and begins | question set id (e.g. `set1`) |
| `question_answered` | Each question is submitted | `{correct} correct so far` |
| `completed` | Final submission | `{n}/{total} correct` |

---

## App Changes (to implement)

- `src/lib/track.ts` — fire-and-forget POST utility
- Called from `page.tsx` on start, `question/page.tsx` on each answer, `score/page.tsx` on completion
