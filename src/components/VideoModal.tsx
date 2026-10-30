'use client';

import React, { useEffect, useMemo } from 'react';
import { X, ExternalLink, Play, AlertCircle } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export type VideoType = 'youtube' | 'instagram' | 'facebook' | 'vimeo' | 'direct' | 'iframe';

export interface ParsedVideo {
  type: VideoType;
  embedUrl: string;
  originalUrl: string;
  videoId?: string;
  isVertical?: boolean;
}

export function parseVideoUrl(url: string): ParsedVideo {
  if (!url) {
    return { type: 'direct', embedUrl: '', originalUrl: '' };
  }

  const clean = url.trim();

  // 1. Direct file or uploaded local video
  const isDirect =
    clean.startsWith('/uploads/') ||
    clean.startsWith('blob:') ||
    /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(clean);

  if (isDirect) {
    return {
      type: 'direct',
      embedUrl: clean,
      originalUrl: clean,
    };
  }

  // 2. YouTube Variants
  // Handles:
  // - youtube.com/watch?v=VIDEO_ID
  // - youtube.com/embed/VIDEO_ID
  // - youtube.com/shorts/VIDEO_ID
  // - youtube.com/live/VIDEO_ID
  // - youtu.be/VIDEO_ID
  const ytMatch = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i
  );

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const isShorts = clean.includes('/shorts/');
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      originalUrl: clean,
      isVertical: isShorts,
    };
  }

  // 3. Instagram Reels or Posts
  const instaMatch = clean.match(
    /instagram\.com\/(?:reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/i
  );

  if (instaMatch && instaMatch[1]) {
    const code = instaMatch[1];
    return {
      type: 'instagram',
      embedUrl: `https://www.instagram.com/reel/${code}/embed/`,
      originalUrl: clean,
      isVertical: true,
    };
  }

  // 4. Facebook Video or Reels
  if (clean.includes('facebook.com') || clean.includes('fb.watch')) {
    return {
      type: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        clean
      )}&show_text=0&autoplay=1`,
      originalUrl: clean,
    };
  }

  // 5. Vimeo
  const vimeoMatch = clean.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      originalUrl: clean,
    };
  }

  // Fallback as iframe
  return {
    type: 'iframe',
    embedUrl: clean,
    originalUrl: clean,
  };
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

  const parsed = useMemo(() => parseVideoUrl(videoUrl), [videoUrl]);

  if (!isOpen || !videoUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${
          parsed.isVertical ? 'max-w-md' : 'max-w-4xl'
        } bg-[#111624] rounded-2xl overflow-hidden shadow-2xl border border-gold/40 flex flex-col max-h-[92vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#151B2B] border-b border-gold/20 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-hidden pr-3">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse flex-shrink-0" />
            <h3 className="text-sm sm:text-base font-serif font-bold text-ivory truncate">
              {title || 'वीडियो प्लेयर (Video Player)'}
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {parsed.originalUrl && (
              <a
                href={parsed.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-navy-light/80 hover:bg-gold hover:text-navy text-gold text-xs font-semibold flex items-center gap-1 transition border border-gold/30"
                title="मूल लिंक पर खोलें (Open Original Link)"
              >
                <span className="hidden sm:inline">मूल लिंक</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-navy-light text-gray-300 hover:text-white hover:bg-red-600 transition flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <div
          className={`relative w-full ${
            parsed.isVertical ? 'aspect-[9/16]' : 'aspect-video'
          } bg-black flex items-center justify-center overflow-hidden`}
        >
          {parsed.type === 'direct' ? (
            <video
              src={parsed.embedUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            >
              आपका ब्राउज़र वीडियो टैग का समर्थन नहीं करता।
            </video>
          ) : (
            <iframe
              src={parsed.embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}
        </div>

        {/* Platform Indicator Footer */}
        <div className="px-4 py-2 bg-[#0E131F] border-t border-navy-light text-[11px] text-gray-400 flex items-center justify-between flex-shrink-0">
          <span className="capitalize text-gold font-medium">
            {parsed.type === 'youtube'
              ? 'यूट्यूब वीडियो (YouTube Video)'
              : parsed.type === 'instagram'
              ? 'इंस्टाग्राम रील्स/पोस्ट (Instagram)'
              : parsed.type === 'facebook'
              ? 'फेसबुक वीडियो (Facebook Video)'
              : parsed.type === 'direct'
              ? 'अपलोड किया गया वीडियो (Direct Video)'
              : 'ऑनलाइन वीडियो (Video Link)'}
          </span>
          {parsed.isVertical && (
            <span className="text-[10px] text-gray-400">वर्टिकल वीडियो (Vertical 9:16)</span>
          )}
        </div>
      </div>
    </div>
  );
}
