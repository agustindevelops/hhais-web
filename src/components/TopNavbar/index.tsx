"use client"

import { useEffect, useRef, useState } from "react"
import type { NavbarLinkProps } from "@/types/data"
import useScrollEvent from "@/hooks/useScrollEvent"
import { useActiveSection } from "@/hooks/useActiveSection"
import { usePathname } from "next/navigation"

import NavbarLogo from "./NavbarLogo"
import MobileMenuToggle from "./MobileMenuToggle"
import NavbarNav from "./NavbarNav"
import ButtonCTA from "../ButtonCTA"

type TopNavbarProps = {
  navLinks: NavbarLinkProps[]
}

export default function TopNavbar({ navLinks }: TopNavbarProps) {
  const navRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScrollEvent()
  const pathname = usePathname()
  const activeSection = useActiveSection()
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const getSectionId = (link: string) => link.replace(/^[^#]*#/, '') || null
  const isActive = (link: string) => {
    if (!link.includes('#')) {
      return pathname === link || (link !== '/' && pathname.startsWith(`${link}/`))
    }
    return pathname === '/' && getSectionId(link) === activeSection
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest("[data-nav-dropdown]")) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleDropdownClose = () => {
    setIsOpen(false)
    setOpenDropdown(null)
  }

  return (
    <header id="navbar-sticky" className={`navbar ${scrollY >= 50 && 'nav-sticky'}`}>
      <div className="container">
        <nav>
          <NavbarLogo />
          <MobileMenuToggle isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
          <div
            ref={navRef}
            id="mobileMenu"
            className={`
              py-4 transition-all duration-300
              lg:basis-auto basis-full grow
              ${isOpen ? "flex" : "hidden"}
              lg:flex items-center justify-center mx-auto mt-2 lg:mt-0
            `}
          >
            <NavbarNav
              navLinks={navLinks}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleDropdownClose={handleDropdownClose}
              isActive={isActive}
              onLinkClick={() => setIsOpen(false)}
            />
          </div>
          <div className="hidden lg:flex items-center py-4">
            <ButtonCTA />
          </div>
        </nav>
      </div>
    </header>
  )
}
