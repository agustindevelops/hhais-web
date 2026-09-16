"use client"
import starImg from '@/assets/images/ai/star.svg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import logoSm from '@/assets/images/logo-sm.png'
import { accountPages, demoPages } from '../data'
import TextTyping from './TextTyping'

const Hero = () => {
  return (
    <section id="home" className="relative pt-[72px] overflow-hidden" data-aos="zoom-out" data-aos-easing="ease" data-aos-duration={1000}>
      <div className="relative bg-gradient-to-l from-red-800/40 to-violet-800/40 backdrop-blur-3xl rounded-2xl overflow-hidden mx-10">
        <div>
          <div className="absolute h-14 w-14 bg-primary/20 top-1/4 end-[10%] -z-1 rounded-full animate-ping" />
          <div className="absolute top-10 start-[20%] -z-1 rounded-full animate-ping"><IconifyIcon icon="lucide:hexagon" className="h-14 w-14 text-transparent fill-orange-500/20" /></div>
          <div className="absolute top-10 end-[20%] -z-1 rounded-full animate-[spin_10s_linear_infinite]"><Image src={starImg} alt='star' className="h-8 w-8" /></div>
          <div className="absolute top-1/4 start-[10%] -z-1 rounded-full animate-[spin_10s_linear_infinite]"><Image src={starImg} alt='star' className="h-8 w-8" /></div>
        </div>
        <div className="container relative">
          <div className="flex items-center justify-center pt-20">
            <div className="max-w-4xl mx-auto text-center">
              <div>
                <Image src={logoSm} height={80} width={80} alt='logo' className="h-20 mx-auto" />
              </div>
              <h1 className="font-semibold text-white text-4xl/snug mb-6 tracking-wide capitalize">
                WebAI- AI Startup &amp; Technology Landing Page HTML Template built for&nbsp;
                <TextTyping />
              </h1>
              <p className="text-lg text-default-200 font-medium mb-8">
                Start working with Tailwindcss It allows you to compose complex designs by combining and customizing utility classes..
              </p>
              <a className="w-auto inline-flex items-center font-semibold gap-2 px-6 py-2.5 rounded-full transition-all duration-300 text-white bg-primary hover:shadow-primary-200 hover:shadow-xl" href="#demo">
                View Demos <IconifyIcon icon="lucide:eye" className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="grid-cols-1">
          <div className="mt-14 mb-6">
            <div className="relative gap-8 m-auto flex overflow-hidden">
              <div className="marquee__group gap-8 flex items-center justify-around flex-shrink-0 min-w-full">
                {demoPages.map((image, idx) => (
                  <div key={idx} className="aspect-1 object-cover rounded-lg h-60 w-full">
                    <Image className='h-full w-full rounded-lg' src={image} alt='demo' />
                  </div>
                ))}
              </div>
              <div aria-hidden="true" className="marquee__group gap-8 flex items-center justify-around flex-shrink-0 min-w-full">
                {accountPages.map((image, idx) => (
                  <Image key={idx} className="aspect-1 object-cover rounded-lg h-60 w-full" src={image} alt='account' />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}

export default Hero