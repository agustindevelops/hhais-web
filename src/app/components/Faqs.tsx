"use client"
import { cn } from "@/helpers/cn"
import { faqs } from "../data"
import IconifyIcon from "@/components/wrappers/IconifyIcon"
import ButtonCTA from "@/components/ButtonCTA"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="faq" className="py-20">
      <div className="container">
        <div className="grid xl:grid-cols-2 gap-6">
          <div
            className="xl:text-start text-center"
            data-aos="fade-right"
            data-aos-easing="ease"
            data-aos-duration={1000}
          >
            <h2 className="text-3xl font-medium capitalize text-white mb-4">
              Frequently asked questions
            </h2>
            <p className="text-sm text-default-200 font-medium">
              How we partner: strategy → fast MVP → scale. Clear pricing,
              practical roadmaps, and privacy-first builds.
            </p>

            <div className="mt-10"><ButtonCTA /></div>
          </div>

          <div
            data-aos="fade-left"
            data-aos-easing="ease"
            data-aos-duration={1000}
          >
            <div className="hs-accordion-group space-y-4">
              {faqs.map((faq, idx) => {
                const itemId = `faq-${idx}`;
                const panelId = `faq-accordion-${idx}`;
                const isOpen = idx === activeIndex;

                return (
                  <div
                    key={idx}
                    className={cn(
                      "hs-accordion border border-white/10 bg-default-950/40 backdrop-blur-3xl rounded-lg overflow-hidden",
                      { active: isOpen }
                    )}
                    id={itemId}
                  >
                    <button
                      className="cursor-pointer hs-accordion-toggle capitalize px-6 py-4 inline-flex items-center justify-between gap-x-3 w-full text-left text-white transition-all"
                      aria-controls={panelId}
                      aria-expanded={isOpen}
                      onClick={() => setActiveIndex(idx)}
                    >
                      <h5 className="text-base font-semibold flex">
                        <IconifyIcon
                          icon="lucide:circle-help"
                          className="h-5 w-5 stroke-white align-middle me-3"
                        />
                        {faq.question}
                      </h5>
                      <IconifyIcon
                        icon="lucide:chevron-up"
                        className={cn(
                          "h-4 w-4 transition-all duration-500",
                          { "hs-accordion-active:-rotate-180": true }
                        )}
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          aria-labelledby={itemId}
                          className={cn(
                            "hs-accordion-content w-full overflow-hidden"
                          )}
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            open: { height: "auto", opacity: 1 },
                            collapsed: { height: 0, opacity: 0 }
                          }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          style={{ willChange: "height, opacity" }}
                        >
                          <div className="px-6 pb-4 pt-0">
                            <p className="text-default-300 text-sm font-medium mb-2">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Faqs
