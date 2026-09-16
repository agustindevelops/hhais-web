"use client"
import { currentYear } from "@/common/constants"
import Background2 from "@/components/Background2"
import type { ChildrenType } from "@/types/other"
import Link from "next/link"
import { useEffect } from "react"

const AuthLayout = ({ children }: ChildrenType) => {
  useEffect(() => {
    document.body.classList.add('bg-slate-900', 'relative', 'h-full')
    return (() => {
      document.body.classList.remove('bg-slate-900', 'relative', 'h-full')
    })
  }, [])
  return (
    <>
      <Background2 />
      <section className="flex items-center py-6 px-0 lg:p-10 w-full lg:h-screen">
        <div className="container">
          {children}
        </div>
      </section>
      <footer className="2xl:fixed bottom-0 start-0 end-0 py-3">
        <div className="container">
          <p className="text-base font-medium text-center text-default-200">
            {currentYear} © WebAi - <Link href="">Design &amp; Crafted ❤️ by Coderthemes</Link>
          </p>
        </div>
      </footer>
    </>
  )
}

export default AuthLayout
