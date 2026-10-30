'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !videoUrl) return null;

  // Convert standard YouTube/Vimeo URLs to embeddable URLs
  let embedUrl = videoUrl;
  const isDirectVideo = videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.includes('/uploads/');

  if (!isDirectVideo) {
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (videoUrl.includes('vimeo.com/')) {
      const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
      embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-navy-card rounded-xl overflow-hidden shadow-2xl border border-gold/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-navy border-b border-gold/20">
          <h3 className="text-base font-serif font-semibold text-ivory truncate pr-4">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-navy-light text-ivory hover:text-gold hover:bg-gold/10 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          {isDirectVideo ? (
            <video
              src={embedUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}

