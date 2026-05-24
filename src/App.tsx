import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import Navbar from './components/Navbar'
import SplashScreen from './components/SplashScreen'
import AboutModal from './components/AboutModal'
import Home from './pages/Home'
import Search from './pages/Search'
import Watch from './pages/Watch'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [showAbout, setShowAbout] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onFinish={() => setShowSplash(false)} />
        ) : (
          <div className="flex flex-col min-h-screen">
            <Navbar onAboutClick={() => setShowAbout(true)} />
            <main className="flex-1">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/watch/:id" element={<Watch />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        )}
      </AnimatePresence>
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </>
  )
}
