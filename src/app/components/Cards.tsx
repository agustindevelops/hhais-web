import IconifyIcon from "@/components/wrappers/IconifyIcon"
import type { FeatureType } from "../types"
import { features } from "../data"

const FeatureCard = ({ description, icon, name }: FeatureType) => {
  return (
    <div className="border border-white/10 bg-default-950/40 overflow-hidden rounded-3xl p-10" data-aos="fade-up" data-aos-easing="ease" data-aos-duration={1000}>
      <div className="group transition-all duration-700">
        <div>
          <div className="flex flex-col">
            <div className="relative">
              <div className="opacity-100">
                <div className="group-hover:w-10 pb-12 group-hover:pb-8 transition-all duration-700">
                  <IconifyIcon icon={icon} className="h-12 w-12 group-hover:h-8 group-hover:w-8 text-primary transition-all duration-700" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-medium text-white">{name}</h4>
              <p className="text-default-200 mt-3">{description}</p>
              <div className="h-3 transition-all duration-700 group-hover:pt-6 overflow-hidden group-hover:overflow-visible -mb-3">
                <div className="opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <p className="text-base text-default-200 pb-5 flex items-center">Read more <IconifyIcon icon="lucide:chevron-right" className="h-5 w-5 text-primary" /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <h2 className="text-3xl font-medium capitalize text-white mb-4">What can it write for you?</h2>
            <p className="text-sm text-default-200 font-medium">Start working with Tailwindcss It allows you to compose complex designs <br /> by combining and customizing utility classes..</p>
          </div>
        </div>
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard {...feature} key={idx} />
          ))}
        </div>
      </div>
    </section>

  )
}

export default Features