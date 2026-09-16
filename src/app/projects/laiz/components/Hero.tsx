const Hero = () => (
  <section
    className="relative overflow-hidden py-20 md:py-32"
    data-aos="fade-up"
    data-aos-easing="ease"
    data-aos-duration={800}
  >
    <div className="container">
      <div className="mx-auto max-w-3xl text-center">
        <span className="rounded-md bg-primary/20 px-3 py-1 text-sm font-medium uppercase tracking-wider text-primary">
          Coming Soon
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
          LAIZ
        </h1>
        <p className="mx-auto mt-6 text-lg text-default-200">
          Your health, tracked simply. Habits, wellness, and insights in one app. Coming soon.
        </p>
      </div>
    </div>
  </section>
)

export default Hero
