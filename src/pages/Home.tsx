import { useMemo, useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { useTMDB } from '../hooks/useTMDB'
import DarkVeil from '../components/DarkVeil'
import { FadeContent } from '../components/FadeContent'
import InfiniteMenu from '../components/InfiniteMenu'
import { tmdb } from '../lib/api'

export default function Home({ backgroundEnabled = true }: { backgroundEnabled?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { data: trending } = useTMDB<any[]>('trending/all/week', [], { page: 1 })

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await tmdb.search(searchQuery)
        setSearchResults(res.results || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const menuItems = useMemo(() => {
    const data = searchResults.length > 0 ? searchResults : (trending ?? [])
    return data.map(item => ({
      image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://picsum.photos/500/750?grayscale',
      link: `/watch/${item.media_type || 'movie'}/${item.id}`,
      title: item.title || item.name || 'Untitled',
      description: item.overview || ''
    }))
  }, [trending, searchResults])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white antialiased">
      {backgroundEnabled && <DarkVeil />}

      {/* Header Area with Search */}
      <div className="absolute top-0 inset-x-0 z-50 p-6 sm:p-10 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="relative group animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="absolute inset-0 bg-[#00f3ff]/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl px-6 py-4 shadow-2xl group-focus-within:border-[#00f3ff]/50 transition-all duration-300">
              <Search className="w-6 h-6 text-zinc-500 group-focus-within:text-[#00f3ff] transition-colors" />
              <input
                type="text"
                placeholder="Search movies, TV shows, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none px-4 text-xl font-medium text-white placeholder:text-zinc-500"
              />
              {isSearching && <Loader2 className="w-5 h-5 text-[#00f3ff] animate-spin" />}
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-6 animate-in fade-in slide-in-from-top-2 duration-1000 delay-200">
            <h1 className="font-display text-3xl font-black text-white tracking-widest uppercase opacity-30">
              SnapStream
            </h1>
            <div className="h-6 w-px bg-white/10" />
            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] opacity-60">
              {searchResults.length > 0 ? `Results for "${searchQuery}"` : 'Trending This Week'}
            </p>
          </div>
        </div>
      </div>

      <FadeContent delay={0.2} className="h-full w-full">
        <div className="h-full w-full">
          <InfiniteMenu items={menuItems} scale={1.3} />
        </div>
      </FadeContent>
    </div>
  )
}
