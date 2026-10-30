'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { VideoModal } from '@/components/VideoModal';
import { Play, Sparkles, Clock, Video } from 'lucide-react';

interface VideosClientProps {
  initialVideos: any[];
}

export function VideosClient({ initialVideos }: VideosClientProps) {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  const categories = [
    { key: 'ALL', en: 'All Videos', hi: 'सभी वीडियो' },
    { key: 'Mata Jagran', en: 'Mata Jagran & Chowki', hi: 'माता जागरण व चौकी' },
    { key: 'Sundarkand', en: 'Sundarkand Path', hi: 'श्री सुंदरकांड पाठ' },
    { key: 'Khatu Shyam Sandhya', en: 'Khatu Shyam Sandhya', hi: 'खाटू श्याम संध्या' },
    { key: 'Jhanki', en: 'Jhanki Prastuti', hi: 'सजीव झाँकी' },
    { key: 'Concert', en: 'Stage Highlights', hi: 'मंच प्रस्तुतियां' },
  ];

  const filteredVideos = initialVideos.filter((v) => {
    if (selectedCategory === 'ALL') return true;
    return (
      v.category === selectedCategory ||
      (selectedCategory === 'Mata Jagran' && v.category.includes('Jagran')) ||
      (selectedCategory === 'Sundarkand' && v.category.includes('Sundarkand')) ||
      (selectedCategory === 'Khatu Shyam Sandhya' && v.category.includes('Shyam')) ||
      (selectedCategory === 'Jhanki' && v.category.includes('Jhanki')) ||
      (selectedCategory === 'Concert' && v.category.includes('Concert'))
    );
  });

  return (
    <div className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-ivory">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'भक्तिरस वीडियो दर्शन' : 'Official Performance Gallery'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-ivory">
          {lang === 'hi' ? 'वीडियो लाइब्रेरी' : 'Video Performances'}
        </h1>
        <p className="text-xs sm:text-sm text-ivory/70 max-w-xl mx-auto">
          {lang === 'hi'
            ? 'माता के जागरण, संगीतमय सुंदरकांड, श्याम संध्या और सजीव झांकियों के वीडियो देखें।'
            : 'Watch full-length concert highlights, devotional Jagran sessions, Sundarkand recitations, and divine Jhanki performances.'}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((c) => {
          const isSelected = selectedCategory === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                isSelected
                  ? 'bg-gold text-navy shadow-md font-bold'
                  : 'bg-navy-light text-ivory/80 hover:text-gold hover:bg-navy border border-gold/20'
              }`}
            >
              {lang === 'hi' ? c.hi : c.en}
            </button>
          );
        })}
      </div>

      {/* Video Cards Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-navy-card rounded-2xl border border-gold/20 p-8 space-y-3">
          <Video className="w-12 h-12 text-gold/40 mx-auto" />
          <p className="text-base font-serif text-ivory">
            {lang === 'hi' ? 'इस श्रेणी में कोई वीडियो उपलब्ध नहीं है' : 'No videos found in this category'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const title = lang === 'hi' && video.titleHi ? video.titleHi : video.title;
            const description =
              lang === 'hi' && video.descriptionHi ? video.descriptionHi : video.description;
            const category = lang === 'hi' && video.categoryHi ? video.categoryHi : video.category;

            return (
              <div
                key={video.id}
                onClick={() => setActiveVideo({ url: video.videoUrl, title })}
                className="bg-[#192033] rounded-2xl border border-gold/30 overflow-hidden shadow-lg hover:border-gold/60 transition group cursor-pointer flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-navy-dark">
                  <img
                    src={video.thumbnail || '/images/munna_nirala_stage.jpg'}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/10 transition" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#6F1D35]/90 border border-gold text-ivory flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                      <Play className="w-6 h-6 fill-current text-gold ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[11px] text-ivory font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold" />
                      <span>{video.duration}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                      {category}
                    </span>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-ivory line-clamp-2 mt-1">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-xs text-ivory/70 line-clamp-2 mt-1 font-light">
                        {description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-gold font-semibold">
                    <span className="flex items-center gap-1 group-hover:underline">
                      <Play className="w-3 h-3 fill-current" />
                      {t('btn.watchVideo')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Modal Popup */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.url || ''}
        title={activeVideo?.title || ''}
      />
    </div>
  );
}

