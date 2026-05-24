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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const mouse = { x: 0, y: 0 }
    let rafId: number

    const onMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = (e.clientX - rect.left) / rect.width
      mouse.y = (e.clientY - rect.top) / rect.height
    }

    container.addEventListener('mousemove', onMouse)

    const render = () => {
      const cx = mouse.x * 100
      const cy = (1 - mouse.y) * 100

      if (mode === 'lens') {
        container.style.setProperty('--bg-x', `${cx}%`)
        container.style.setProperty('--bg-y', `${cy}%`)
      } else if (mode === 'bar') {
        container.style.setProperty('--bar-offset', `${50 + (mouse.x - 0.5) * 30}%`)
      } else if (mode === 'cube') {
        container.style.setProperty('--rotate-x', `${(mouse.y - 0.5) * 20}deg`)
        container.style.setProperty('--rotate-y', `${(mouse.x - 0.5) * 20}deg`)
      }

      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      container.removeEventListener('mousemove', onMouse)
    }
  }, [mode])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: mode === 'lens'
          ? `radial-gradient(circle at var(--bg-x, 50%) var(--bg-y, 50%), ${color}44, transparent 60%)`
          : mode === 'bar'
          ? `linear-gradient(90deg, transparent, ${color}33 var(--bar-offset, 50%), transparent)`
          : undefined,
      }}
    >
      {mode === 'cube' && (
        <div
          className="w-full h-full transition-transform duration-100"
          style={{
            transform: 'perspective(600px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${color}22, transparent 50%, ${color}11)`,
              borderRadius: 'inherit',
            }}
          />
        </div>
      )}
    </div>
  )
}
