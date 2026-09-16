import Link from "next/link"
import { authPages } from "../data"
import Image from "next/image"
import IconifyIcon from "@/components/wrappers/IconifyIcon"

const AccountPages = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className=" mx-auto text-center mb-14">
          <span className="inline-flex text-base border-x-2 border-x-primary text-primary font-semibold px-2 rounded-full bg-primary/20 mb-2">Account Pages</span>
          <h2 className="text-3xl font-semibold text-default-100 mb-2.5">Auth Pages</h2>
          <p className="text-base font-medium text-default-300">Start working with Tailwindcss <br /> It allows you to compose complex designs.</p>
        </div>
        <div className="flex flex-wrap justify-content-center aos-init aos-animate" data-aos="fade-up" data-aos-duration={1000}>
          {authPages.map((page, idx) => {
            return (
              <Link href={page.url} target="_blank" className="w-full lg:w-1/2 p-3" key={idx}>
                <div className="relative group bg-default-950/40 shadow-xl rounded-lg text-center transition-all duration-500 hover:-translate-y-2">
                  <div className="p-4">
                    <div className="relative rounded-lg overflow-hidden ">
                      <Image alt="demo-img" className="w-full rounded-lg" src={page.image} />
                      <div className="absolute flex items-center justify-center h-full w-full bg-white/10 inset-0 opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer">
                        <div className="py-1.5 ps-5 pe-2 inline-flex items-center justify-center font-semibold align-middle duration-500 text-base text-center bg-primary hover:bg-primary-600 text-white rounded-full">
                          Live Preview <span className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white border border-white text-primary ms-3"><IconifyIcon icon='mdi:share-all-outline' className="text-lg" /></span>
                        </div>
                      </div>
                    </div>
                    <h5 className="mt-5 text-xl font-semibold text-white text-center capitalize">{page.name}</h5>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>

  )
}

export default AccountPages