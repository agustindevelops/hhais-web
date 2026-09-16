import { currentYear, developedBy } from '@/common/constants'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-default-950/40 backdrop-blur-3xl">
      <div className="border-t border-white/10 py-6">
        <div className="container lg:px-20 flex flex-wrap justify-center items-center gap-4 h-full md:justify-between text-center md:text-start">
          <p className="text-base font-medium text-gray-400">
           {currentYear} © WebAi - <Link href="">Design &amp; Crafted <IconifyIcon icon="lucide:heart" className="inline h-4 w-4 text-red-500 fill-red-500" /> by {developedBy}</Link>
          </p>
          <p className="text-base font-medium text-gray-400">
            <Link href="">Terms Conditions &amp; Policy</Link>
          </p>
        </div>
      </div>
    </footer>

  )
}

export default Footer
