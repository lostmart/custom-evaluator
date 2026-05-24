```
type QuestionType = "multiple" | "code" | "text"

type Question = {
    question: string
    title?: string
    answer: string
    type: QuestionType
    options?: string[]
}
```
