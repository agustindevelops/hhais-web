"use client"

import Link from "next/link"
import IconifyIcon from "../wrappers/IconifyIcon"
import type { NavbarLinkProps } from "@/types/data"

type NavDropdownProps = {
  item: NavbarLinkProps
  idx: number
  isOpen: boolean
  onOpenChange: (label: string | null) => void
  onClose: () => void
  isActive: boolean
}

export default function NavDropdown({
  item,
  idx,
  isOpen,
  onOpenChange,
  onClose,
  isActive,
}: NavDropdownProps) {
  return (
    <li
      key={item.link + idx}
      data-nav-dropdown
      className={`nav-item relative group/dd ${isActive ? "active" : ""}`}
      onMouseEnter={() => onOpenChange(item.label)}
      onMouseLeave={() => onOpenChange(null)}
    >
      <a
        href={item.link}
        className="nav-link nav-dropdown-trigger inline-flex flex-row items-center gap-1 flex-nowrap whitespace-nowrap"
        onClick={onClose}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{item.label}</span>
        <IconifyIcon
          icon="lucide:chevron-down"
          className={`h-4 w-4 transition-transform rotate-180 lg:rotate-0 ${isOpen ? "lg:rotate-180" : ""}`}
        />
      </a>
      {/* Mobile: flex-col list with indented children, always visible */}
      <div className="flex flex-col gap-1 mt-2 lg:hidden">
        {(item.children ?? []).map((child) => (
          <Link
            key={child.link}
            href={child.link}
            className="block py-2 pl-6 text-sm text-default-200 hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary/50"
            onClick={onClose}
          >
            {child.label}
          </Link>
        ))}
      </div>

      {/* Desktop: floating dropdown panel */}
      <div
        className={`
          hidden lg:block absolute top-full right-0 pt-3 -mt-3 min-w-[200px]
          rounded-lg border border-white/10
          bg-default-950/95 backdrop-blur-xl shadow-xl z-[9999]
          transition-all duration-200 origin-top-right
          opacity-0 invisible pointer-events-none
          group-hover/dd:opacity-100 group-hover/dd:visible group-hover/dd:pointer-events-auto
          ${isOpen ? "!visible !opacity-100 !pointer-events-auto" : ""}
        `}
      >
        <div className="py-2 flex flex-col gap-2">
          {(item.children ?? []).map((child) => (
            <Link
              key={child.link}
              href={child.link}
              className="block px-4 py-2.5 text-sm text-default-200 hover:text-primary hover:bg-white/5 transition-colors"
              onClick={onClose}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </li>
  )
}
