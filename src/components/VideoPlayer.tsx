import { isHLSProvider, type MediaPlayerInstance } from '@vidstack/react'
import { MediaPlayer, MediaProvider, type MediaCanPlayDetail, type MediaCanPlayEvent } from '@vidstack/react'
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default'
import { useRef } from 'react'
import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'

interface VideoPlayerProps {
  title: string
  src: string
  poster?: string
}

export default function VideoPlayer({ title, src, poster }: VideoPlayerProps) {
  const player = useRef<MediaPlayerInstance>(null)

  function onProviderChange(provider: any) {
    if (isHLSProvider(provider)) {
      provider.library = () => import('hls.js')
    }
  }

  function onCanPlay(_detail: MediaCanPlayDetail, _nativeEvent: MediaCanPlayEvent) {
    player.current?.play().catch(() => {})
  }

  return (
    <MediaPlayer
      ref={player}
      className="w-full aspect-video rounded-xl overflow-hidden cyber-glow"
      title={title}
      src={src}
      poster={poster}
      onProviderChange={onProviderChange}
      onCanPlay={onCanPlay}
      streamType="on-demand"
      load="visible"
    >
      <MediaProvider />
      <DefaultVideoLayout
        icons={defaultLayoutIcons}
        slots={{
          beforeSettingsMenu: null,
        }}
      />
    </MediaPlayer>
  )
}
