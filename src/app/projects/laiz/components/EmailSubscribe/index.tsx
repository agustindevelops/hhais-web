"use client"

import { useState } from "react"
import { subscribeBrevo, updateBrevoContact } from "../../actions/brevo"
import StepEmail from "./StepEmail"
import StepGoals from "./StepGoals"
import type { SubscribeStatus, SubscribeStep } from "./types"

/** Brevo list: /contact/list-listing/id/4 */
const LAIZ_LIST_ID = 4

export default function EmailSubscribe() {
  const [step, setStep] = useState<SubscribeStep>(1)
  const [email, setEmail] = useState("")
  const [contactId, setContactId] = useState<number | null>(null)
  const [goals, setGoals] = useState<string[]>([])
  const [status, setStatus] = useState<SubscribeStatus>(
    "idle"
  )
  const [message, setMessage] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    setMessage("")

    try {
      const data = await subscribeBrevo({ email: email.trim() }, LAIZ_LIST_ID)
      if (data.id != null) {
        setContactId(data.id)
        setStep(2)
        setMessage("")
      } else {
        setMessage("Thanks! We'll be in touch.")
      }
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setStatus("idle")
    }
  }

  const handleGoalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (goals.length === 0 || contactId == null) return
    setStatus("loading")
    setMessage("")

    try {
      await updateBrevoContact(contactId, goals)
      setStatus("success")
      setMessage("")
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  return (
    <section
      className="py-20 md:py-28"
      data-aos="fade-up"
      data-aos-easing="ease"
      data-aos-duration={800}
    >
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          {step === 1 ? (
            <StepEmail
              email={email}
              onEmailChange={setEmail}
              onSubmit={handleEmailSubmit}
              status={status}
              message={message}
            />
          ) : (
            <StepGoals
              goals={goals}
              onGoalsChange={setGoals}
              onSubmit={handleGoalsSubmit}
              status={status}
              message={message}
              email={email}
            />
          )}
        </div>
      </div>
    </section>
  )
}
