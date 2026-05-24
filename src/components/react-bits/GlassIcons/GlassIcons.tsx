import type { ReactNode } from 'react'

interface GlassIconProps {
  children: ReactNode
  label?: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export default function GlassIcon({
  children,
  label,
  active = false,
  onClick,
  className = '',
}: GlassIconProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center justify-center w-12 h-12 rounded-xl
        backdrop-blur-xl border transition-all duration-300 group
        ${active
          ? 'bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/20'
          : 'bg-white/5 border-white/10 text-muted hover:bg-white/10 hover:border-white/20 hover:text-white'
        }
        ${className}
      `}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
      {label && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
      )}
    </button>
  )
}
