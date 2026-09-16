const features = [
  {
    title: "Track Habits",
    description: "Log daily habits, workouts, sleep, and nutrition in one place.",
  },
  {
    title: "See Progress",
    description: "Visual insights and trends help you stay motivated.",
  },
  {
    title: "Stay Consistent",
    description: "Simple reminders and routines that fit your life.",
  },
]

const Features = () => (
  <section
    className="py-16 md:py-24"
    data-aos="fade-up"
    data-aos-easing="ease"
    data-aos-duration={800}
  >
    <div className="container">
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-white/[0.07]"
          >
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-2 text-sm text-default-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Features
