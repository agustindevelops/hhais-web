"use client"

import { InlineWidget } from "react-calendly"

const CalendlyPage = () => {
  return (
    <section className="flex justify-center items-center w-full py-20 px-2">
        <InlineWidget
          url="https://calendly.com/agustindevelops/30min?hide_gdpr_banner=1"
          styles={{
            width: "100%",
          }}
          pageSettings={{
            backgroundColor: "ffffff",
            primaryColor: "00a2ff",
            textColor: "000000",
            hideLandingPageDetails: false,
            hideEventTypeDetails: false,
          }}
        />
    </section>
  )
}

export default CalendlyPage
