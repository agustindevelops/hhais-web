import FloatingIcons from '@/components/wrappers/FloatingIcons'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const floatingIcons = [
  { icon: 'lucide:wallet', label: 'Lean Spending' },
  { icon: 'lucide:target', label: 'Clear Roadmap' },
  { icon: 'lucide:settings', label: 'Technical Execution' },
  { icon: 'lucide:trending-up', label: 'Growth' },
  { icon: 'lucide:shield-check', label: 'Reliability' },
  { icon: 'lucide:users', label: 'Collaboration' },
  { icon: 'lucide:lightbulb', label: 'Innovation' },
  { icon: 'lucide:rocket', label: 'Scalability' },
  { icon: 'lucide:clock', label: 'Speed to Market' },
  { icon: 'lucide:check-circle', label: 'Compliance Ready' },
  { icon: 'lucide:layers', label: 'Structured Process' },
  { icon: 'lucide:handshake', label: 'Aligned Incentives' },
  { icon: 'lucide:bar-chart-2', label: 'Data-Driven Decisions' },
  { icon: 'lucide:compass', label: 'Guidance' },
  { icon: 'lucide:cpu', label: 'AI Expertise' },
  { icon: 'lucide:globe', label: 'Cross-Industry Experience' },
]

const Benefits = () => {
  return (
    <section id="features" className="relative overflow-hidden  text-white">
      <FloatingIcons floatingIcons={floatingIcons}>
        <div className="container relative z-10 mx-auto max-w-3xl px-4 py-96 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Startups need a true technical partner — not just a contractor.
          </h2>
          <p className="mb-10 text-lg text-default-200 md:text-xl">
            Contractors get in, deliver what’s in scope, and get out. Partners
            stay invested, making decisions that help your startup scale and
            secure funding.
          </p>

          {/* Stronger benefit bullets */}
          <div className="mx-auto mb-10 max-w-2xl space-y-6 text-left text-lg">
            <div className="flex items-start gap-3">
              <span className="mt-1 text-primary">
                <IconifyIcon icon="lucide:zap" className="h-5 w-5" />
              </span>
              <span>
                <strong>Unmatched Speed with AI</strong> — we leverage AI tools
                and frameworks to move from idea to MVP faster than traditional
                dev shops, so you can validate and raise money sooner.
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-primary">
                <IconifyIcon icon="lucide:rocket" className="h-5 w-5" />
              </span>
              <span>
                <strong>Built to Scale by Industry Experts</strong> — our
                solutions are architected from day one with growth, compliance,
                and long-term viability in mind, reducing costly rewrites.
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 text-primary">
                <IconifyIcon icon="lucide:handshake" className="h-5 w-5" />
              </span>
              <span>
                <strong>Startup-Friendly Partnerships</strong> — we offer
                affordable models, including equity-based agreements, aligning
                our success with yours and growing together.
              </span>
            </div>
          </div>

          {/* Reinforce urgency, longevity, growth */}
          <p className="text-base text-default-300 md:text-lg">
            At Helping Hand AI Solutions, everything we build is driven by{' '}
            <strong>urgency, longevity, and growth</strong> — not quick fixes,
            but solutions that help your startup move fast today and thrive
            tomorrow.
          </p>
        </div>
      </FloatingIcons>
    </section>
  )
}

export default Benefits
