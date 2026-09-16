import Link from "next/link"
import { GOAL_OPTIONS } from "./constants"
import type { StepGoalsProps } from "./types"

export default function StepGoals({
  goals,
  onGoalsChange,
  onSubmit,
  status,
  message,
  email,
}: StepGoalsProps) {
  const toggle = (opt: string) => {
    if (goals.includes(opt)) {
      onGoalsChange(goals.filter((g) => g !== opt))
    } else {
      onGoalsChange([...goals, opt])
    }
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        <p className="mt-4 text-default-300">Saving…</p>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="py-16 text-center">
        <h2 className="text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
          Thank you
        </h2>
        <p className="mt-4 text-lg text-default-200 md:text-xl">
          It&apos;s a pleasure to be a part of your journey.
        </p>
        <Link href="/#projects" className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-default-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary">Checkout our other projects</Link>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-white md:text-3xl">
        What are your goals?
      </h2>
      <p className="mt-3 text-default-200">
        Help us tailor LAIZ for you. We&apos;ve saved{" "}
        <span className="font-medium text-white">{email}</span>. Select all that apply.
      </p>
      <form onSubmit={onSubmit} className="mt-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex w-full max-w-sm flex-col gap-2 rounded-lg border border-white/20 bg-white/5 p-4">
            {GOAL_OPTIONS.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-3 text-default-200 transition-colors hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={goals.includes(opt)}
                  onChange={() => toggle(opt)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/30"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={goals.length === 0}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-default-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary"
          >
            Finish
          </button>
        </div>
        {message && status === "error" && (
          <p className="mt-4 text-sm text-red-400">{message}</p>
        )}
      </form>
    </>
  )
}
