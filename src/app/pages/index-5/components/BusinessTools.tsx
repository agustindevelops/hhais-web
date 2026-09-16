import IconifyIcon from "@/components/wrappers/IconifyIcon"
import { tools } from "../data"
import Link from "next/link"
import { cn } from "@/helpers/cn"

const BusinessTools = () => {
  return (
    <section id="tools" className="py-20" data-aos="zoom-in" data-aos-easing="ease" data-aos-duration={1000}>
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-medium capitalize text-white mb-4">60+ Powerfull Tools</h2>
            <p className="text-sm text-default-200 font-medium">Start working with Tailwindcss It allows you to compose complex designs <br /> by combining and customizing utility classes..</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6">
          {tools.map((tool, idx) => (
            <div className="bg-default-950/40 rounded-xl backdrop-blur-3xl" key={idx}>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("inline-flex items-center justify-center h-10 w-10 rounded-lg", tool.iconClass)}>
                    <IconifyIcon icon={tool.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium text-default-200">{tool.name}</h3>
                </div>
                <Link href="" className="inline-flex gap-2 items-center relative text-primary group">
                  <span className="absolute h-px w-7/12 group-hover:w-full transition-all duration-500 rounded bg-primary/80 -bottom-0" />
                  Select &amp; try <IconifyIcon icon="lucide:move-right" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="inline-flex items-center justify-center gap-2 bg-primary text-white py-2 px-6 rounded-full hover:bg-primary-hover transition-all duration-300">More Tools <IconifyIcon icon="lucide:move-right" className="h-5 w-5" /></button>
        </div>
      </div>
    </section>

  )
}

export default BusinessTools