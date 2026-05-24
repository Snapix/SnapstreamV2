import type { ReactNode } from 'react'

interface GlassSurfaceProps {
  children: ReactNode
  className?: string
  distortion?: 'none' | 'subtle' | 'wave'
  intensity?: number
}

export default function GlassSurface({
  children,
  className = '',
  distortion = 'subtle',
  intensity = 0.01,
}: GlassSurfaceProps) {
  if (distortion === 'none') {
    return (
      <div className={`glass rounded-xl ${className}`}>
        {children}
      </div>
    )
  }

  const waveId = `wave-${Math.random().toString(36).slice(2)}`

  return (
    <div className={`relative ${className}`}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <filter id={waveId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="2"
              result="noise"
              seed={Math.floor(Math.random() * 100)}
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={distortion === 'wave' ? intensity * 40 : intensity * 15}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="0.5" />
            <feBlend in="SourceGraphic" in2="noise" mode="screen" />
          </filter>
        </defs>
      </svg>
      <div
        className="glass rounded-xl relative"
        style={{ filter: `url(#${waveId})` }}
      >
        {children}
      </div>
    </div>
  )
}
