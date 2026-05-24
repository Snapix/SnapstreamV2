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
}: GlassSurfaceProps) {
  return (
    <div className={`glass rounded-xl ${className}`}>
      {children}
    </div>
  )
}
