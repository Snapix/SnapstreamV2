import { useEffect, useRef } from 'react'

interface FluidGlassProps {
  mode?: 'lens' | 'bar' | 'cube'
  color?: string
  className?: string
}

export default function FluidGlass({
  mode = 'lens',
  color = '#00f3ff',
  className = '',
}: FluidGlassProps) {
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((1 - (e.clientY - rect.top) / rect.height)) * 100
      el.style.setProperty('--fx', `${x}%`)
      el.style.setProperty('--fy', `${y}%`)
    }

    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  const lensBg = `radial-gradient(circle at var(--fx, 50%) var(--fy, 50%), ${color}33, transparent 60%)`

  return (
    <div
      ref={elRef}
      className={`pointer-events-none ${className}`}
      style={{
        background: mode === 'lens' ? lensBg : 'transparent',
      }}
    />
  )
}
