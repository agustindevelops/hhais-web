"use client"
import useScrollEvent from "@/hooks/useScrollEvent"
import IconifyIcon from "./wrappers/IconifyIcon"

const BackToTop = () => {
  const {scrollY}=useScrollEvent()
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} id="back-to-top"  className={`fixed text-xl rounded-full z-10 bottom-5 end-5 h-8 w-8 text-center bg-white backdrop-blur-3xl text-default-950 flex justify-center items-center transition-all  hover:bg-primary hover:text-white hover:rounded-lg ${scrollY > 500 ? 'opacity-100' : 'opacity-0'}`}>
      <IconifyIcon icon="lucide:chevron-up" className="h-4 w-4" />
    </button>

  )
}

export default BackToTop