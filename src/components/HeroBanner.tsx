import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Particles } from './ui/particles'
import { cn } from '../lib/utils'

interface HeroBannerProps {
  items: Array<{
    id: number
    media_type: string
    title?: string
    name?: string
    backdrop_path: string | null
    poster_path: string | null
    vote_average: number
    overview: string
  }>
  interval?: number
}

export default function HeroBanner({ items, interval = 6000 }: HeroBannerProps) {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  const goTo = useCallback((i: number) => {
    setDir(i > idx ? 1 : -1)
    setIdx(i)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIdx(prev => {
        const n = (prev + 1) % items.length
        setDir(1)
        return n
      })
    }, interval)
  }, [idx, items.length, interval])

  useEffect(() => {
    if (!items.length) return
    timerRef.current = setInterval(() => {
      setIdx(prev => {
        const n = (prev + 1) % items.length
        setDir(1)
        return n
      })
    }, interval)
    return () => clearInterval(timerRef.current)
  }, [items.length, interval])

  if (!items.length) return null

  const item = items[idx]
  const title = item.title ?? item.name ?? ''
  const backdrop = item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : null
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null

  return (
    <section className="relative w-full h-[80vh] min-h-[400px] max-h-[800px] overflow-hidden">
      <Particles
        quantity={80}
        className="absolute inset-0 z-10"
        color="#00f3ff"
        size={1.2}
        staticity={30}
      />

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={idx}
          custom={dir}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: backdrop ? `url(${backdrop})` : undefined }}
          />
          {backdrop && (
            <img src={backdrop} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 via-[30%] to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 flex items-end pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              initial={{ opacity: 0, y: 40, x: dir > 0 ? 40 : -40 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: dir > 0 ? -20 : 20 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="max-w-2xl"
            >
              <h1
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight text-white text-shadow-lg mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {title}
              </h1>

              <div className="flex items-center gap-4 mb-5">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white px-2 py-1 rounded-md border border-white/10 bg-black/30 backdrop-blur">
                  <span className="text-yellow-500">★</span> {item.vote_average?.toFixed(1)}
                </span>
                <span className="text-xs tracking-[0.15em] text-zinc-400 font-semibold uppercase">
                  {item.media_type === 'tv' ? 'Series' : 'Movie'}
                </span>
              </div>

              {item.overview && (
                <p className="text-sm md:text-base text-zinc-300 leading-relaxed line-clamp-3 mb-6 max-w-xl">
                  {item.overview}
                </p>
              )}

              <div className="flex items-center gap-3">
                <Link
                  to={`/watch/${item.media_type}/${item.id}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-black bg-white hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] group"
                >
                  <Play className="w-4 h-4 fill-black group-hover:scale-110 transition-transform" />
                  Watch Now
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-4 inset-x-0 z-30 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === idx ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50',
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
