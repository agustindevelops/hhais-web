"use client"

import type { ChildrenType } from "@/types/other"
import { Fragment, useEffect } from "react"
import Aos from "aos"
import BackToTop from "../BackToTop"

const AppProviders = ({ children }: ChildrenType) => {
  useEffect(() => {
    Aos.init()

    const splashElement = document.querySelector<HTMLDivElement>("#__next_splash")
    const splashScreen = document.querySelector("#splash-screen")

    if (!splashElement || !splashScreen) return

    const handleMutations = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && splashElement.hasChildNodes()) {
          splashScreen.classList.add("remove")
        }
      }
    }

    const observer = new MutationObserver(handleMutations)
    observer.observe(splashElement, { childList: true, subtree: true })

    if (splashElement.hasChildNodes()) splashScreen.classList.add("remove")

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <Fragment>
      {children}
      <BackToTop />
    </Fragment>
  )
}

export default AppProviders
