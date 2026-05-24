import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import ClickSpark from './ClickSpark'

interface NavbarProps {
  onAboutClick: () => void
}

export default function Navbar({ onAboutClick }: NavbarProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl sm:text-2xl font-display font-bold text-gradient tracking-tight">
            SnapStream
          </span>
          <span className="text-xs font-display text-primary font-semibold hidden sm:inline">V2</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies & shows..."
              className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 pl-10 text-sm text-white placeholder-muted focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>

        <div className="flex items-center gap-3">
          <ClickSpark>
            <button
              onClick={onAboutClick}
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              About
            </button>
          </ClickSpark>
        </div>
      </div>
    </motion.nav>
  )
}
