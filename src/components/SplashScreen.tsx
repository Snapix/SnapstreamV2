import { motion } from 'motion/react'

interface SplashScreenProps {
  onFinish: () => void
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationEnd={onFinish}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative"
      >
        <svg className="w-24 h-24 mb-6" viewBox="0 0 100 100" fill="none">
          <motion.circle
            cx="50" cy="50" r="45"
            stroke="#00f3ff" strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          <motion.path
            d="M35 35l30 15-30 15z"
            fill="#00f3ff"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl sm:text-5xl font-display font-bold text-gradient tracking-tight"
      >
        snapstream
        <span className="text-white/40 font-light ml-2">v2</span>
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1.2, ease: 'easeInOut' }}
        onAnimationComplete={() => {
          setTimeout(onFinish, 500)
        }}
        className="h-[2px] w-32 sm:w-48 mt-6 rounded-full origin-left"
        style={{
          background: 'linear-gradient(90deg, transparent, #00f3ff, #a78bfa, transparent)',
        }}
      />
    </motion.div>
  )
}
