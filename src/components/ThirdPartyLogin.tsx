import Link from "next/link"
import IconifyIcon from "./wrappers/IconifyIcon"

const ThirdPartyLogin = () => {
  return (
    <div>
      <div className="text-center">
        <p className="text-lg text-default-200 font-semibold mb-4">Sign in with</p>
        <ul className="flex flex-wrap items-center justify-center gap-2">
          <li>
            <Link href="" className="h-10 w-10 inline-flex items-center justify-center backdrop-blur-2xl bg-white/20 rounded-lg transition-all duration-500 group hover:bg-blue-600/60"><IconifyIcon icon="mdi:facebook" className="text-2xl text-white group-hover:text-white" /></Link>
          </li>
          <li>
            <Link href="" className="h-10 w-10 inline-flex items-center justify-center backdrop-blur-2xl bg-white/20 rounded-lg transition-all duration-500 group hover:bg-pink-600/60"><IconifyIcon icon="mdi:instagram" className="text-2xl text-white group-hover:text-white" /></Link>
          </li>
          <li>
            <Link href="" className="h-10 w-10 inline-flex items-center justify-center backdrop-blur-2xl bg-white/20 rounded-lg transition-all duration-500 group hover:bg-blue-800/60"><IconifyIcon icon="mdi:linkedin" className="text-2xl text-white group-hover:text-white" /></Link>
          </li>
          <li>
            <Link href="" className="h-10 w-10 inline-flex items-center justify-center backdrop-blur-2xl bg-white/20 rounded-lg transition-all duration-500 group hover:bg-default-600/60"><IconifyIcon icon="mdi:github" className="text-2xl text-white group-hover:text-white" /></Link>
          </li>
        </ul>
      </div>
    </div>

  )
}

export default ThirdPartyLogin