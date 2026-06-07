import { useMemo, useState } from 'react'
import { Film, MonitorPlay, Gamepad2, Sparkles } from 'lucide-react'
import { useTMDB } from '../hooks/useTMDB'
import { FadeContent } from '../components/FadeContent'
import HeroBanner from '../components/HeroBanner'
import MovieRow from '../components/MovieRow'
import { MovieCard } from '../components/MovieCard'
import { useNavigate } from 'react-router-dom'

interface HomeProps {
  mediaType?: 'video' | 'apps' | 'livetv'
}

export default function Home({ mediaType = 'video' }: HomeProps) {
  const navigate = useNavigate()
  
  // Data Fetching
  const { data: trendingWorld } = useTMDB<any[]>('trending/all/day', [], { page: '1' })
  const { data: popularMovies } = useTMDB<any[]>('movie/popular', [], { page: '1' })
  const { data: popularTV } = useTMDB<any[]>('tv/popular', [], { page: '1' })
  const { data: topRated } = useTMDB<any[]>('movie/top_rated', [], { page: '1' })

  const heroItems = useMemo(() => (trendingWorld || []).slice(0, 5), [trendingWorld])

  return (
    <div className="relative min-h-screen bg-[#060606] text-white">
      {/* Hero Section */}
      <HeroBanner items={heroItems} />

      <FadeContent delay={0.2}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 -mt-20 relative z-30 space-y-12">
          
          <div className="flex items-center gap-4 mb-8 overflow-x-auto scrollbar-hide py-2">
             <button 
               onClick={() => navigate('/ai')}
               className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff]/20 text-[#00f3ff] font-black uppercase tracking-widest text-[10px] hover:bg-[#00f3ff] hover:text-black transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)]"
             >
                <Sparkles className="w-4 h-4" /> Try SnapStream AI
             </button>
          </div>

          <MovieRow title="Trending Now">
            {(trendingWorld || []).map((item) => (
              <MovieCard key={item.id} item={item} mediaType={item.media_type} />
            ))}
          </MovieRow>

          <MovieRow title="Popular Movies">
            {(popularMovies || []).map((item) => (
              <MovieCard key={item.id} item={item} mediaType="movie" />
            ))}
          </MovieRow>

          <MovieRow title="Top Rated Masterpieces">
            {(topRated || []).map((item) => (
              <MovieCard key={item.id} item={item} mediaType="movie" />
            ))}
          </MovieRow>

          <MovieRow title="Popular TV Shows">
            {(popularTV || []).map((item) => (
              <MovieCard key={item.id} item={item} mediaType="tv" />
            ))}
          </MovieRow>

        </div>
      </FadeContent>
    </div>
  )
}
