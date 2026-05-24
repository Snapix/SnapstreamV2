import { X, Shield, Globe, Sparkles, Eye, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface AboutModalProps { isOpen: boolean; onClose: () => void }

const FEATURES = [
  { icon: Globe, label: '6+ embed sources', desc: 'Multiple streaming providers for reliability' },
  { icon: Sparkles, label: 'TMDB metadata', desc: 'Detailed info, ratings, cast, and trailers' },
  { icon: Shield, label: 'No ads', desc: 'AdGuard DNS recommended — guide included' },
  { icon: Eye, label: 'TV series support', desc: 'Episode & season picker with progress' },
  { icon: Lock, label: 'Privacy focused', desc: 'No tracking, no signup, no data collection' },
]

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <h2 className="font-display text-2xl font-black text-white">
                  <span className="text-white">Snap</span>
                  <span className="text-primary">Stream</span>
                  <span className="text-zinc-500 text-lg ml-2 font-mono">V2</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-1 tracking-wide">
                  Infinite streaming for cinematic souls
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-zinc-400 hover:text-white" />
              </button>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed mb-8">
              SnapStream aggregates free streaming sources into a clean, minimal interface.
              Powered by TMDB for metadata — no account needed, no tracking, no bloat.
            </p>

            <div className="space-y-3">
              {FEATURES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-zinc-600 text-center mt-8">
              SnapStream V2 &copy; {new Date().getFullYear()} &middot; Not affiliated with TMDB or any streaming provider
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
