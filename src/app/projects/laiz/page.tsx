import Hero from "./components/Hero"
import Features from "./components/Features"
import EmailSubscribe from "./components/EmailSubscribe"

export const metadata = {
  title: "LAIZ – Health Tracking App",
  description: "Track your health, habits, and wellness in one place. Get early access to LAIZ.",
}

export default function LaizLandingPage() {
  return (
    <main>
      <Hero />
      <Features />
      <EmailSubscribe />
    </main>
  )
}
