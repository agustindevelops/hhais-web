import { currency } from "@/common/constants"
import type { PricingType } from "../types"
import IconifyIcon from "@/components/wrappers/IconifyIcon"
import { cn } from "@/helpers/cn"
import { pricingPlans } from "../data"

const PricingCard = ({ plan }: { plan: PricingType }) => {
  const { description, features, name, price } = plan
  return (
    <div className="border rounded-lg border-white/10 bg-default-950/40 backdrop-blur-3xl">
      <div className="p-6">
        <h1 className="text-xl font-medium text-default-100 capitalize lg:text-2xl">{name}</h1>
        <p className="mt-4 text-default-300">
          {description}
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-default-200 sm:text-3xl">{currency}{price} <span className="text-base font-medium">/Month</span></h2>
        <p className="mt-1 text-default-300">
          Monthly payment
        </p>
        <button className="w-full px-4 py-2 mt-6 tracking-wide text-primary capitalize transition-colors duration-300 transform bg-primary/20 rounded-md hover:bg-primary hover:text-white focus:text-white focus:outline-none focus:bg-primary">
          Start Now
        </button>
      </div>
      <hr className="border-white/10" />
      <div className="p-6">
        <h1 className="text-lg font-medium text-white capitalize lg:text-xl">What’s included:</h1>
        <div className="mt-8 space-y-4">
          {features.map((feature, idx) => (
            <div className="flex items-center gap-4" key={idx}>
              <IconifyIcon icon={feature.icon} className={cn("w-5 h-5", feature.variant)} />
              <span className="text-default-300">{feature.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
const Pricing = () => {
  return (
    <section id="price" className="py-20">
      <div className="container">
        <div className="lg:flex gap-10">
          <div className="flex flex-col items-center xl:items-start mb-10 lg:ms-0" data-aos="fade-right" data-aos-easing="ease" data-aos-duration={1000}>
            <h1 className="text-2xl font-medium capitalize lg:text-3xl text-white">Our Pricing Plan</h1>
            <div className="mt-2">
              <span className="inline-block w-40 h-1 bg-primary rounded-full" />
              <span className="inline-block w-3 h-1 mx-1 bg-primary rounded-full" />
              <span className="inline-block w-1 h-1 bg-primary rounded-full" />
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-base text-white">Monthly</span>
              <label htmlFor="pricing-input" className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="pricing-input" className="sr-only peer" />
                <span className="w-11 h-4 bg-default-700 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-default-950 after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[2px] after:border-default-950 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:ring-2 after:ring-offset-2 after:ring-offset-default-950 after:ring-primary after:bg-primary" />
              </label>
              <span className="text-base text-white">Yearly</span>
            </div>
            <p className="mt-4 font-medium text-default-200 mb-6">
              You can get All Access by selecting your plan!
            </p>
            <a href="#" className="inline-flex gap-2 items-center relative text-primary group">
              <span className="absolute h-px w-7/12 group-hover:w-full transition-all duration-500 rounded bg-primary/80 -bottom-0" />
              Select &amp; try <IconifyIcon icon="lucide:move-right" className="h-4 w-4" />
            </a>
          </div>
          <div className="flex-1" data-aos="fade-left" data-aos-easing="ease" data-aos-duration={1000}>
            <div className="flex items-center justify-center flex-col md:flex-row gap-x-4 gap-y-8">
              {pricingPlans.map((plan, idx) => (
                <PricingCard plan={plan} key={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}

export default Pricing