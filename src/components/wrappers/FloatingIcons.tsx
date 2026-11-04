'use client'

import IconifyIcon from './IconifyIcon'
import React from 'react'
import { useAnimationFrame } from 'framer-motion'

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
            const x = Math.round(Math.cos(iconAngle) * radius * 100) / 100
            const y = Math.round(Math.sin(iconAngle) * radius * 100) / 100
            const xOffset = x < 0 ? `- ${Math.abs(x)}px` : `+ ${x}px`
            const yOffset = y < 0 ? `- ${Math.abs(y)}px` : `+ ${y}px`
            return (
              <div
                key={`${item.icon}-${idx}`}
                className="absolute z-[1] flex flex-col items-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                style={{
                  left: `calc(50% ${xOffset})`,
                  top: `calc(50% ${yOffset})`,
                  transform: 'translate(-50%, -50%)',
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
              </div>
            )
          })}
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default FloatingIcons
