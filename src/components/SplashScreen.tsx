import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface SplashScreenProps {
  onFinish: () => void
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0f]"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <svg className="w-20 h-20 sm:w-24 sm:h-24 mb-6" viewBox="0 0 100 100" fill="none">
          <motion.circle
            cx="50" cy="50" r="45"
            stroke="#00f3ff" strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
          <motion.path
            d="M35 35l30 15-30 15z"
            fill="#00f3ff"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl sm:text-4xl font-display font-bold"
        style={{
          background: 'linear-gradient(135deg, #00f3ff, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        snapstream
        <span className="text-white/30 font-light ml-2" style={{ WebkitTextFillColor: 'rgba(255,255,255,0.3)' }}>v2</span>
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 1, ease: 'easeInOut' }}
        className="h-[2px] w-32 sm:w-40 mt-5 rounded-full origin-left"
        style={{
          background: 'linear-gradient(90deg, transparent, #00f3ff, #a78bfa, transparent)',
        }}
      />
    </motion.div>
  )
}
