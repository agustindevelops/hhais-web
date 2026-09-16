"use client"

import type { NavbarLinkProps } from "@/types/data"
import NavDropdown from "./NavDropdown"
import NavLink from "./NavLink"
import ButtonCTA from "../ButtonCTA"

type NavbarNavProps = {
  navLinks: NavbarLinkProps[]
  openDropdown: string | null
  setOpenDropdown: (label: string | null) => void
  handleDropdownClose: () => void
  isActive: (link: string) => boolean
  onLinkClick: () => void
}

export default function NavbarNav({
  navLinks,
  openDropdown,
  setOpenDropdown,
  handleDropdownClose,
  isActive,
  onLinkClick,
}: NavbarNavProps) {
  return (
    <ul id="navbar-navlist" className="navbar-nav group flex flex-wrap gap-2">
      {navLinks.map((item, idx) => {
        const hasChildren = item.children && item.children.length > 0

        if (hasChildren) {
          return (
            <NavDropdown
              key={item.link + idx}
              item={item}
              idx={idx}
              isOpen={openDropdown === item.label}
              onOpenChange={setOpenDropdown}
              onClose={handleDropdownClose}
              isActive={isActive(item.link)}
            />
          )
        }

        return (
          <NavLink
            key={item.link + idx}
            item={item}
            idx={idx}
            isActive={isActive(item.link)}
            onNavigate={onLinkClick}
          />
        )
      })}
      <li className="lg:hidden flex items-center pt-4 mt-4 lg:pt-0 lg:mt-0 border-t border-white/10 lg:border-none">
        <ButtonCTA />
      </li>
    </ul>
  )
}
