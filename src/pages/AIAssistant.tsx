import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Play, Bot } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { askAI } from '../lib/ai'
import GlassSurface from '../components/GlassSurface'
import { FadeContent } from '../components/FadeContent'

interface Message {
  role: 'user' | 'model'
  text: string
  id: string
}

export default function AIAssistant() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your SnapStream AI assistant. What would you like to watch today?", id: 'initial' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg, id: Date.now().toString() }])
    setLoading(true)

    const response = await askAI(userMsg)
    setMessages(prev => [...prev, { role: 'model', text: response, id: (Date.now() + 1).toString() }])
    setLoading(false)
  }

  const extractMovie = (text: string) => {
    const match = text.match(/\[ID:\s*(\d+)\]/)
    return match ? match[1] : null
  }

  return (
    <div className="relative min-h-screen pt-24 pb-32 overflow-hidden bg-black">
      <GlassSurface />
      <div className="max-w-4xl mx-auto px-4 flex flex-col h-[calc(100vh-200px)] relative z-10">
        
        <FadeContent delay={0.1}>
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-3">
               <Bot className="w-5 h-5 text-[#00f3ff]" />
               <h1 className="text-xl font-black uppercase tracking-tighter text-white">SnapStream AI</h1>
            </div>
            <div className="w-16" />
          </div>
        </FadeContent>

        <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide mb-8">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const movieId = extractMovie(msg.text)
              const cleanText = msg.text.replace(/\[ID:\s*\d+\]/g, '')
              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-5 space-y-4 ${
                    msg.role === 'user' 
                      ? 'bg-[#00f3ff] text-black font-bold' 
                      : 'bg-white/5 border border-white/10 backdrop-blur-md text-zinc-100'
                  }`}>
                    <p className="text-sm sm:text-base leading-relaxed">{cleanText}</p>
                    {msg.role === 'model' && movieId && (
                       <button 
                         onClick={() => navigate(`/watch/movie/${movieId}`)}
                         className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00f3ff] text-black font-black uppercase text-[10px] hover:scale-105 transition-all"
                       >
                         <Play className="w-3 h-3 fill-black" /> Watch Now
                       </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          {loading && (
             <div className="flex justify-start">
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex gap-1.5">
                     <div className="w-1.5 h-1.5 bg-[#00f3ff] rounded-full animate-bounce" />
                     <div className="w-1.5 h-1.5 bg-[#00f3ff] rounded-full animate-bounce [animation-delay:-0.15s]" />
                     <div className="w-1.5 h-1.5 bg-[#00f3ff] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  </div>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="relative">
           <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search via AI..."
            className="w-full bg-white/5 border border-white/10 focus:border-[#00f3ff]/50 rounded-2xl px-6 py-4 text-white outline-none transition-all pr-16"
            autoFocus
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-[#00f3ff] text-black hover:scale-110 transition-all disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
