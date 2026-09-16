export type SubscribeStatus = "idle" | "loading" | "success" | "error"

export type SubscribeStep = 1 | 2

export type StepEmailProps = {
  email: string
  onEmailChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  status: SubscribeStatus
  message: string
}

export type StepGoalsProps = {
  goals: string[]
  onGoalsChange: (value: string[]) => void
  onSubmit: (e: React.FormEvent) => void
  status: SubscribeStatus
  message: string
  email: string
}
