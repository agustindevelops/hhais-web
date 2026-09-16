import Image from 'next/image'
import starSvg from '@/assets/images/ai/star.svg'
import aiImg3 from '@/assets/images/ai/img-3.jpg'
import Link from 'next/link'

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden pb-14 md:pt-[72px]"
        data-aos="zoom-out"
        data-aos-easing="ease"
        data-aos-duration={1000}>
        <div className="md:px-10">
          <div
            className="overflow-hidden rounded-2xl bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${aiImg3.src})` }}>
            <div className="rounded-2xl bg-default-950/70">
              <div className="container">
                <div className="relative p-6">
                  <div className="-z-1 absolute start-80 top-20 animate-[spin_10s_linear_infinite]">
                    <Image src={starSvg} alt="" />
                  </div>
                  <div className="tot-auto -z-1 absolute bottom-40 end-60 animate-[spin_10s_linear_infinite]">
                    <Image src={starSvg} alt="" />
                  </div>
                  <div className="tot-auto -z-1 absolute bottom-96 end-36 animate-[spin_10s_linear_infinite]">
                    <Image src={starSvg} alt="" />
                  </div>
                  <div className="flex h-full items-center justify-center py-36">
                    <div className="relative mx-auto max-w-3xl text-center">
                      <span className="rounded-md bg-white/10 px-3 py-1 text-sm font-medium uppercase tracking-wider text-white/80">
                        Helping Hand AI Solutions
                      </span>
                      <h1 className="mt-10 text-3xl font-semibold text-white md:text-5xl/snug">
                        Build Your Startup MVP <br /> Faster with AI-Driven
                        Development
                      </h1>
                      <p className="mx-auto mt-5 w-2/3 text-base font-normal text-default-200">
                        We help startups turn ideas into scalable products in
                        weeks, not months — with flexible investment models that
                        lower costs and align our success with yours.
                      </p>
                      <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                        <Link
                          href="/consultation"
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2 text-white transition-all duration-300 hover:bg-primary-hover">
                          Book a Free Consultation
                        </Link>
                        <Link
                          href="/#our-process"
                          className="inline-flex items-center justify-center gap-2 text-white/80 transition-all duration-300 hover:text-white">
                          View Our Process →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  )
}

export default Hero
