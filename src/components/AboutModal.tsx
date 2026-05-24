import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="glass-strong rounded-2xl p-6 sm:p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-display font-bold text-gradient mb-4">SnapStream V2</h2>
            <p className="text-muted text-sm leading-relaxed mb-4">
              A modern streaming experience powered by TMDB. Browse trending movies, search your favorites,
              and enjoy a sleek, glass-morphism interface.
            </p>
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Built with React + Vite</span>
              <span>Data by TMDB</span>
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full py-2 rounded-full bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
