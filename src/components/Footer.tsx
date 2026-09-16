import { currentYear } from '@/common/constants'
import React from 'react'

const Footer = () => {
  return (
<div className="border-t border-white/10 py-6">
  <div className="container lg:px-20 flex flex-wrap justify-center items-center gap-4 h-full md:justify-between text-center md:text-start">
    <p className="text-base font-medium text-default-400">
      {currentYear} © <span className="font-semibold text-white">Helping Hand AI Solutions</span> —
      <span className="italic text-primary">We build the tech. You build the future.</span>&nbsp;
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        data-lucide="robot"
        className="lucide lucide-robot inline h-4 w-4 text-blue-500 fill-blue-500"
      >
        <rect x="3" y="8" width="18" height="8" rx="2" />
        <rect x="7" y="16" width="10" height="4" rx="1" />
        <circle cx="8.5" cy="12" r="1" />
        <circle cx="15.5" cy="12" r="1" />
        <path d="M12 8V4" />
        <path d="M9 4h6" />
        <path d="M4 4v4" />
        <path d="M20 4v4" />
      </svg>
    </p>
  </div>
</div>


  )
}

export default Footer
