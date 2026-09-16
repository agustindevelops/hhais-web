import Link from "next/link"
import { footerLinks } from "../data"
import IconifyIcon from "@/components/wrappers/IconifyIcon"
import Footer from "@/components/Footer"

const Footer5 = () => {
  const socialIcons = ['lucide:facebook', 'lucide:instagram', 'lucide:twitter', 'lucide:linkedin']

  return (
    <footer className="bg-default-950/40 backdrop-blur-3xl" data-aos="zoom-in" data-aos-easing="ease" data-aos-duration={1000}>
      <div className="container lg:px-20 py-20">
        <div className="grid lg:grid-cols-12 grid-cols-2 gap-10 lg:gap-16">
          {footerLinks.map((item, idx) => (
            <div className="lg:col-span-3 sm:col-span-1 col-span-2" key={idx}>
              <ul className="flex flex-col gap-3">
                <h5 className="xl:text-xl lg:text-lg font-medium text-default-200 mb-2">{item.title}</h5>
                {item.links.map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.url ?? ''} className="text-base text-default-300 hover:text-white transition-all"><IconifyIcon icon="lucide:gauge-circle" className="inline-block h-4 w-4 me-2" /> {link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-6 col-span-2">
            <div className="bg-primary/20 rounded-xl">
              <div className="p-10">
                <h6 className="text-xl text-white mb-4">Newsletter</h6>
                <p className="text-base font-medium text-default-200 mb-6">Sign up and receive the latest tips via email.</p>
                <form className="space-y-2 mb-6">
                  <label htmlFor="subcribe" className="text-base text-white">Email</label>
                  <div className="relative">
                    <input type="email" id="subcribe" className="py-4 ps-4 pe-40 w-full h-12 text-white rounded-lg bg-default-950/60 backdrop-blur-3xl border-white/10 focus:ring-0 focus:border-white/10" placeholder="Enter your email :" name="email" />
                    <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 absolute top-[6px] end-[6px] h-9 transition-all bg-primary hover:bg-primary-hover border-primary hover:border-primary-hover text-white rounded-md">
                      Subscribe<IconifyIcon icon="lucide:move-right" className="h-4 w-4" />
                    </button>
                  </div>
                </form>
                <div>
                  <h6 className="text-base text-white mb-4">Follow US :</h6>
                  <ul className="flex flex-wrap items-center gap-1">
                    {socialIcons.map((icon, idx) => (
                      <li key={idx}>
                        <Link href="" className="h-10 w-10 inline-flex items-center justify-center border border-white/10 rounded-lg transition-all duration-500 group hover:bg-primary"><IconifyIcon icon={icon} className="h-5 w-5 text-default-300 group-hover:text-white" /></Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </footer>

  )
}

export default Footer5