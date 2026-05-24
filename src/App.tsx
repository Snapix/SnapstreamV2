import { useState, lazy, Suspense } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Dock from './components/Dock'
import { Home as HomeIcon, Search, Film, Tv, Settings, Info } from 'lucide-react'
import SettingsModal from './components/AboutModal'
import CreditsModal from './components/CreditsModal'
import GlassSurface from './components/GlassSurface'
import SplashScreen from './components/SplashScreen'
import Cursor from './components/Cursor'
import { motion, AnimatePresence } from 'motion/react'

const Home = lazy(() => import('./pages/Home'))
const Watch = lazy(() => import('./pages/Watch'))
const SearchPage = lazy(() => import('./pages/Search'))

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
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:type/:id" element={<Watch />} />
          <Route path="/search" element={<SearchPage />} />
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
  const [splashDone, setSplashDone] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [cursorEnabled, setCursorEnabled] = useState(true)
  const navigate = useNavigate()

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />
  }

  const dockItems = [
    { icon: <HomeIcon className="w-5 h-5" />, label: 'Home', onClick: () => navigate('/') },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', onClick: () => setAboutOpen(true) },
  ]

  return (
    <div className={`relative min-h-screen bg-black text-white antialiased overflow-x-hidden`}>
      <GlassSurface />

      {cursorEnabled && <Cursor />}
      
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setCreditsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95"
        >
          <Info className="w-3.5 h-3.5 text-[#00f3ff]" />
          About Creator
        </button>
      </div>

      <main className="transition-all duration-300">
        <Suspense fallback={<AppFallback />}>
          <AnimatedRoutes />
        </Suspense>
      </main>

      <Dock 
        items={dockItems}
        panelHeight={60}
        baseItemSize={40}
        magnification={70}
      />

      <SettingsModal 
        isOpen={aboutOpen} 
        onClose={() => setAboutOpen(false)} 
        cursorEnabled={cursorEnabled}
        setCursorEnabled={setCursorEnabled}
      />

      <CreditsModal
        isOpen={creditsOpen}
        onClose={() => setCreditsOpen(false)}
      />
    </div>
  )
}
