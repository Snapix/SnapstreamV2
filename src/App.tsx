import { useState, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AboutModal from './components/AboutModal'
import GlassSurface from './components/GlassSurface'
import SplashScreen from './components/SplashScreen'

const Home = lazy(() => import('./pages/Home'))
const Watch = lazy(() => import('./pages/Watch'))
const SearchPage = lazy(() => import('./pages/Search'))

function AppFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />
  }

  return (
    <div className="relative min-h-screen bg-black text-white antialiased overflow-x-hidden">
      <GlassSurface />

      <Navbar onAboutClick={() => setAboutOpen(true)} />

      <main>
        <Suspense fallback={<AppFallback />}>
          <Routes>
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
        </Suspense>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <p className="text-xs text-zinc-600">
            <span className="font-display text-white/40 font-bold">SnapStream V2</span>
            {' '}&middot; Powered by TMDB
          </p>
          <button
            onClick={() => setAboutOpen(true)}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            About
          </button>
        </div>
      </footer>

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}
