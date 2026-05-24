import { useEffect, useRef } from 'react'

interface DarkVeilProps {
  color1?: string
  color2?: string
  speed?: number
  opacity?: number
  className?: string
}

export default function DarkVeil({
  color1 = '#00f3ff',
  color2 = '#a78bfa',
  speed = 0.3,
  opacity = 0.15,
  className = '',
}: DarkVeilProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let animId: number
    let mouseX = 0
    let mouseY = 0
    let time = 0

    const resize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * devicePixelRatio
      canvas.height = canvas.offsetHeight * devicePixelRatio
    }

    const handleMouse = (e: MouseEvent) => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      mouseX = (e.clientX - rect.left) / rect.width
      mouseY = (e.clientY - rect.top) / rect.height
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouse)

    const ctx = canvas.getContext('2d')!
    const parseColor = (c: string) => {
      const d = document.createElement('div')
      d.style.color = c
      document.body.appendChild(d)
      const rgb = getComputedStyle(d).color.match(/\d+/g)?.map(Number) || [0, 243, 255]
      document.body.removeChild(d)
      return rgb
    }

    const c1 = parseColor(color1)
    const c2 = parseColor(color2)

    const draw = () => {
      if (!canvas) return
      time += 0.01 * speed
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const gradient = ctx.createRadialGradient(
        w * (mouseX || 0.5), h * (mouseY || 0.5), 0,
        w * (mouseX || 0.5), h * (mouseY || 0.5), w * 0.7
      )

      const r1 = c1[0] + Math.sin(time) * 20
      const g1 = c1[1] + Math.cos(time * 0.7) * 15
      const b1 = c1[2] + Math.sin(time * 1.2) * 20

      const r2 = c2[0] + Math.cos(time * 0.8) * 15
      const g2 = c2[1] + Math.sin(time * 0.6) * 15
      const b2 = c2[2] + Math.cos(time * 0.9) * 20

      gradient.addColorStop(0, `rgba(${r1},${g1},${b1},${opacity})`)
      gradient.addColorStop(0.5, `rgba(${(r1+r2)/2},${(g1+g2)/2},${(b1+b2)/2},${opacity * 0.5})`)
      gradient.addColorStop(1, `rgba(${r2},${g2},${b2},0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [color1, color2, speed, opacity])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
