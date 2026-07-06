import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'

const Home = lazy(() => import('./pages/Home'))
const Watch = lazy(() => import('./pages/Watch'))
const SearchPage = lazy(() => import('./pages/Search'))
const AIAssistant = lazy(() => import('./pages/AIAssistant'))
const GameDetails = lazy(() => import('./pages/GameDetails'))
const LivePlayer = lazy(() => import('./pages/LivePlayer'))

function AppFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="w-8 h-8 border-2 border-[#00f3ff] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:type/:id" element={<Watch />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/live/:url/:name" element={<LivePlayer />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="font-display text-6xl font-black text-white/20">404</h1>
                  <p className="text-zinc-500 mt-2">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen bg-black text-white antialiased overflow-x-hidden select-none">
      <main className="transition-all duration-300">
        <Suspense fallback={<AppFallback />}>
          <AnimatedRoutes />
        </Suspense>
      </main>
    </div>
  )
}