import Link from "next/link"
import Image from "next/image"
import logo from '@/assets/images/logo.png'

export default function NavbarLogo() {
  return (
    <Link href="/" className="logo">
      <Image src={logo} width={200} height={60} alt="Helping Hand AI Solutions Logo" />
    </Link>
  )
}
