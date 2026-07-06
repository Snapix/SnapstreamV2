import { useEffect, useState } from 'react'
import { useTrending } from '../hooks/useTMDB'
import InfiniteMenu from '../components/InfiniteMenu'

export default function Home() {
  const { data: trending, loading } = useTrending()
  const [menuItems, setMenuItems] = useState<{
    id: number
    title: string
    image: string
    media_type: 'movie' | 'tv'
    type: 'movie' | 'tv'
  }[]>([])

  useEffect(() => {
    if (trending.length) {
      const items = trending
        .filter(item => item.backdrop_path || item.poster_path)
        .slice(0, 20)
        .map(item => ({
          id: item.id,
          title: item.title ?? item.name ?? 'Unknown',
          image: item.backdrop_path
            ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
            : `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          media_type: item.media_type,
          type: item.media_type
        }))
      setMenuItems(items)
    }
  }, [trending])

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#0a0a1a] to-black">
      <div className="w-full h-[75vh] min-h-[500px]">
        <InfiniteMenu items={menuItems} scale={1.0} />
      </div>

      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {trending.slice(0, 24).map(item => (
            <a
              key={item.id}
              href={`/watch/${item.media_type}/${item.id}`}
              className="group block"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900">
                {item.backdrop_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                    alt={item.title ?? item.name ?? ''}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title ?? item.name ?? ''}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-semibold truncate">{item.title ?? item.name}</h3>
                  <p className="text-sm text-gray-400">{item.media_type === 'movie' ? 'Movie' : 'TV Show'} • {item.vote_average?.toFixed(1)}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}