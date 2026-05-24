import { useEffect, useRef } from 'react'
import './DarkVeil.css'

interface DarkVeilProps {
  canvasWidth?: number
  canvasHeight?: number
  mouseMove?: boolean
}

export default function DarkVeil({ canvasWidth = 400, canvasHeight = 400, mouseMove = true }: DarkVeilProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0
    const w = canvas.width
    const h = canvas.height
    const imageData = ctx.createImageData(w, h)
    const data = imageData.data

    function draw() {
      time += 0.008
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4
          const nx = x / w - 0.5
          const ny = y / h - 0.5
          const dx = nx - (mx - 0.5)
          const dy = ny - (my - 0.5)
          const d = Math.sqrt(dx * dx + dy * dy)

          const v = Math.sin(nx * 6 + time) * Math.cos(ny * 6 + time * 0.7) +
                    Math.sin(nx * 12 + time * 1.3) * 0.3 +
                    Math.cos(ny * 10 + time * 0.9) * 0.3 +
                    Math.sin(d * 8 - time * 0.5) * 0.2 +
                    Math.cos((nx + ny) * 7 + time * 0.6) * 0.2

          const val = Math.max(0, Math.min(1, v * 0.5 + 0.5))
          const intensity = Math.floor(val * 30)
          data[i] = intensity
          data[i + 1] = intensity
          data[i + 2] = intensity + Math.floor(val * 8)
          data[i + 3] = Math.floor(val * 120 + 20)
        }
      }

      ctx.putImageData(imageData, 0, 0)
      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    if (mouseMove) {
      const onMove = (e: MouseEvent) => {
        mouseRef.current = {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        }
      }
      window.addEventListener('mousemove', onMove)
      return () => {
        cancelAnimationFrame(animRef.current)
        window.removeEventListener('mousemove', onMove)
      }
    }

    return () => cancelAnimationFrame(animRef.current)
  }, [canvasWidth, canvasHeight, mouseMove])

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="dark-veil-canvas fixed inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
