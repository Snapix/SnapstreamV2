import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Film, Tv, TrendingUp, Sparkles, Layers } from 'lucide-react'
import { useTMDB } from '../hooks/useTMDB'
import HeroBanner from '../components/HeroBanner'
import MovieRow from '../components/MovieRow'
import { MovieCard } from '../components/MovieCard'
import DarkVeil from '../components/DarkVeil'
import { FadeContent } from '../components/FadeContent'
import { BlurText } from '../components/BlurText'
import InfiniteMenu from '../components/InfiniteMenu'

export default function Home({ backgroundEnabled = true }: { backgroundEnabled?: boolean }) {
  const { data: trending } = useTMDB<any[]>('trending/all/week', [], { page: 1 })
  const { data: movies } = useTMDB<any[]>('movie/popular', [], { page: 1 })
  const { data: shows } = useTMDB<any[]>('tv/popular', [], { page: 1 })
  const { data: topRated } = useTMDB<any[]>('movie/top_rated', [], { page: 1 })

  const [use3DMenu, setUse3DMenu] = useState(false)

  const heroItems = useMemo(() => (trending ?? []).slice(0, 6), [trending])

  const menuItems = useMemo(() => {
    return (trending ?? []).map(item => ({
      image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://picsum.photos/500/750?grayscale',
      link: `/watch/${item.media_type || 'movie'}/${item.id}`,
      title: item.title || item.name || 'Untitled',
      description: item.overview || ''
    }))
  }, [trending])

  return (
    <div className="relative min-h-screen pb-16">
      {backgroundEnabled && <DarkVeil />}

      <HeroBanner items={heroItems} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex justify-end">
        <button
          onClick={() => setUse3DMenu(!use3DMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Layers className="w-4 h-4" />
          {use3DMenu ? 'Standard View' : 'Try New UI Menu'}
        </button>
      </div>

      <FadeContent delay={0.2}>
        {use3DMenu ? (
          <div className="fixed inset-0 z-50 bg-[#060606]">
            <div className="absolute top-4 right-4 z-[60]">
              <button
                onClick={() => setUse3DMenu(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm font-semibold text-white hover:bg-white/20 transition-colors shadow-lg backdrop-blur-md"
              >
                Close 3D View
              </button>
            </div>
            <InfiniteMenu items={menuItems} />
          </div>
        ) : (
          <div className="mt-8 sm:mt-12 space-y-10 sm:space-y-14">
            <MovieRow
              title={
                <span className="inline-flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#00f3ff]" />
                  <BlurText text="Trending Now" delay={0.1} />
                </span>
              }
            >
              {trending?.map((item: any) => (
                <MovieCard key={item.id} item={item} mediaType={item.media_type} />
              ))}
            </MovieRow>

            <MovieRow
              title={
                <span className="inline-flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#00f3ff]" />
                  <BlurText text="Popular Movies" delay={0.15} />
                </span>
              }
            >
              {movies?.map((item: any) => (
                <MovieCard key={item.id} item={item} mediaType="movie" />
              ))}
            </MovieRow>

            <MovieRow
              title={
                <span className="inline-flex items-center gap-2">
                  <Tv className="w-4 h-4 text-[#00f3ff]" />
                  <BlurText text="Popular Series" delay={0.2} />
                </span>
              }
            >
              {shows?.map((item: any) => (
                <MovieCard key={item.id} item={item} mediaType="tv" />
              ))}
            </MovieRow>

            <MovieRow
              title={
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00f3ff]" />
                  <BlurText text="Top Rated" delay={0.25} />
                </span>
              }
            >
              {topRated?.map((item: any) => (
                <MovieCard key={item.id} item={item} mediaType="movie" />
              ))}
            </MovieRow>
          </div>
        )}
      </FadeContent>
    </div>
  )
}
