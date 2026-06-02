'use client'

import { useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="relative w-10 h-10">
      {isPlaying && (
        <>
          <span className="absolute inset-0 rounded-full animate-music-ripple" style={{ backgroundColor: 'color-mix(in srgb, #c9a96e 50%, transparent)' }} />
          <span className="absolute inset-0 rounded-full animate-music-ripple" style={{ backgroundColor: 'color-mix(in srgb, #c9a96e 35%, transparent)', animationDelay: '0.5s' }} />
          <span className="absolute inset-0 rounded-full animate-music-ripple" style={{ backgroundColor: 'color-mix(in srgb, #c9a96e 20%, transparent)', animationDelay: '1s' }} />
        </>
      )}
      <button
        onClick={toggle}
        className="relative w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-black/40 hover:text-white transition-colors cursor-pointer"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
      <audio
        ref={audioRef}
        src="/music/tunetank-romantic-wedding-acoustic-guitar.mp3"
        loop
      />
    </div>
  )
}
