'use client'
const GlightBox = dynamic(() => import("@/components/GlightBox"),{ssr:false})
import IconifyIcon from "@/components/wrappers/IconifyIcon"
import dynamic from "next/dynamic"

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden pt-40 pb-20" data-aos="zoom-out" data-aos-easing="ease" data-aos-duration={1000}>
      <div className="absolute h-14 w-14 bg-primary/10 top-1/2 start-80 -z-1 rounded-2xl rounded-tl-none rounded-br-none animate-[spin_10s_linear_infinite]" />
      <div className="absolute h-14 w-14 bg-primary/20 top-1/2 end-80 -z-1 rounded-full animate-ping" />
      <div className="container">
        <div className="text-center">
          <div className="flex justify-center mt-6">
            <div className="max-w-2xl">
              <h1 className="text-5xl/tight text-default-100 font-medium mb-6">Unleash the potential of ai for your business</h1>
              <p className="text-base text-default-300 font-medium lg:max-w-md mx-auto">Et harum quidem rerum facilis est et
                expedita distinctio nam libero tempore est nihil.</p>
            </div>
          </div>
          <div>
            <GlightBox href="https://www.youtube.com/embed/5wOhrU2V-SI?si=vCWHEfjx8d-ZgKVp" title="YouTube video player">
              <button data-hs-overlay="#watchvideomodal" className="relative flex items-center justify-center gap-2.5 rounded-full text-base font-medium py-3.5 px-6 mt-10 mx-auto bg-primary/40 text-white transition-all duration-300 ring-4 ring-primary/25 hover:bg-primary">
                <IconifyIcon icon="lucide:play" className="h-6 w-6" />
                Watch Video
              </button>
            </GlightBox>
          </div>
        </div>
      </div>
    </section>

  )
}

export default Hero