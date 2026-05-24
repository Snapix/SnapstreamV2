import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useTrending, usePopular } from '../hooks/useTMDB'
import { imgUrl, type TMDBMovie, type TMDBShow } from '../lib/api'
import DarkVeil from '../components/react-bits/DarkVeil/DarkVeil'
import FluidGlass from '../components/react-bits/FluidGlass/FluidGlass'
import GlassSurface from '../components/react-bits/GlassSurface/GlassSurface'
import GlassIcon from '../components/react-bits/GlassIcons/GlassIcons'

export default function Home() {
  const { data: trending, loading: trendingLoading } = useTrending()
  const { data: popular, loading: popularLoading } = usePopular()

  const featured = trending?.[0]

  return (
    <div className="relative min-h-screen pt-16">
      <DarkVeil opacity={0.12} speed={0.5} />

      {/* Hero section */}
      {featured && (
        <section className="relative h-[60vh] sm:h-[70vh] flex items-end overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imgUrl(featured.backdrop_path, 'original')})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />

          <FluidGlass mode="lens" color="#00f3ff" className="absolute inset-0" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-3"
            >
              {'title' in featured ? featured.title : 'name' in featured ? featured.name : ''}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base text-gray-300 max-w-xl mb-6 line-clamp-2"
            >
              {featured.overview}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <Link
                to={`/watch/${featured.id}?type=${'title' in featured ? 'movie' : 'tv'}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-black font-semibold text-sm hover:bg-primary-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Watch Now
              </Link>
              <span className="text-sm text-muted">
                {'vote_average' in featured ? featured.vote_average.toFixed(1) : 'N/A'} / 10
              </span>
            </motion.div>
          </div>
        </section>
      )}

      {/* Trending row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-white">Trending</h2>
          <div className="flex gap-2">
            <GlassIcon label="Movies" active>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>
            </GlassIcon>
            <GlassIcon label="TV">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </GlassIcon>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl bg-surface-lighter animate-pulse" />
              ))
            : trending?.slice(1).map((item) => (
                <MovieCard key={item.id} item={item} />
              ))}
        </div>
      </section>

      {/* Popular row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl font-display font-semibold text-white mb-6"
        >
          Popular
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl bg-surface-lighter animate-pulse" />
              ))
            : popular?.map((item) => (
                <MovieCard key={item.id} item={item} />
              ))}
        </div>
      </section>
    </div>
  )
}

function MovieCard({ item }: { item: TMDBMovie | TMDBShow }) {
  const title = 'title' in item ? item.title : 'name' in item ? item.name : ''
  const href = `/watch/${item.id}?type=${'title' in item ? 'movie' : 'tv'}`

  return (
    <Link to={href}>
      <GlassSurface className="group cursor-pointer">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          className="aspect-[2/3] rounded-xl overflow-hidden relative"
        >
          <img
            src={imgUrl(item.poster_path, 'w500')}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <div>
              <p className="text-xs text-white font-semibold">{title}</p>
              <p className="text-[10px] text-primary">
                {item.vote_average?.toFixed(1) || 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>
      </GlassSurface>
    </Link>
  )
}
