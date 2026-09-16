import type { NavbarLinkProps } from "@/types/data"

type NavLinkProps = {
  item: NavbarLinkProps
  idx: number
  isActive: boolean
  onNavigate: () => void
}

export default function NavLink({ item, idx, isActive, onNavigate }: NavLinkProps) {
  return (
    <li key={item.link + idx} className={`nav-item ${isActive ? "active" : ""}`}>
      <a
        href={item.link}
        className="nav-link"
        onClick={onNavigate}
      >
        {item.label}
      </a>
    </li>
  )
}
