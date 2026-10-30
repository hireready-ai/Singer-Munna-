'use client';

import React from 'react';
import { useAudio } from '@/lib/audio-context';
import { useLanguage } from '@/lib/language-context';
import { Play, Pause, Volume2, VolumeX, X, Disc3 } from 'lucide-react';

export function AudioPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    seek,
    currentTime,
    duration,
    volume,
    setVolume,
    pauseTrack,
  } = useAudio();
  const { lang } = useLanguage();

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const title = lang === 'hi' && currentTrack.titleHi ? currentTrack.titleHi : currentTrack.title;
  const album = lang === 'hi' && currentTrack.albumHi ? currentTrack.albumHi : currentTrack.album;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#151B2B]/95 backdrop-blur-md border-t border-[#C7A45A]/40 text-ivory shadow-2xl px-4 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-navy-light flex-shrink-0 border border-gold/30">
            {currentTrack.coverImage ? (
              <img
                src={currentTrack.coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gold">
                <Disc3 className="w-6 h-6 animate-spin" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-ivory truncate">{title}</h4>
            <p className="text-xs text-gold truncate">{album || 'Single'}</p>
          </div>
        </div>

        {/* Controls and Seekbar */}
        <div className="flex flex-col items-center w-full md:w-1/2 gap-1.5">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gold hover:bg-gold-light text-navy flex items-center justify-center transition shadow-lg"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
          </div>

          <div className="w-full flex items-center gap-3 text-xs text-gray-300">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1 h-1.5 bg-navy-light rounded-lg appearance-none cursor-pointer accent-gold"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Close */}
        <div className="hidden md:flex items-center justify-end gap-3 w-1/4">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            className="text-gray-300 hover:text-gold transition"
          >
            {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 h-1.5 bg-navy-light rounded-lg appearance-none cursor-pointer accent-gold"
          />
          <button
            onClick={() => pauseTrack()}
            className="text-gray-400 hover:text-red-400 p-1 transition"
            title="Stop / Hide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

