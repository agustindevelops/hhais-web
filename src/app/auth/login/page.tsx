import AuthImage from "@/components/AuthImage"
import ThirdPartyLogin from "@/components/ThirdPartyLogin"
import Image from "next/image"
import Link from "next/link"
import logo from '@/assets/images/logo.png'
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Login" }

const Login = () => {
  return (
    <>
      <div className="backdrop-blur-2xl bg-default-950/40 rounded-2xl overflow-hidden max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          <AuthImage />
          <div className="flex flex-col h-full p-10 lg:ps-0">
            <div className="pb-10">
              <Link href="/" className="flex">
                <Image src={logo} width={124} height={40} alt="dark logo" className="h-10" />
              </Link>
            </div>
            <div className="pb6 my-auto">
              <h4 className="text-2xl font-bold text-white mb-4">Get Started Now</h4>
              <p className="text-default-300 mb-8 max-w-sm ">Enter your email address and password to access account.</p>
              <form action="#" className="text-start">
                <div className="mb-4">
                  <label htmlFor="emailaddress" className="block text-base/normal font-semibold text-default-200 mb-2">Email address</label>
                  <input className="block w-full rounded py-1.5 px-3 bg-transparent border-white/10 border-default-200 text-white/80 focus:border-white/25 focus:ring-transparent" type="email" id="emailaddress" required placeholder="Enter your email" />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-base/normal font-semibold text-default-200 mb-2">Password</label>
                  <input className="block w-full rounded py-1.5 px-3 bg-transparent border-white/10 border-default-200 text-white/80 focus:border-white/25 focus:ring-transparent" type="password" required id="password" placeholder="Enter your password" />
                </div>
                <div className="mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-y-1">
                    <div>
                      <input type="checkbox" className="h-4 w-4 rounded text-primary border-white/20 bg-white/20 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary/60 focus:ring-offset-0" id="checkbox-signin" />
                      <label className="ms-2 text-default-200 align-middle" htmlFor="checkbox-signin">Remember me</label>
                    </div>
                    <Link href="/auth/forgot-pw" className="text-default-200 border-b border-dashed"><small>Forgot your password?</small></Link>
                  </div>
                </div>
                <div className="mb-6 text-center">
                  <button className="w-full inline-flex items-center justify-center px-6 py-2 backdrop-blur-2xl bg-primary-600/90 text-white rounded-lg transition-all duration-500 group hover:bg-primary-600 mt-5" type="submit"><span className="fw-bold">Sign In</span> </button>
                </div>
              </form>
            </div>
            <ThirdPartyLogin />
          </div>
        </div>
      </div>
      <div className="w-full text-center mt-5">
        <p className="text-default-300 leading-6 text-base font-medium">Don&apos;t have an account? <Link href="/auth/register" className="text-primary font-semibold ms-1">Sign Up</Link></p>
      </div>
    </>
  )
}

export default Login