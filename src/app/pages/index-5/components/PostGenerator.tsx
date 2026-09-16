import IconifyIcon from "@/components/wrappers/IconifyIcon"

const PostGenerator = () => {
  return (
    <section className="py-20" data-aos="zoom-out" data-aos-easing="ease" data-aos-duration={1000}>
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-medium capitalize text-white mb-4">Choose Social Media Post Generator</h2>
            <p className="text-sm text-default-200 font-medium">Start working with Tailwindcss It allows you to compose complex designs <br /> by combining and customizing utility classes..</p>
          </div>
        </div>
        <div className="flex items-center flex-wrap rounded-3xl bg-default-950/40 backdrop-blur-3xl">
          <div className="md:w-1/2 w-auto grow md:border-e border-b border-white/10">
            <div className="sm:p-10 p-8">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 text-primary rounded-xl mb-10">
                <IconifyIcon icon="lucide:framer" className="h-10 w-10" />
              </div>
              <h2 className="text-2xl text-white font-medium mb-4">Customize Your post</h2>
              <p className="text-base text-default-200 mb-6">Customizing your post refers to the process of tailoring your content to suit your specific goals, audience, and platform.</p>
              <a href="#" className="inline-flex items-center justify-center gap-2 border border-white/10 text-white py-2 px-6 rounded-full hover:bg-primary-hover transition-all duration-300">More Tools <IconifyIcon icon="lucide:move-right" className="h-5 w-5" /></a>
            </div>
          </div>
          <div className="md:w-1/2 w-auto grow border-b border-white/10">
            <div className="sm:p-10 p-8">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 text-primary rounded-xl mb-10">
                <IconifyIcon icon="lucide:codesandbox" className="h-10 w-10" />
              </div>
              <h2 className="text-2xl text-white font-medium mb-4">Instant Content Creation</h2>
              <p className="text-base text-default-200 mb-6">Instant content creation refers to the process of generating high-quality written, visual, or multimedia content quickly and efficiently.</p>
              <a href="#" className="inline-flex items-center justify-center gap-2 border border-white/10 text-white py-2 px-6 rounded-full hover:bg-primary-hover transition-all duration-300">More Tools <IconifyIcon icon="lucide:move-right" className="h-5 w-5" /></a>
            </div>
          </div>
          <div className="md:w-1/2 w-auto grow border-b md:border-b-0 md:border-e border-white/10">
            <div className="sm:p-10 p-8">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 text-primary rounded-xl mb-10">
                <IconifyIcon icon="lucide:life-buoy" className="h-10 w-10" />
              </div>
              <h2 className="text-2xl text-white font-medium mb-4">AI-Powered Content Suggestions</h2>
              <p className="text-base text-default-200 mb-6">AI-powered content suggestions leverage artificial intelligence and machine learning algorithms to help content creators generate ideas.</p>
              <a href="#" className="inline-flex items-center justify-center gap-2 border border-white/10 text-white py-2 px-6 rounded-full hover:bg-primary-hover transition-all duration-300">More Tools <IconifyIcon icon="lucide:move-right" className="h-5 w-5" /></a>
            </div>
          </div>
          <div className="md:w-1/2 w-auto grow border-white/10">
            <div className="sm:p-10 p-8">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 text-primary rounded-xl mb-10">
                <IconifyIcon icon="lucide:package" className="h-10 w-10" />
              </div>
              <h2 className="text-2xl text-white font-medium mb-4">Dedicated Customer Support</h2>
              <p className="text-base text-default-200 mb-6">Dedicated customer support is a service provided by organizations to assist and address the needs, concerns, and inquiries of their customers.</p>
              <a href="#" className="inline-flex items-center justify-center gap-2 border border-white/10 text-white py-2 px-6 rounded-full hover:bg-primary-hover transition-all duration-300">More Tools <IconifyIcon icon="lucide:move-right" className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}

export default PostGenerator