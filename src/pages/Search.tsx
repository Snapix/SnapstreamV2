import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { tmdb, imgUrl, type TMDBMovie, type TMDBShow } from '../lib/api'
import GlassSurface from '../components/react-bits/GlassSurface/GlassSurface'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<(TMDBMovie | TMDBShow)[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    const timer = setTimeout(() => {
      tmdb.search(query).then(res => {
        setResults(res.results)
        setLoading(false)
      }).catch(() => setLoading(false))
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold text-white mb-2">
          {query ? `Results for "${query}"` : 'Search'}
        </h1>
        <p className="text-sm text-muted mb-8">
          {results.length > 0 ? `${results.length} results found` : ''}
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-surface-lighter animate-pulse" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((item) => (
            <SearchCard key={`${item.id}-${'title' in item ? 'movie' : 'tv'}`} item={item} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-20">
          <p className="text-muted">No results found for "{query}"</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted">Type something in the search bar to find movies & shows</p>
        </div>
      )}
    </div>
  )
}

function SearchCard({ item }: { item: TMDBMovie | TMDBShow }) {
  const title = 'title' in item ? item.title : 'name' in item ? item.name : ''
  const type = 'title' in item ? 'movie' : 'tv'
  const year = 'release_date' in item && item.release_date
    ? item.release_date.split('-')[0]
    : 'first_air_date' in item && item.first_air_date
    ? item.first_air_date.split('-')[0]
    : ''

  return (
    <Link to={`/watch/${item.id}?type=${type}`}>
      <GlassSurface className="group cursor-pointer">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
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
              <p className="text-[10px] text-muted">{year || type}</p>
            </div>
          </div>
        </motion.div>
      </GlassSurface>
    </Link>
  )
}
