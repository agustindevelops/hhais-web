import IconifyIcon from "../wrappers/IconifyIcon"

type MobileMenuToggleProps = {
  isOpen: boolean
  onToggle: () => void
}

export default function MobileMenuToggle({ isOpen, onToggle }: MobileMenuToggleProps) {
  return (
    <div className="lg:hidden flex items-center ms-auto px-2.5">
      <button
        className="inline-flex items-center justify-center h-9 w-12 rounded-md border border-white/20 bg-default-100/5"
        type="button"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <IconifyIcon icon="lucide:menu" className="h-5 w-5 stroke-white" />
      </button>
    </div>
  )
}
