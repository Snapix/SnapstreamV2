import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface SplashScreenProps { onFinish: () => void }

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600)
    const t2 = setTimeout(() => setPhase('out'), 2200)
    const t3 = setTimeout(() => onFinish(), 2900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onFinish])

  return (
    <AnimatePresence>
      {phase !== 'out' ? (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.4, opacity: phase === 'hold' ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,243,255,0.08) 0%, transparent 70%)' }}
          />

          <motion.div
            initial={{ top: '-100%' }}
            animate={{ top: '200%' }}
            transition={{ duration: 1.4, ease: 'linear', delay: 0.3 }}
            className="absolute left-0 right-0 h-[2px] pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(0,243,255,0.4), transparent)',
              boxShadow: '0 0 20px rgba(0,243,255,0.3)',
            }}
          />

          <div className="relative flex flex-col items-center gap-3 select-none">
            <motion.div
              initial={{ opacity: 0, y: -20, letterSpacing: '0.5em' }}
              animate={{
                opacity: 1, y: 0,
                letterSpacing: phase === 'hold' ? '0.12em' : '0.5em',
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline gap-0"
            >
              <span className="font-display font-black text-5xl md:text-6xl text-white tracking-[0.12em] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Snap
              </span>
              <span
                className="font-display font-black text-5xl md:text-6xl tracking-[0.12em] uppercase"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: '#00f3ff',
                  textShadow: '0 0 30px rgba(0,243,255,0.6), 0 0 60px rgba(0,243,255,0.3)',
                }}
              >
                Stream
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5, ease: 'backOut' }}
              className="flex items-center gap-2"
            >
              <div className="h-px flex-1 w-16 bg-gradient-to-r from-transparent to-[#00f3ff]/30" />
              <span
                className="text-[10px] font-display font-bold tracking-[0.4em] uppercase px-3 py-1 rounded-full border"
                style={{
                  color: '#00f3ff',
                  borderColor: 'rgba(0,243,255,0.25)',
                  backgroundColor: 'rgba(0,243,255,0.08)',
                  boxShadow: '0 0 12px rgba(0,243,255,0.1)',
                }}
              >
                V2
              </span>
              <div className="h-px flex-1 w-16 bg-gradient-to-l from-transparent to-[#00f3ff]/30" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'hold' ? 0.35 : 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-[10px] tracking-[0.35em] text-zinc-500 uppercase font-display"
            >
              Infinite streaming for cinematic souls
            </motion.p>
          </div>

          {['top-8 left-8 border-t border-l', 'top-8 right-8 border-t border-r', 'bottom-8 left-8 border-b border-l', 'bottom-8 right-8 border-b border-r'].map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: phase === 'hold' ? 0.25 : 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
              className={`absolute w-6 h-6 ${cls} border-[#00f3ff]/40`}
            />
          ))}

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase === 'hold' ? 1 : 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.3 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-40 h-[2px] origin-left rounded-full"
            style={{
              background: 'linear-gradient(to right, rgba(0,243,255,0.3), #00f3ff)',
              boxShadow: '0 0 8px rgba(0,243,255,0.4)',
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
