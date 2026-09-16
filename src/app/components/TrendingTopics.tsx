import Image from "next/image"
import type { TopicType } from "../types"
import { trendingTopics } from "../data"
import IconifyIcon from "@/components/wrappers/IconifyIcon"

const TopicCard = ({ avatars, description, title, id }: TopicType) => {
  return (
    <div className="rounded-lg border border-white/10 bg-default-950/40 p-6" data-aos="fade-up" data-aos-easing="ease" data-aos-duration={1000}>
      <div className="flex gap-5">
        <div>
          <div className="mt-2 h-8 w-8 text-xl font-semibold text-primary rounded-md bg-primary/20 flex items-center justify-center">{id}</div>
        </div>
        <div>
          <h2 className="text-xl font-medium text-white">{title}</h2>
          <p className="text-base font-medium text-default-200 mt-1">{description}</p>
          <div className="flex items-center gap-2 mt-6">
            {avatars.map((avatar, idx) => (
              <Image src={avatar} height={40} width={40} className="h-10 rounded bg-white" alt="avatar" key={idx} />
            ))}
          </div>
          <button className="inline-flex gap-2 items-center relative text-primary group mt-6">
            <span className="absolute h-px w-7/12 group-hover:w-full transition-all duration-500 rounded bg-primary/80 -bottom-0" />
            Read more <IconifyIcon icon="lucide:move-right" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
const TrendingTopics = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-medium capitalize text-white mb-4">Trending Topics</h2>
            <p className="text-sm text-default-200 font-medium">Start working with Tailwindcss It allows you to compose complex designs <br /> by combining and customizing utility classes..</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {trendingTopics.map((topic, idx) => (
            <TopicCard {...topic} key={idx} />
          ))}
        </div>
      </div>
    </section>

  )
}

export default TrendingTopics