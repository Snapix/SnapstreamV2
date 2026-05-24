import { useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface MovieRowProps {
  title: ReactNode
  children: ReactNode
  className?: string
}

export default function MovieRow({ title, children, className }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollL, setCanScrollL] = useState(false)
  const [canScrollR, setCanScrollR] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollL(el.scrollLeft > 8)
    setCanScrollR(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  const scroll = (dir: 'l' | 'r') => {
    const el = scrollRef.current
    if (!el) return
    const step = el.clientWidth * 0.6
    el.scrollBy({ left: dir === 'l' ? -step : step, behavior: 'smooth' })
  }

  return (
    <section className={`relative group/row ${className ?? ''}`}>
      <div className="flex items-center gap-3 mb-4 px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight font-display text-white/90">
            {title}
          </h2>
        )}
      </div>

      <div className="relative">
        <AnimatePresence>
          {canScrollL && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('l')}
              className="absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-16 flex items-center justify-start bg-gradient-to-r from-black/60 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-white/70 hover:text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 md:gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 scrollbar-hide scroll-smooth pb-1"
        >
          {children}
        </div>

        <AnimatePresence>
          {canScrollR && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll('r')}
              className="absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-16 flex items-center justify-end bg-gradient-to-l from-black/60 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-white/70 hover:text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
