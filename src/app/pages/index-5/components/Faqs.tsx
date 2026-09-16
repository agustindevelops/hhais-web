import { cn } from "@/helpers/cn"
import { faqsData } from "../data"
import IconifyIcon from "@/components/wrappers/IconifyIcon"

const Faqs = () => {
  return (
    <section id="faq" className="py-20">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-medium capitalize text-white mb-4">Any questions</h2>
            <p className="text-sm text-default-200 font-medium">Start working with Tailwindcss It allows you to compose complex designs <br /> by combining and customizing utility classes..</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="hs-accordion-group space-y-4">
            {faqsData.map((faq, idx) => (
              <div key={idx} className={cn("hs-accordion border border-white/10 bg-default-950/40 backdrop-blur-3xl rounded-lg overflow-hidden", { 'active': idx === 0 })} id="faq-1" data-aos="fade-up" data-aos-easing="ease" data-aos-duration={1000} >
                <button className="cursor-pointer hs-accordion-toggle capitalize px-6 py-4 inline-flex items-center justify-between gap-x-3 w-full text-left text-white transition-all" aria-controls="faq-accordion-1">
                  <h5 className="text-base font-semibold flex">
                    <IconifyIcon icon="lucide:circle-help" className="h-5 w-5 stroke-white align-middle me-3" />
                    {faq.question}
                  </h5>
                  <IconifyIcon icon="lucide:chevron-up" className="h-4 w-4 transition-all duration-500 hs-accordion-active:-rotate-180" />
                </button>
                <div id="faq-accordion-1" className={cn("hs-accordion-content w-full overflow-hidden transition-[height] duration-300", { "hidden": idx != 0 })} aria-labelledby="faq-1">
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-default-300 text-sm font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

  )
}

export default Faqs
