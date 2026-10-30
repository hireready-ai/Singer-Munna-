'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export interface GalleryItem {
  id: string;
  title: string;
  titleHi?: string | null;
  caption?: string | null;
  captionHi?: string | null;
  imageUrl: string;
  category: string;
  categoryHi?: string | null;
  altText?: string | null;
}

interface GalleryLightboxProps {
  isOpen: boolean;
  images: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function GalleryLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxProps) {
  const { lang } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];
  if (!current) return null;

  const title = lang === 'hi' && current.titleHi ? current.titleHi : current.title;
  const caption = lang === 'hi' && current.captionHi ? current.captionHi : current.caption;
  const category = lang === 'hi' && current.categoryHi ? current.categoryHi : current.category;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-ivory">
        <span className="text-xs sm:text-sm font-medium bg-navy/80 px-3 py-1.5 rounded-full border border-gold/30">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-navy/80 hover:bg-gold hover:text-navy border border-gold/40 flex items-center justify-center transition shadow-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prev Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-2 sm:left-6 z-10 w-11 h-11 rounded-full bg-navy/80 hover:bg-gold hover:text-navy border border-gold/40 flex items-center justify-center text-ivory transition shadow-xl"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div
        className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.imageUrl}
          alt={current.altText || title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/munna_nirala_stage.jpg';
          }}
          className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl border border-gold/30"
        />

        {/* Caption Card */}
        <div className="mt-3 text-center max-w-xl bg-navy/85 border border-gold/20 rounded-lg px-4 py-2 text-ivory">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider text-gold font-semibold">
              {category}
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-serif font-bold text-ivory">{title}</h4>
          {caption && <p className="text-xs text-ivory/80 mt-1">{caption}</p>}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-2 sm:right-6 z-10 w-11 h-11 rounded-full bg-navy/80 hover:bg-gold hover:text-navy border border-gold/40 flex items-center justify-center text-ivory transition shadow-xl"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

