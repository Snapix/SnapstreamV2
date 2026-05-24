import { memo, useRef, useState, useEffect } from 'react'
import { Play, Pause, Rewind, FastForward, Maximize, Volume2, VolumeX, ArrowDownToLine, ArrowUpToLine } from 'lucide-react'
import ElasticSlider from './ElasticSlider'
import { motion, AnimatePresence } from 'motion/react'

interface PlayerWrapperProps {
  embedUrl: string
  title: string
}

export const PlayerWrapper = memo(function PlayerWrapper({ embedUrl, title }: PlayerWrapperProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [controlsPosition, setControlsPosition] = useState<'overlay' | 'bottom'>('overlay')
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()
  const [volume, setVolume] = useState(100)

  const sendCommand = (command: string, args?: any) => {
    // Note: Cross-origin iframes may ignore postMessage unless they support a specific API.
    // This attempts generic messages for embedded players that might support it.
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: command, ...args }, '*')
      // VidLink specific format
      let data = args
      if (args?.time) data = args.time
      if (args?.volume !== undefined) data = args.volume
      iframeRef.current.contentWindow.postMessage({ type: command.toUpperCase(), data }, '*')
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    sendCommand(isPlaying ? 'pause' : 'play')
  }

  const handleMouseMove = () => {
    if (controlsPosition === 'bottom') return
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000)
  }

  const handleDoubleTapLeft = () => {
    sendCommand('seek', { time: -10 })
  }

  const handleDoubleTapRight = () => {
    sendCommand('seek', { time: 10 })
  }

  useEffect(() => {
    handleMouseMove()
    
    const handleBlur = () => {
      if (document.activeElement === iframeRef.current) {
        setHasInteracted(true)
      }
    }

    window.addEventListener('blur', handleBlur)
    return () => {
      clearTimeout(controlsTimeoutRef.current)
      window.removeEventListener('blur', handleBlur)
    }
  }, [controlsPosition])

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-end w-full">
        <button
          onClick={() => setControlsPosition(p => p === 'overlay' ? 'bottom' : 'overlay')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/20 shadow-lg"
        >
          {controlsPosition === 'overlay' ? (
            <><ArrowDownToLine className="w-3.5 h-3.5" /> Move Controls Down</>
          ) : (
            <><ArrowUpToLine className="w-3.5 h-3.5" /> Overlay Controls</>
          )}
        </button>
      </div>

      <div 
        className="relative w-full aspect-video max-h-[80vh] bg-black overflow-hidden rounded-xl sm:rounded-2xl border border-white/[.1] shadow-[0_0_30px_rgba(0,0,0,0.8)] group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
        onClick={() => {
          if (!hasInteracted) setHasInteracted(true)
        }}
      >
        <iframe
          ref={iframeRef}
          src={embedUrl}
          width="100%"
          height="100%"
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          className="absolute inset-0 w-full h-full border-none z-0"
          title={title}
        />

        {controlsPosition === 'overlay' && (
          <AnimatePresence>
            {showControls && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 z-10 flex flex-col justify-between pointer-events-none`}
              >
                {/* Top gradient */}
                <div className="h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

                {/* Middle interactions */}
                <div className={`flex-1 flex items-center justify-between px-8 ${!hasInteracted ? 'pointer-events-none opacity-0' : 'pointer-events-none'}`}>
                  <div 
                    className="w-1/3 h-full cursor-pointer flex items-center justify-start opacity-0 hover:opacity-100 transition-opacity pointer-events-auto"
                    onDoubleClick={handleDoubleTapLeft}
                  >
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
                      <Rewind className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <button 
                    onClick={togglePlay}
                    className={`w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,243,255,0.3)] pointer-events-auto ${!hasInteracted ? 'hidden' : ''}`}
                  >
                    {isPlaying ? <Pause className="w-8 h-8 text-white fill-white" /> : <Play className="w-8 h-8 text-white fill-white ml-1" />}
                  </button>

                  <div 
                    className="w-1/3 h-full cursor-pointer flex items-center justify-end opacity-0 hover:opacity-100 transition-opacity pointer-events-auto"
                    onDoubleClick={handleDoubleTapRight}
                  >
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
                      <FastForward className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Bottom Controls Bar */}
                <div className={`h-24 bg-gradient-to-t from-black/90 to-transparent flex items-end p-6 ${!hasInteracted ? 'pointer-events-none opacity-0' : 'pointer-events-none'}`}>
                  <div className="w-full flex items-center gap-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-3 pointer-events-auto">
                    <button onClick={togglePlay} className="hover:text-[#00f3ff] transition-colors">
                      {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                    </button>
                    
                    <div className="flex-1">
                      <ElasticSlider
                        startingValue={0}
                        defaultValue={0}
                        maxValue={100}
                        leftIcon={null}
                        rightIcon={null}
                        className="w-full !max-w-none [&_.slider-root]:max-w-none"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {volume === 0 ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                        <div className="w-24">
                          <ElasticSlider
                            startingValue={0}
                            defaultValue={volume}
                            maxValue={100}
                            onChange={setVolume}
                            leftIcon={null}
                            rightIcon={null}
                          />
                        </div>
                      </div>
                      <button className="hover:text-[#00f3ff] transition-colors">
                        <Maximize className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {controlsPosition === 'bottom' && (
        <div className="w-full flex items-center gap-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-3 shadow-lg">
          <button onClick={togglePlay} className="hover:text-[#00f3ff] transition-colors">
            {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
          </button>
          
          <div className="flex-1 flex items-center gap-4">
            <button onClick={handleDoubleTapLeft} className="hover:text-[#00f3ff] transition-colors">
              <Rewind className="w-4 h-4 text-zinc-400 hover:text-white" />
            </button>
            <ElasticSlider
              startingValue={0}
              defaultValue={0}
              maxValue={100}
              leftIcon={null}
              rightIcon={null}
              className="w-full !max-w-none [&_.slider-root]:max-w-none"
            />
            <button onClick={handleDoubleTapRight} className="hover:text-[#00f3ff] transition-colors">
              <FastForward className="w-4 h-4 text-zinc-400 hover:text-white" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {volume === 0 ? <VolumeX className="w-5 h-5 text-zinc-400" /> : <Volume2 className="w-5 h-5 text-zinc-400" />}
              <div className="w-24">
                <ElasticSlider
                  startingValue={0}
                  defaultValue={volume}
                  maxValue={100}
                  onChange={setVolume}
                  leftIcon={null}
                  rightIcon={null}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
