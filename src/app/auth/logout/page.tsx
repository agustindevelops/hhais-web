import AuthImage from "@/components/AuthImage"
import Image from "next/image"
import Link from "next/link"
import logo from '@/assets/images/logo.png'
import logoSvg from '@/assets/images/logout.svg'
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Logout" }

const Logout = () => {
  return (
    <>
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-default-950/40 backdrop-blur-2xl">
        <div className="grid gap-10 lg:grid-cols-2">
          <AuthImage />
          <div className="flex h-full flex-col p-10 lg:ps-0">
            <div className="pb-10">
              <Link href="/" className="flex">
                <Image src={logo} width={124} height={40} alt="dark logo" className="h-10" />
              </Link>
            </div>
            <div className="my-auto pb-6 text-center">
              <h4 className="mb-4 text-2xl font-bold text-white">See you Again!</h4>
              <p className="mx-auto mb-5 max-w-sm text-default-300">
                You are now successfully sign out.
              </p>
              <div className="flex items-start justify-center">
                <Image src={logoSvg} alt="lo" className="h-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 w-full text-center">
        <p className="text-base font-medium leading-6 text-default-300">
          Back to
          <Link href="/auth/login" className="ms-1 font-semibold text-primary">Log In</Link>
        </p>
      </div>
    </>
  )
}

export default Logout