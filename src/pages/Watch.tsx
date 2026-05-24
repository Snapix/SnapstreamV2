import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Play, ArrowLeft, Star, Maximize2, Film, Monitor, ExternalLink,
  ChevronDown,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useTMDB } from '../hooks/useTMDB'
import { PlayerWrapper } from '../components/PlayerWrapper'
import MovieRow from '../components/MovieRow'
import { MovieCard } from '../components/MovieCard'
import GlassIcons from '../components/GlassIcons'
import { FadeContent } from '../components/FadeContent'
import { BlurText } from '../components/BlurText'

const EMBED_SOURCES = [
  {
    id: 'vidsrc',
    name: 'VidSrc',
    url: (id: number, type: string, season?: number, episode?: number) =>
      type === 'tv'
        ? `https://vidsrc.xyz/embed/tv/${id}/${season ?? 1}/${episode ?? 1}`
        : `https://vidsrc.xyz/embed/movie/${id}`,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'vidlink',
    name: 'VidLink',
    url: (id: number, type: string, season?: number, episode?: number) =>
      type === 'tv'
        ? `https://vidlink.pro/tv/${id}/${season ?? 1}/${episode ?? 1}`
        : `https://vidlink.pro/movie/${id}`,
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'superembed',
    name: 'SuperEmbed',
    url: (id: number, type: string, season?: number, episode?: number) =>
      type === 'tv'
        ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season ?? 1}&e=${episode ?? 1}`
        : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
    color: 'from-emerald-500 to-green-600',
  },
  {
    id: '2embed',
    name: '2Embed',
    url: (id: number, type: string, season?: number, episode?: number) =>
      type === 'tv'
        ? `https://www.2embed.cc/embedtv/${id}&s=${season ?? 1}&e=${episode ?? 1}`
        : `https://www.2embed.cc/embed/${id}`,
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'smashy',
    name: 'SmashyStream',
    url: (id: number, type: string, season?: number, episode?: number) =>
      `https://embed.smashystream.com/playere.php?tmdb=${id}&type=${type === 'tv' ? 'tv' : 'movie'}${type === 'tv' ? `&season=${season ?? 1}&episode=${episode ?? 1}` : ''}`,
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'embedsu',
    name: 'Embed.su',
    url: (id: number, type: string, season?: number, episode?: number) =>
      type === 'tv'
        ? `https://embed.su/embed/tv/${id}/${season ?? 1}/${episode ?? 1}`
        : `https://embed.su/embed/movie/${id}`,
    color: 'from-sky-500 to-cyan-600',
  },
]

export default function Watch() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const mediaType = type === 'tv' ? 'tv' : 'movie'
  const mediaId = Number(id)

  const [sourceIdx, setSourceIdx] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [season, setSeason] = useState(1)
  const [episode, setEpisode] = useState(1)
  const [showSeasonPicker, setShowSeasonPicker] = useState(false)

  const { data: details } = useTMDB<any>(`${mediaType}/${mediaId}`, null)
  const { data: similar } = useTMDB<any[]>(`${mediaType}/${mediaId}/similar`, [])
  const { data: credits } = useTMDB<any>(`${mediaType}/${mediaId}/credits`, null)
  const { data: seasons } = useTMDB<any[]>(mediaType === 'tv' ? `tv/${mediaId}` : null, [])

  const source = EMBED_SOURCES[sourceIdx]
  const embedUrl = source?.url(mediaId, mediaType, season, episode) ?? ''

  const director = credits?.crew?.find((c: any) => c.job === 'Director')?.name
  const cast = credits?.cast?.slice(0, 6).map((c: any) => c.name).join(', ') ?? ''
  const title = details?.title ?? details?.name ?? ''
  const poster = details?.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : '/placeholder.svg'

  const seasonCount = (details as any)?.seasons?.length ?? 0

  return (
    <div className={`relative min-h-screen pt-16 sm:pt-20 ${fullscreen ? '!pt-0' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </Link>

        <FadeContent delay={0.1}>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-black' : 'flex-1 min-w-0'}`}>
              <PlayerWrapper embedUrl={embedUrl} title={title} />

              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Server</p>
                  <div className="flex flex-wrap gap-2">
                    {EMBED_SOURCES.map((s, i) => (
                      <button
                        key={s.id}
                        onClick={() => setSourceIdx(i)}
                        className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                          i === sourceIdx
                            ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                            : 'bg-black/40 text-zinc-400 border-white/10 hover:text-white hover:border-white/30'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Fullscreen
                </button>
              </div>

              {mediaType === 'tv' && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowSeasonPicker(!showSeasonPicker)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                      S{season} • E{episode}
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                    {showSeasonPicker && (
                      <div className="absolute top-full mt-2 left-0 z-40 bg-[#111] border border-white/10 rounded-xl p-3 shadow-2xl min-w-[200px] max-h-[280px] overflow-y-auto">
                        {Array.from({ length: seasonCount || 1 }, (_, s) => (
                          <div key={s} className="mb-2">
                            <p className="text-xs text-zinc-500 font-semibold mb-1 px-1">
                              Season {s + 1}
                            </p>
                            <div className="grid grid-cols-6 gap-1">
                              {Array.from({ length: (details as any)?.seasons?.[s]?.episode_count ?? 12 }, (_, e) => (
                                <button
                                  key={e}
                                  onClick={() => {
                                    setSeason(s + 1)
                                    setEpisode(e + 1)
                                    setShowSeasonPicker(false)
                                  }}
                                  className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                                    season === s + 1 && episode === e + 1
                                      ? 'bg-white text-black'
                                      : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                                  }`}
                                >
                                  {e + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:w-80 flex-shrink-0 space-y-6">
              <div className="flex gap-4">
                <img
                  src={poster}
                  alt={title}
                  className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl object-cover border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <h1 className="font-display text-xl sm:text-2xl font-black text-white leading-tight">
                    {title}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white px-1.5 py-0.5 rounded-md bg-black/50 border border-white/[.06]">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {details?.vote_average?.toFixed(1)}
                    </span>
                    {details?.release_date && (
                      <span className="text-xs text-zinc-400">
                        {details.release_date.slice(0, 4)}
                      </span>
                    )}
                    {details?.runtime && (
                      <span className="text-xs text-zinc-400">{details.runtime}m</span>
                    )}
                  </div>
                  {director && (
                    <p className="text-xs text-zinc-400 mt-2">
                      <span className="text-zinc-500">Director:</span> {director}
                    </p>
                  )}
                  {cast && (
                    <p className="text-xs text-zinc-400 mt-1 truncate">
                      <span className="text-zinc-500">Cast:</span> {cast}
                    </p>
                  )}
                </div>
              </div>

              {details?.overview && (
                <p className="text-sm text-zinc-300 leading-relaxed">{details.overview}</p>
              )}

              {details?.genres && (
                <div className="flex flex-wrap gap-2">
                  {details.genres.map((g: any) => (
                    <span
                      key={g.id}
                      className="text-[11px] font-semibold text-zinc-300 px-2.5 py-1 rounded-full bg-white/5 border border-white/10"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FadeContent>

        {similar && similar.length > 0 && (
          <FadeContent delay={0.3}>
            <div className="mt-12">
              <MovieRow
                title={
                  <span className="inline-flex items-center gap-2">
                    <Film className="w-4 h-4 text-primary" />
                    <BlurText text="You May Also Like" delay={0.15} />
                  </span>
                }
              >
                {similar.slice(0, 12).map((item: any) => (
                  <MovieCard key={item.id} item={item} mediaType={mediaType} />
                ))}
              </MovieRow>
            </div>
          </FadeContent>
        )}
      </div>
    </div>
  )
}
