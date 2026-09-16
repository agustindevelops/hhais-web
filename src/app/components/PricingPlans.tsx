import { currency } from "@/common/constants"
import type { PricingType } from "../types"
import { pricingPlans } from "../data"

const PricingCard = ({ features, name, price }: PricingType) => {
  return (
    <div className="flex flex-col h-full text-center">
      <div className="bg-default-950/40 pt-8 pb-5 px-8">
        <h4 className="font-medium text-lg text-default-200">{name}</h4>
      </div>
      <div className="h-full bg-default-950/40 lg:mt-px lg:py-5 px-8">
        <span className="mt-7 font-bold text-5xl text-default-200">
          {price != 0 && <span className="font-bold text-2xl -me-2">{currency} </span>}
          {price === 0 ? 'Free' : price}
        </span>
      </div>
      <div className="bg-default-950/40 flex justify-center lg:mt-px pt-7 px-8">
        <ul className="space-y-2.5 text-center text-sm">
          {features.map((feature, idx) => (
            <li className="text-default-200" key={idx}>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-default-950/40 py-8 px-8">
        <a className="inline-flex items-center justify-center gap-2 border border-white/10 text-white py-2 px-6 rounded-full hover:bg-primary-hover transition-all duration-300" href="#">
          Sign up
        </a>
      </div>
    </div>
  )
}

const PricingPlans = () => {
  return (
    <section id="price" className="py-20" data-aos="fade-up" data-aos-easing="ease" data-aos-duration={1000}>
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-medium capitalize text-white mb-4">Pricing and plans for everyone</h2>
            <p className="text-sm text-default-200 font-medium">Start working with Tailwindcss It allows you to compose complex designs <br /> by combining and customizing utility classes..</p>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden">
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
            {pricingPlans.map((plan,idx) => (
              <PricingCard {...plan} key={idx}/>
            ))}
          </div>
        </div>
      </div>
    </section>

  )
}

export default PricingPlans