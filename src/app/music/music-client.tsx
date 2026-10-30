'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useAudio } from '@/lib/audio-context';
import {
  Play,
  Pause,
  Search,
  Disc3,
  Sparkles,
  ExternalLink,
  Music2,
  Filter,
} from 'lucide-react';

interface MusicClientProps {
  initialTracks: any[];
  settings: any;
}

export function MusicClient({ initialTracks, settings }: MusicClientProps) {
  const { lang, t } = useLanguage();
  const { playTrack, currentTrack, isPlaying } = useAudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Categories
  const categories = [
    { key: 'ALL', en: 'All Categories', hi: 'सभी भजन व संगीत' },
    { key: 'Sundarkand', en: 'Sundarkand', hi: 'श्री सुंदरकांड पाठ' },
    { key: 'Mata Jagran', en: 'Mata Jagran & Chowki', hi: 'माता जागरण व चौकी' },
    { key: 'Khatu Shyam Sandhya', en: 'Khatu Shyam Sandhya', hi: 'खाटू श्याम संध्या' },
    { key: 'Sai Sandhya', en: 'Sai Sandhya', hi: 'श्री साईं संध्या' },
    { key: 'Akhand Ashtayam', en: 'Akhand Ashtayam', hi: 'अखंड अष्टयाम' },
    { key: 'Rangarang', en: 'Cultural & Folk', hi: 'रंगारंग व लोकगीत' },
  ];

  // Filtering
  const filteredTracks = initialTracks.filter((track) => {
    const title = (lang === 'hi' && track.titleHi ? track.titleHi : track.title).toLowerCase();
    const album = (lang === 'hi' && track.albumHi ? track.albumHi : track.album || '').toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || album.includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' ||
      track.category === selectedCategory ||
      (selectedCategory === 'Sundarkand' && track.category.includes('Sundarkand')) ||
      (selectedCategory === 'Mata Jagran' && track.category.includes('Jagran')) ||
      (selectedCategory === 'Khatu Shyam Sandhya' && track.category.includes('Shyam')) ||
      (selectedCategory === 'Sai Sandhya' && track.category.includes('Sai')) ||
      (selectedCategory === 'Akhand Ashtayam' && track.category.includes('Ashtayam')) ||
      (selectedCategory === 'Rangarang' && track.category.includes('Rangarang'));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-ivory">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'भक्तिरस संगीत प्रवाह' : 'Official Devotional Discography'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-ivory">
          {lang === 'hi' ? 'संगीत एवं भजन संग्रह' : 'Music & Bhajans Library'}
        </h1>
        <p className="text-xs sm:text-sm text-ivory/70 max-w-xl mx-auto">
          {lang === 'hi'
            ? 'गायक मुन्ना कुमार निराला के पावन स्वर में सुंदरकांड पाठ, माता की भेंटें एवं श्याम भजन सुनें।'
            : 'Listen to soulful devotional melodies, Sundarkand Chaupaiyan, Mata Jagran bhents and Shyam Bhajans.'}
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'भजन या एल्बम का नाम खोजें...' : 'Search tracks or albums...'}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-navy-card border border-gold/30 text-ivory placeholder-gray-400 focus:outline-none focus:border-gold text-sm shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
      </div>

      {/* Tracks Grid */}
      {filteredTracks.length === 0 ? (
        <div className="text-center py-16 bg-navy-card rounded-2xl border border-gold/20 p-8 space-y-3">
          <Disc3 className="w-12 h-12 text-gold/40 mx-auto" />
          <p className="text-base font-serif text-ivory">
            {lang === 'hi' ? 'कोई भजन नहीं मिला' : 'No tracks found matching your query'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="text-xs text-gold hover:underline"
          >
            {lang === 'hi' ? 'सभी भजन दिखाएँ' : 'Clear search and show all'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredTracks.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            const title = lang === 'hi' && track.titleHi ? track.titleHi : track.title;
            const album = lang === 'hi' && track.albumHi ? track.albumHi : track.album;
            const category = lang === 'hi' && track.categoryHi ? track.categoryHi : track.category;

            return (
              <div
                key={track.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isThisPlaying
                    ? 'bg-[#1e263c] border-gold shadow-gold/20 shadow-xl'
                    : 'bg-[#192033] border-gold/30 hover:border-gold/60 shadow-lg'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Artwork & Play button */}
                  <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gold/30 group">
                    <img
                      src={track.coverImage || '/images/munna_nirala_hero.jpg'}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <button
                      onClick={() => playTrack(track)}
                      className="absolute inset-0 bg-navy/50 flex items-center justify-center opacity-85 group-hover:opacity-100 transition"
                      aria-label="Play track"
                    >
                      <div className="w-10 h-10 rounded-full bg-gold hover:bg-gold-light text-navy flex items-center justify-center shadow-lg">
                        {isThisPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Track Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gold uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-navy border border-gold/20">
                        {category}
                      </span>
                      {track.isFeatured && (
                        <span className="text-[10px] text-ivory font-bold bg-[#6F1D35] px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-serif font-bold text-ivory truncate">
                      {title}
                    </h3>

                    <p className="text-xs text-gray-400 truncate">
                      {album} • {track.duration}
                    </p>

                    <div className="pt-1 flex items-center gap-3 text-xs">
                      <button
                        onClick={() => playTrack(track)}
                        className="text-gold hover:text-gold-light font-bold flex items-center gap-1.5"
                      >
                        {isThisPlaying ? 'Playing Now' : 'Listen Now'}
                      </button>

                      {track.youtubeUrl && (
                        <a
                          href={track.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-red-400 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>YouTube</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

