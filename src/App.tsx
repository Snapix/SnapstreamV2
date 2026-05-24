import { useState, lazy, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Dock from './components/Dock'
import { Home as HomeIcon, Search, Film, Tv, Settings, Info } from 'lucide-react'
import SettingsModal from './components/AboutModal'
import CreditsModal from './components/CreditsModal'
import GlassSurface from './components/GlassSurface'
import SplashScreen from './components/SplashScreen'
import Cursor from './components/Cursor'

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

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const [cursorEnabled, setCursorEnabled] = useState(true)
  const [backgroundEnabled, setBackgroundEnabled] = useState(true)
  const navigate = useNavigate()

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />
  }

  const dockItems = [
    { icon: <HomeIcon className="w-5 h-5" />, label: 'Home', onClick: () => navigate('/') },
    { icon: <Search className="w-5 h-5" />, label: 'Search', onClick: () => navigate('/search') },
    { icon: <Film className="w-5 h-5" />, label: 'Movies', onClick: () => navigate('/movies') },
    { icon: <Tv className="w-5 h-5" />, label: 'TV Shows', onClick: () => navigate('/shows') },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', onClick: () => setAboutOpen(true) },
  ]

  return (
    <div className={`relative min-h-screen text-white antialiased overflow-x-hidden ${!backgroundEnabled ? 'bg-[#060606]' : ''}`}>
      <GlassSurface />

      {cursorEnabled && <Cursor />}
      
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setCreditsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-sm font-semibold text-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] outline-none focus-visible:ring-2 focus-visible:ring-[#00f3ff]"
        >
          <Info className="w-4 h-4 text-[#00f3ff]" />
          About Creator
        </button>
      </div>

      <main className="pb-24 transition-all duration-300">
        <Suspense fallback={<AppFallback />}>
          <Routes>
            <Route path="/" element={<Home backgroundEnabled={backgroundEnabled} />} />
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
        backgroundEnabled={backgroundEnabled}
        setBackgroundEnabled={setBackgroundEnabled}
      />

      <CreditsModal
        isOpen={creditsOpen}
        onClose={() => setCreditsOpen(false)}
      />
    </div>
  )
}
