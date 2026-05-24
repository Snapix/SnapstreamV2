import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useMovieDetails, useShowDetails } from '../hooks/useTMDB'
import { imgUrl } from '../lib/api'
import VideoPlayer from '../components/VideoPlayer'
import DarkVeil from '../components/react-bits/DarkVeil/DarkVeil'

const EMBED_BASE = 'https://vidking.com/e/movie'

export default function Watch() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const mediaType = searchParams.get('type') || 'movie'
  const numericId = Number(id)

  const { data: movie, loading: movieLoading } = useMovieDetails(
    mediaType === 'movie' ? numericId : 0
  )
  const { data: show, loading: showLoading } = useShowDetails(
    mediaType === 'tv' ? numericId : 0
  )

  const data = mediaType === 'movie' ? movie : show
  const loading = mediaType === 'movie' ? movieLoading : showLoading

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-muted">Content not found</p>
      </div>
    )
  }

  const title = 'title' in data ? data.title : 'name' in data ? data.name : ''
  const year = 'release_date' in data ? data.release_date?.split('-')[0] : 'first_air_date' in data ? data.first_air_date?.split('-')[0] : ''
  const embedUrl = `${EMBED_BASE}?id=${numericId}`
  const poster = imgUrl(data.poster_path, 'w500')
  const backdrop = imgUrl(data.backdrop_path, 'original')

  return (
    <div className="min-h-screen pt-16 relative">
      <DarkVeil opacity={0.1} speed={0.4} />

      {/* Backdrop */}
      <div
        className="absolute top-0 left-0 right-0 h-[60vh] bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${backdrop})` }}
      />
      <div className="absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-transparent to-surface" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">{title}</h1>
          {year && (
            <span className="text-sm text-muted">{year}</span>
          )}
          {'genres' in data && data.genres && (
            <div className="flex flex-wrap gap-2 mt-3">
              {data.genres.map(g => (
                <span key={g.id} className="text-[11px] px-3 py-1 rounded-full glass text-muted">
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <VideoPlayer
            title={title}
            src={embedUrl}
            poster={poster}
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <div className="sm:col-span-2">
            <h3 className="text-sm font-display font-semibold text-white mb-2">Overview</h3>
            <p className="text-sm text-muted leading-relaxed">{data.overview || 'No overview available.'}</p>
            {'tagline' in data && data.tagline && (
              <p className="text-sm text-primary/70 italic mt-3">"{data.tagline}"</p>
            )}
          </div>
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-display font-semibold text-white mb-3">Details</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Rating</span>
                <span className="text-primary">{data.vote_average?.toFixed(1) || 'N/A'}/10</span>
              </div>
              {'runtime' in data && data.runtime && (
                <div className="flex justify-between">
                  <span className="text-muted">Runtime</span>
                  <span>{data.runtime} min</span>
                </div>
              )}
              {'number_of_seasons' in data && (
                <div className="flex justify-between">
                  <span className="text-muted">Seasons</span>
                  <span>{data.number_of_seasons}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
