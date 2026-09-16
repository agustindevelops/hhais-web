import AuthImage from "@/components/AuthImage"
import Image from "next/image"
import Link from "next/link"
import logo from '@/assets/images/logo.png'
import avatar1 from '@/assets/images/avatars/img-1.png'
import ThirdPartyLogin from "@/components/ThirdPartyLogin"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "LockScreen" }

const LockScreen = () => {
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
            <div className="mt-auto text-center">
              <div className="mx-auto mb-4 inline-flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 p-1.5">
                <Image src={avatar1} alt="avatar-img-8" className="h-full w-full rounded-full" />
              </div>
              <h4 className="mb-4 text-2xl font-bold text-white">Hi Adams</h4>
              <p className="mx-auto mb-5 max-w-sm text-default-300">
                Enter your password to access.
              </p>
              <form action="#" className="text-start">
                <div className="mb-4">
                  <label htmlFor="password" className="mb-2 block text-base/normal font-semibold text-default-200">Password</label>
                  <input className="block w-full rounded border-default-200 border-white/10 bg-transparent px-3 py-1.5 text-white/80 focus:border-white/25 focus:ring-transparent" type="password" required id="password" placeholder="Enter your password" />
                </div>
                <div className="text-center">
                  <button className="bg-primary-600/90 hover:bg-primary-600 group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500" type="submit">
                    <span className="fw-bold">Log In</span>
                  </button>
                </div>
              </form>
            </div>
            <div className="mt-10">
              <ThirdPartyLogin /></div>
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

export default LockScreen