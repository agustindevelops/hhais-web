import Image from "next/image"
import logo from '@/assets/images/logo.png'
import Link from "next/link"
import IconifyIcon from "@/components/wrappers/IconifyIcon"
import Footer from "@/components/Footer"

const Footer4 = () => {
  const socialLinks = [
    {
      icon: 'lucide:youtube',
      href: 'https://www.youtube.com/@HelpingHandAISolutions/videos',
    },
    {
      icon: 'lucide:instagram',
      href: 'https://www.instagram.com/helpinghand.ai?igsh=MWtkeHY4MmFtZWhxcA==',
    },
    {
      icon: 'lucide:linkedin',
      href: 'https://www.linkedin.com/in/agustin-manriquez-cruz-9b9008227/',
    },
  ];

  return (
    <footer className="bg-default-950/40 backdrop-blur-3xl" data-aos="fade-down" data-aos-easing="ease" data-aos-duration={1000}>
      <div className="container lg:px-20 py-20">
        <div className="mb-6">
          <Image src={logo} width={179} height={56} className="h-14 mx-auto" alt="logo" />
        </div>
        {/* <div className="flex flex-wrap items-center justify-center gap-5">
          <a href="#" className="text-lg font-medium text-default-400 hover:text-white transition-all duration-500">Management</a>
          <a href="#" className="text-lg font-medium text-default-400 hover:text-white transition-all duration-500">Reporting</a>
          <a href="#" className="text-lg font-medium text-default-400 hover:text-white transition-all duration-500">Tracking</a>
          <a href="#" className="text-lg font-medium text-default-400 hover:text-white transition-all duration-500">Subscibe</a>
          <a href="#" className="text-lg font-medium text-default-400 hover:text-white transition-all duration-500">Company</a>
        </div> */}
        <div className="mt-6">
          <h6 className="text-lg font-semibold text-white text-center mb-4">Follow US :</h6>
          <ul className="flex flex-wrap items-center justify-center gap-1">
            {socialLinks.map((icon, idx) => (
              <li key={idx}>
                <Link href={icon.href} className="h-10 w-10 inline-flex items-center justify-center border border-white/10 rounded-lg transition-all duration-500 group hover:bg-primary"><IconifyIcon icon={icon.icon} className="h-5 w-5 text-default-300 group-hover:text-white" /></Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </footer>

  )
}

export default Footer4
