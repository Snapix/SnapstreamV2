import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface SplashScreenProps { onFinish: () => void }

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 500)
    const t2 = setTimeout(() => setPhase('out'), 2000)
    const t3 = setTimeout(() => onFinish(), 2600)
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#060606] overflow-hidden"
        >
          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.5 }}
              className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shadow-[0_0_60px_rgba(0,243,255,0.2)]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-2px] rounded-full border border-dashed border-[#00f3ff]/50"
              />
              <span className="font-display font-black text-white text-5xl sm:text-6xl">S</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[0.2em] text-white uppercase text-center">
                SNAPSTREAM
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
                className="h-[2px] bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent mt-4 opacity-50"
              />
              <p className="text-sm sm:text-base text-zinc-500 font-medium tracking-[0.3em] mt-4 uppercase animate-pulse">
                Starting up...
              </p>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
