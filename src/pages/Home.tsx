import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Film, Tv, TrendingUp, Sparkles } from 'lucide-react'
import { useTMDB } from '../hooks/useTMDB'
import HeroBanner from '../components/HeroBanner'
import MovieRow from '../components/MovieRow'
import { MovieCard } from '../components/MovieCard'
import DarkVeil from '../components/DarkVeil'
import { FadeContent } from '../components/FadeContent'
import { BlurText } from '../components/BlurText'

export default function Home() {
  const { data: trending } = useTMDB<any[]>('trending/all/week', [], { page: 1 })
  const { data: movies } = useTMDB<any[]>('movie/popular', [], { page: 1 })
  const { data: shows } = useTMDB<any[]>('tv/popular', [], { page: 1 })
  const { data: topRated } = useTMDB<any[]>('movie/top_rated', [], { page: 1 })

  const heroItems = useMemo(() => (trending ?? []).slice(0, 6), [trending])

  return (
    <div className="relative min-h-screen pb-16">
      <DarkVeil mouseMove canvasWidth={320} canvasHeight={320} />

      <HeroBanner items={heroItems} />

      <FadeContent delay={0.2}>
        <div className="mt-8 sm:mt-12 space-y-10 sm:space-y-14">
          <MovieRow
            title={
              <span className="inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
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
                <Film className="w-4 h-4 text-primary" />
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
                <Tv className="w-4 h-4 text-primary" />
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
                <Sparkles className="w-4 h-4 text-primary" />
                <BlurText text="Top Rated" delay={0.25} />
              </span>
            }
          >
            {topRated?.map((item: any) => (
              <MovieCard key={item.id} item={item} mediaType="movie" />
            ))}
          </MovieRow>
        </div>
      </FadeContent>
    </div>
  )
}
