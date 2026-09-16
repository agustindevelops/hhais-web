import Image from "next/image"
import type { TestimonialType } from "../types"
import { splitArray } from "@/utils/array"
import { userTestimonialData } from "../data"

const TestimonialCard = ({ avatar, description, name }: TestimonialType) => {
  return (
    <div>
      <div className="m-2 relative w-full lg:w-full">
        <div className="group">
          <div className="border border-black rounded-xl w-full translate-x-1 transition-all duration-500">
            <div className="bg-default-950 rounded-xl h-full p-6 relative z-10">
              <div className="flex items-center gap-3">
                <div>
                  <Image src={avatar} className="h-12 w-12 rounded-full" alt="avatar" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-default-200">{name}</h3>
                  <p className="text-sm font-normal text-default-400 mt-1">user</p>
                </div>
              </div>
              <p className="text-base font-medium text-default-300 mt-4 max-w-xs">
                {description}
              </p>
            </div>
          </div>
          <div className="absolute bg-primary rounded-xl h-full left-0 top-0 w-full -z-10" />
        </div>
      </div>
    </div>
  )
}

const Testimonials = () => {
  const testimonialChunks = splitArray(userTestimonialData, 3)
  return (
    <section id="testimonials" className="py-20" data-aos="fade-down" data-aos-easing="ease" data-aos-duration={1000}>
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-medium capitalize text-white mb-4">What Our Users Say</h2>
            <p className="text-sm text-default-200 font-medium">Start working with Tailwindcss It allows you to compose complex designs <br /> by combining and customizing utility classes..</p>
          </div>
        </div>
        <div>
          <div className="relative gap-8 m-auto flex overflow-hidden">
            {testimonialChunks.map((chunk, idx) => (
              <div className="marquee__group gap-8 flex justify-around flex-shrink-0 min-w-full" key={idx}>
                {chunk.map((testimonial, idx) => (
                  <TestimonialCard key={idx} {...testimonial} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

  )
}

export default Testimonials