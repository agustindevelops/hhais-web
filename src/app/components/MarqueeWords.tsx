const MarqueeWords = () => {
  return (
    <section
      className="pt-20"
      data-aos="zoom-in"
      data-aos-easing="ease"
      data-aos-duration={1000}
    >
      <div>
        <div className="relative m-auto flex gap-4 sm:gap-8 overflow-hidden">
          <div className="marquee__group flex min-w-full flex-shrink-0 items-center justify-around gap-4 sm:gap-8">
            {marqueeGroup1.map((item, idx) => (
              <div className="py-2 sm:py-3" key={idx}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white">{item}</h2>
              </div>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="marquee__group flex min-w-full flex-shrink-0 items-center justify-around gap-4 sm:gap-8"
          >
            {marqueeGroup1.map((item, idx) => (
              <div className="py-2 sm:py-3" key={idx}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white">{item}</h2>
              </div>
            ))}
          </div>
        </div>
        <div className="marquee--reverse m-auto mt-5 sm:mt-7 flex gap-4 sm:gap-8 overflow-hidden">
          <div className="marquee__group flex min-w-full flex-shrink-0 items-center justify-around gap-4 sm:gap-8 delay-[31s]">
            {marqueeGroup2.map((item, idx) => (
              <div className="py-2 sm:py-3" key={idx}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white">{item}</h2>
              </div>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="marquee__group flex min-w-full flex-shrink-0 items-center justify-around gap-4 sm:gap-8 delay-[31s]"
          >
            {marqueeGroup2.map((item, idx) => (
              <div className="py-2 sm:py-3" key={idx}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white">{item}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarqueeWords

const marqueeGroup1 = [
  'Idea to MVP Fast',
  'Validate Quickly',
  'Investor-Ready',
  'Funding Support',
  'Market Launch'
]
const marqueeGroup2 = [
  'AI-Powered Speed',
  'Scalable Tech',
  'Equity-Friendly',
  'Built to Grow',
  'Founder Focused'
]
