'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export interface AudioTrack {
  id: string;
  title: string;
  titleHi?: string;
  album?: string;
  albumHi?: string;
  audioUrl: string;
  coverImage?: string;
  duration?: string;
}

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (v: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType>({
  currentTrack: null,
  isPlaying: false,
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  seek: () => {},
  currentTime: 0,
  duration: 0,
  volume: 1,
  setVolume: () => {},
  audioRef: { current: null },
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (track: AudioTrack) => {
    if (currentTrack?.id === track.id) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().catch(console.error);
          setIsPlaying(true);
        }
      }
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play().catch(console.error);
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      pauseTrack();
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack,
        togglePlay,
        seek,
        currentTime,
        duration,
        volume,
        setVolume,
        audioRef,
      }}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);

