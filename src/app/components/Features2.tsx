import IconifyIcon from "@/components/wrappers/IconifyIcon"
import Image from "next/image"

import videoImg1 from '@/assets/images/ai/video-1.svg'
import videoImg2 from '@/assets/images/ai/video-2.svg'

const Features2 = () => {
  return (
    <section className="py-14">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div data-aos="fade-right" data-aos-easing="ease" data-aos-duration={1000}>
            <span className="py-1 px-3 rounded-md text-sm font-medium uppercase tracking-wider text-primary bg-primary/20">AI technolog</span>
            <h2 className="text-3xl/snug font-medium capitalize text-white mt-4">Create amazing content with AI technology. </h2>
            <p className="text-base font-medium text-default-200 mt-5">Start working with Tailwindcss It allows you to compose complex designs <br /> by combining and customizing utility classes..</p>
            <div className="flex flex-wrap items-center gap-6 mt-10">
              <button className="inline-flex items-center justify-center gap-2 bg-primary text-white py-2 px-6 rounded-full hover:bg-primary-hover transition-all duration-300">Get start free
                <IconifyIcon icon="lucide:move-right" className="h-5 w-5" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 border border-white/10 text-white py-2 px-6 rounded-full hover:bg-primary-hover transition-all duration-300">More Tools <IconifyIcon icon="lucide:move-right" className="h-5 w-5">
              
              </IconifyIcon>
              </button>
            </div>
          </div>
          <div data-aos="fade-left" data-aos-easing="ease" data-aos-duration={1000}>
            <Image src={videoImg2} className="h-full w-full" alt="video-image" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-center mt-14">
          <div className="2xl:-ms-16" data-aos="fade-right" data-aos-easing="ease" data-aos-duration={1000}>
            <Image src={videoImg1} className="h-full w-full" alt="video-image" />
          </div>
          <div data-aos="fade-left" data-aos-easing="ease" data-aos-duration={1000}>
            <span className="py-1 px-3 rounded-md text-sm font-medium uppercase tracking-wider text-primary bg-primary/20">Content generate</span>
            <h2 className="text-3xl/snug font-medium capitalize text-white mt-4">Content you can write &amp; generate with our AI</h2>
            <p className="text-base font-medium text-default-200 mt-5">Start working with Tailwindcss It allows you to compose complex designs <br /> by combining and customizing utility classes..</p>
            <div className="flex flex-wrap items-center gap-6 mt-10">
              <button className="inline-flex items-center justify-center gap-2 bg-primary text-white py-2 px-6 rounded-full hover:bg-primary-hover transition-all duration-300">Get start free
                <IconifyIcon icon="lucide:move-right" className="h-5 w-5" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 border border-white/10 text-white py-2 px-6 rounded-full hover:bg-primary-hover transition-all duration-300">More Tools <IconifyIcon icon="lucide:move-right" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}

export default Features2