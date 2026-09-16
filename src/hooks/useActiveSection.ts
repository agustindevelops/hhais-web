import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const SECTION_IDS = ['home', 'features', 'our-process', 'projects', 'business-models', 'faq']
const OFFSET = 80

/**
 * Returns the ID of the section currently in view (for scroll-based nav highlighting).
 * Uses IntersectionObserver for React-native section tracking instead of Gumshoe.
 */
export function useActiveSection() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    if (pathname !== '/') return

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            const aRect = a.boundingClientRect
            const bRect = b.boundingClientRect
            return Math.abs(aRect.top) - Math.abs(bRect.top)
          })
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: `-${OFFSET}px 0px -60% 0px`,
        threshold: 0,
      }
    )

    elements.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return activeSection
}
