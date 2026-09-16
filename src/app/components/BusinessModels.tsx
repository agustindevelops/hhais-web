import IconifyIcon from "@/components/wrappers/IconifyIcon"
import type { BusinessModelType } from "../types"
import { businessModels } from "../data"

const BusinessModelCard = ({ description, icon, title }: BusinessModelType) => {
  return (
    <div className="border p-6 border-white/10 rounded-xl bg-default-950/40 text-center" data-aos="fade-up" data-aos-easing="ease" data-aos-duration={1000}>
      <span className="inline-flex relative z-0 bg-primary/10 h-24 w-24 items-center justify-center" style={{ borderRadius: '28% 72% 50% 50%/26% 20% 80% 74%' }}>
        <IconifyIcon icon={icon} className="h-10 w-10 mx-auto text-primary" />
      </span>
      <h2 className="text-2xl font-medium text-white mt-5">{title}</h2>
      <ul className="text-base font-medium text-default-200 mt-2 mb-6 text-left space-y-2">
        {description.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="mt-1 text-primary">
              <IconifyIcon icon="lucide:check-circle" className="h-4 w-4" />
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
const BusinessModels = () => {
  return (
    <section id="business-models" className="py-20">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-medium capitalize text-white mb-4">Flexible Business Models for Every Founder</h2>
            <p className="text-sm text-default-200 font-medium">Start working with Tailwindcss It allows you to compose complex designs <br /> by combining and customizing utility classes..</p>
          </div>
        </div>
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {businessModels.map((tool, idx) => (
            <BusinessModelCard {...tool} key={idx} />
          ))}
        </div>
      </div>
    </section>

  )
}

export default BusinessModels
