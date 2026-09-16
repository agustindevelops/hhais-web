import IconifyIcon from "@/components/wrappers/IconifyIcon"
import type { FeatureType } from "../types"
import Link from "next/link"
import { features } from "../data"

const FeatureCard = ({ description, icon, title }: FeatureType) => {
  return (
    <div className="bg-default-950/40 rounded-xl backdrop-blur-3xl border-s-2 border-primary hover:-trandefault-y-2 transition-all duration-500">
      <div className="p-10">
        <IconifyIcon icon={icon} className="h-10 w-10 text-primary" />
        <h3 className="text-2xl font-medium text-white mb-4 mt-8">{title}</h3>
        <p className="text-sm text-default-100 font-medium mb-4">{description}</p>
        <Link href="" className="inline-flex gap-2 items-center relative text-primary group">
          <span className="absolute h-px w-7/12 group-hover:w-full transition-all duration-500 rounded bg-primary/80 -bottom-0" />
          Read More <IconifyIcon icon="lucide:move-right" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-medium capitalize text-white mb-4">AI Generate Content In Seconds</h2>
            <p className="text-sm text-default-200 font-medium">Start working with Tailwindcss It allows you to compose complex designs <br /> by combining and customizing utility classes..</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard {...feature} key={idx} />
          ))}
        </div>
      </div>
    </section>

  )
}

export default Features
