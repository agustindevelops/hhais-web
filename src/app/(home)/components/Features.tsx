import IconifyIcon from "@/components/wrappers/IconifyIcon"
import { features } from "../data"

const Features = () => {
  return (
    <section id="features" className="py-20" data-aos="zoom-in" data-aos-easing="ease" data-aos-duration={1000}>
      <div className="container">
        <div className="flex items-center justify-center mb-14">
          <div className="max-w-2xl text-center">
            <span className="inline-block text-base border-x-2 border-x-primary text-primary font-semibold px-2 rounded-full bg-primary/20 mb-2">Landing Features</span>
            <h2 className="text-3xl/snug font-bold capitalize text-white mb-1">Why Choose WebAi</h2>
            <p className="text-base font-medium text-default-200">A modern design, fresh look and feel</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 bg-default-950/40 backdrop-blur-3xl p-2 rounded">
            <span className="flex items-center justify-center rounded-md w-12 h-12 bg-primary/20">
              <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 54 33">
                <g clipPath="url(#prefix__clip0)">
                  <path className="fill-primary" fillRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" clipRule="evenodd" />
                </g>
              </svg>
            </span>
            <h5 className="text-base font-medium text-default-100">Based on latest Tailwind v3.3.3</h5>
          </div>
          {features.map((feature, idx) => (
            <div className="flex items-center gap-4 bg-default-950/40 backdrop-blur-3xl p-2 rounded" key={idx}>
              <span className="flex items-center justify-center rounded-md w-12 h-12 bg-primary/20">
                <IconifyIcon icon={feature.icon} className="w-6 h-6 text-primary" />
              </span>
              <h5 className="text-base font-medium text-default-100">{feature.name}</h5>
            </div>
          ))}
        </div>
      </div>
    </section>

  )
}

export default Features