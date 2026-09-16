import AuthImage from "@/components/AuthImage"
import Link from "next/link"
import logo from '@/assets/images/logo.png'
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Forgot" }

const ForgotPassword = () => {
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
            <div className="my-auto">
              <h4 className="mb-3 text-2xl font-bold text-white">Forgot Password?</h4>
              <p className="mb-8 max-w-sm text-default-300">
                Enter your email address and password to access account.
              </p>
              <form action="#" className="text-start">
                <div className="mb-4">
                  <label htmlFor="emailaddress" className="mb-2 block text-base/normal font-semibold text-default-200">Email address</label>
                  <input className="block w-full rounded border-default-200 border-white/10 bg-transparent px-3 py-1.5 text-white/80 focus:border-white/25 focus:ring-transparent" type="email" id="emailaddress" required placeholder="Enter your email" />
                </div>
                <div className="text-center">
                  <button className="bg-primary-600/90 hover:bg-primary-600 group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500" type="submit">
                    <span className="fw-bold">Log In</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </div >
      <div className="mt-5 w-full text-center">
        <p className="text-base font-medium leading-6 text-default-300">
          Back To
          <Link href="/auth/login" className="ms-1 font-semibold text-primary">Log In</Link>
        </p>
      </div>
    </>


  )
}

export default ForgotPassword