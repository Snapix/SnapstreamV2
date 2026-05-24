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
  opacity = 0.12,
  className = '',
}: DarkVeilProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let animId: number
    let mouseX = 0.5
    let mouseY = 0.5
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

    const draw = () => {
      if (!canvas) return
      time += 0.015 * speed
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const cx = w * mouseX
      const cy = h * mouseY
      const r = Math.max(w, h) * 0.6

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      gradient.addColorStop(0, `rgba(0, 243, 255, ${opacity * (0.8 + Math.sin(time) * 0.2)})`)
      gradient.addColorStop(0.4, `rgba(167, 139, 250, ${opacity * 0.4})`)
      gradient.addColorStop(1, 'rgba(0,0,0,0)')

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
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
