import type { StepEmailProps } from "./types"

export default function StepEmail({
  email,
  onEmailChange,
  onSubmit,
  status,
  message,
}: StepEmailProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold text-white md:text-3xl">
        Get early access
      </h2>
      <p className="mt-3 text-default-200">
        Be the first to try LAIZ. Enter your email to get notified when we
        launch our health tracking app.
      </p>
      <form onSubmit={onSubmit} className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === "loading"}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-default-400 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-60 sm:w-72"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-default-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary"
          >
            {status === "loading" ? "Subscribing…" : "Continue"}
          </button>
        </div>
        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "success" ? "text-green-500" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </>
  )
}
