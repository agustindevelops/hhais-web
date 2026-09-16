import Link from "next/link"
import IconifyIcon from "./wrappers/IconifyIcon"

const ButtonCTA = ({ href = "/consultation", label = "Free Consultation", icon = "lucide:calendar-check" }: { href?: string, label?: string, icon?: string }) => {
  return (
    <Link href={href} className="text-center inline-flex items-center justify-center gap-2 bg-primary text-white py-2 px-6 rounded-full hover:bg-primary-hover transition-all duration-300"><IconifyIcon icon={icon} className="h-5 w-5 me-2" />{label}</Link>
  )
}

export default ButtonCTA
