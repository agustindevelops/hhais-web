'use client'

import IconifyIcon from './IconifyIcon'
import React from 'react'
import { motion, useAnimationFrame } from 'framer-motion'

type FloatingIconsProps = {
  floatingIcons: { icon: string; label: string }[]
  children: React.ReactNode
}

const FloatingIcons = ({ floatingIcons, children }: FloatingIconsProps) => {
  const [baseAngle, setBaseAngle] = React.useState(0)

  useAnimationFrame((t) => {
    const target = ((t / 1000) * 0.08) % (2 * Math.PI)
    setBaseAngle((prev) => prev + (target - prev) * 0.1) // smooth catch-up
  })

  const radius = 540

  return (
    <div className="relative z-20 h-full w-full overflow-x-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 md:block">
        <div
          className="relative h-full w-full"
          style={{ width: '100%', height: '100%' }}>
          {floatingIcons.map((item, idx) => {
            const iconAngle =
              (idx / floatingIcons.length) * 2 * Math.PI + baseAngle
            const x = Math.cos(iconAngle) * radius
            const y = Math.sin(iconAngle) * radius
            return (
              <motion.div
                key={`${item.icon}-${idx}`}
                className="absolute flex flex-col items-center"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
                  zIndex: 1,
                }}>
                <div className="rounded-full border border-white/10 bg-default-900/80 p-4 shadow-lg">
                  <IconifyIcon
                    icon={item.icon}
                    className="h-8 w-8 text-primary"
                  />
                </div>
                <span className="mt-2 text-center text-xs text-default-200">
                  {item.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default FloatingIcons
