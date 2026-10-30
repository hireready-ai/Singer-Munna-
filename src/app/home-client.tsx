'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { useAudio } from '@/lib/audio-context';
import { VideoModal } from '@/components/VideoModal';
import { GalleryLightbox } from '@/components/GalleryLightbox';
import { PopularEventTypes } from '@/components/PopularEventTypes';
import { SuccessfulLocations } from '@/components/SuccessfulLocations';
import { ClientTestimonials } from '@/components/ClientTestimonials';
import {
  Play,
  Pause,
  Calendar,
  Sparkles,
  ArrowRight,
  Disc3,
  Video,
  Award,
  Newspaper,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ExternalLink,
  ZoomIn,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface HomePageClientProps {
  settings: any;
  bio: any;
  featuredMusic: any;
  featuredVideo: any;
  popularVideos?: any[];
  popularTracks: any[];
  highlightImages: any[];
  upcomingEvents: any[];
  awards: any[];
  pressItems: any[];
  eventTypes?: any[];
  programLocations?: any[];
  testimonials?: any[];
}

export function HomePageClient({
  settings,
  bio,
  featuredMusic,
  featuredVideo,
  popularVideos = [],
  popularTracks,
  highlightImages,
  upcomingEvents,
  awards,
  pressItems,
  eventTypes = [],
  programLocations = [],
  testimonials = [],
}: HomePageClientProps) {
  const { lang, t } = useLanguage();
  const { playTrack, currentTrack, isPlaying } = useAudio();

  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [galleryCategory, setGalleryCategory] = useState<string>('ALL');

  const artistName =
    lang === 'hi'
      ? settings?.artistNameHi || 'गायक मुन्ना कुमार निराला'
      : settings?.artistName || 'Singer Munna Kumar Nirala';

  const tagline =
    lang === 'hi'
      ? settings?.taglineHi || 'सुप्रसिद्ध भजन एवं शास्त्रीय गायक'
      : settings?.tagline || 'Renowned Devotional & Cultural Vocalist';

  const shortBio =
    lang === 'hi'
      ? settings?.shortBioHi || bio?.introductionHi || ''
      : settings?.shortBio || bio?.introduction || '';

  // Filter Highlight Images on Home
  const filteredHighlights = highlightImages.filter((img) => {
    if (galleryCategory === 'ALL') return true;
    return (
      img.category?.includes(galleryCategory) ||
      (galleryCategory === 'Stage' && img.category?.includes('Stage')) ||
      (galleryCategory === 'Devotional' && img.category?.includes('Devotional')) ||
      (galleryCategory === 'Portraits' && img.category?.includes('Portrait'))
    );
  });

  return (
    <div className="space-y-14 sm:space-y-20 pb-16">
      {/* =========================================================================
          SECTION 1: CINEMATIC HERO BANNER
      ========================================================================== */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#151B2B] text-ivory">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings?.heroImage || '/images/munna_nirala_hero.jpg'}
            alt={artistName}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/munna_nirala_hero.jpg';
            }}
            className="w-full h-full object-cover object-top opacity-60 sm:opacity-70 filter brightness-90 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151B2B] via-[#151B2B]/60 to-[#151B2B]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#151B2B]/80 via-transparent to-[#151B2B]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-6">
          {/* Devotional Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-sm shadow-md">
            <Sparkles className="w-4 h-4 text-gold-light" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Artist Stage Name */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight text-ivory text-shadow-lg leading-tight">
            <span className="block text-gold text-2xl sm:text-3xl md:text-4xl font-normal mb-2 tracking-widest uppercase">
              {lang === 'hi' ? 'भक्ति एवं संगीत के शिखर' : 'Renowned Devotional Maestro'}
            </span>
            {artistName}
          </h1>

          {/* Tagline */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-ivory/90 font-light leading-relaxed">
            {tagline}
          </p>

          {/* Hero CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/music"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-sm sm:text-base shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Disc3 className="w-5 h-5" />
              <span>{t('hero.exploreMusic')}</span>
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#6F1D35] hover:bg-[#872441] text-ivory font-bold text-sm sm:text-base border border-gold/40 shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5 text-gold" />
              <span>{t('nav.bookBtn')}</span>
            </Link>
          </div>

          {/* Quick Stats or Highlights */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-navy/80 backdrop-blur-md p-3 rounded-xl border border-gold/20">
              <span className="text-xl sm:text-2xl font-serif font-bold text-gold block">15+</span>
              <span className="text-[11px] text-gray-300 uppercase tracking-wider">
                {lang === 'hi' ? 'वर्षों की संगीत साधना' : 'Years Experience'}
              </span>
            </div>
            <div className="bg-navy/80 backdrop-blur-md p-3 rounded-xl border border-gold/20">
              <span className="text-xl sm:text-2xl font-serif font-bold text-gold block">1000+</span>
              <span className="text-[11px] text-gray-300 uppercase tracking-wider">
                {lang === 'hi' ? 'लाइव भक्ति कार्यक्रम' : 'Live Devotional Shows'}
              </span>
            </div>
            <div className="bg-navy/80 backdrop-blur-md p-3 rounded-xl border border-gold/20">
              <span className="text-xl sm:text-2xl font-serif font-bold text-gold block">100+</span>
              <span className="text-[11px] text-gray-300 uppercase tracking-wider">
                {lang === 'hi' ? 'भजन व शास्त्रीय रचनाएं' : 'Recorded Bhajans'}
              </span>
            </div>
            <div className="bg-navy/80 backdrop-blur-md p-3 rounded-xl border border-gold/20">
              <span className="text-xl sm:text-2xl font-serif font-bold text-gold block">100%</span>
              <span className="text-[11px] text-gray-300 uppercase tracking-wider">
                {lang === 'hi' ? 'श्रोताओं का प्रेम व विश्वास' : 'Divine Satisfaction'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: POPULAR EVENT TYPES (RIGHT-TO-LEFT HORIZONTAL SCROLL)
      ========================================================================== */}
      {eventTypes && eventTypes.length > 0 && (
        <PopularEventTypes eventTypes={eventTypes} />
      )}

      {/* =========================================================================
          SECTION 3: FEATURED MUSIC RELEASE
      ========================================================================== */}
      {featuredMusic && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#192033] rounded-2xl border-2 border-gold/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-0" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              {/* Artwork */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 border-2 border-gold/50 group">
                <img
                  src={featuredMusic.coverImage || '/images/munna_nirala_hero.jpg'}
                  alt={featuredMusic.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/munna_nirala_hero.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <button
                  onClick={() => playTrack(featuredMusic)}
                  className="absolute inset-0 bg-navy/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-gold text-navy flex items-center justify-center shadow-lg">
                    {currentTrack?.id === featuredMusic.id && isPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                  </div>
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-gold-light" />
                  <span>{t('section.featuredMusic')}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
                  {lang === 'hi' && featuredMusic.titleHi ? featuredMusic.titleHi : featuredMusic.title}
                </h3>

                <p className="text-gold text-sm font-medium">
                  {lang === 'hi' && featuredMusic.albumHi ? featuredMusic.albumHi : featuredMusic.album} •{' '}
                  {featuredMusic.duration}
                </p>

                <p className="text-xs sm:text-sm text-ivory/70 line-clamp-2">
                  {lang === 'hi'
                    ? 'गायक मुन्ना कुमार निराला के पावन स्वर में भक्ति एवं संगीत का दिव्य अनुभव।'
                    : 'A divine musical offering sung with heartfelt devotion by Singer Munna Kumar Nirala.'}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <button
                    onClick={() => playTrack(featuredMusic)}
                    className="px-6 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-navy font-bold text-sm flex items-center gap-2 shadow-lg transition"
                  >
                    {currentTrack?.id === featuredMusic.id && isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>{lang === 'hi' ? 'रोकें' : 'Pause'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>{t('btn.listenNow')}</span>
                      </>
                    )}
                  </button>

                  <Link
                    href="/music"
                    className="px-5 py-2.5 rounded-lg bg-navy-light hover:bg-navy border border-gold/30 text-ivory text-sm font-medium flex items-center gap-1.5 transition"
                  >
                    <span>{t('btn.viewAll')}</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: FEATURED VIDEO & VIDEO REEL SHOWCASE
      ========================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-gold text-xs sm:text-sm uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Video className="w-4 h-4" />
              <span>{t('section.featuredVideo')}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-ivory">
              {lang === 'hi' ? 'लाइव मंच एवं भक्ति वीडियो' : 'Live Performances & Devotional Videos'}
            </h2>
          </div>

          <Link
            href="/videos"
            className="text-xs sm:text-sm text-gold hover:text-gold-light font-semibold flex items-center gap-1.5 transition"
          >
            <span>{lang === 'hi' ? 'सभी वीडियो लाइब्रेरी देखें' : 'View All Videos'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Primary Cinema Video Player */}
        {featuredVideo && (
          <div
            className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-gold/50 shadow-2xl group cursor-pointer bg-navy-dark"
            onClick={() =>
              setActiveVideo({
                url: featuredVideo.videoUrl,
                title: lang === 'hi' && featuredVideo.titleHi ? featuredVideo.titleHi : featuredVideo.title,
              })
            }
          >
            <img
              src={featuredVideo.thumbnail || '/images/munna_nirala_stage.jpg'}
              alt={featuredVideo.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/munna_nirala_stage.jpg';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-black/30" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#6F1D35]/90 border-2 border-gold text-ivory flex items-center justify-center shadow-2xl group-hover:scale-115 transition transform duration-300">
                <Play className="w-9 h-9 fill-current text-gold ml-1" />
              </div>

              <div className="mt-6 max-w-xl bg-navy/85 backdrop-blur-md px-5 py-3 rounded-xl border border-gold/40 shadow-lg">
                <span className="text-[11px] text-gold uppercase tracking-wider font-semibold">
                  {lang === 'hi' && featuredVideo.categoryHi ? featuredVideo.categoryHi : featuredVideo.category}
                </span>
                <h3 className="text-base sm:text-xl font-serif font-bold text-ivory mt-0.5 line-clamp-1">
                  {lang === 'hi' && featuredVideo.titleHi ? featuredVideo.titleHi : featuredVideo.title}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Video Grid Reel: Multiple Videos on Home */}
        {popularVideos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {popularVideos.slice(0, 3).map((vid) => (
              <div
                key={vid.id}
                onClick={() =>
                  setActiveVideo({
                    url: vid.videoUrl,
                    title: lang === 'hi' && vid.titleHi ? vid.titleHi : vid.title,
                  })
                }
                className="bg-[#192033] rounded-2xl border border-gold/30 overflow-hidden shadow-xl hover:border-gold transition group cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-navy-dark">
                  <img
                    src={vid.thumbnail || '/images/munna_nirala_bhajan.jpg'}
                    alt={vid.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/munna_nirala_bhajan.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gold/90 text-navy flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  {vid.duration && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-ivory font-mono">
                      {vid.duration}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-1">
                  <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                    {lang === 'hi' && vid.categoryHi ? vid.categoryHi : vid.category}
                  </span>
                  <h4 className="text-sm font-serif font-bold text-ivory line-clamp-1 group-hover:text-gold transition">
                    {lang === 'hi' && vid.titleHi ? vid.titleHi : vid.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 5: ABOUT THE SINGER (SUMMARY)
      ========================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#192033]/80 rounded-2xl border border-gold/30 p-6 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 sm:w-80 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold/40 shadow-2xl group">
                <img
                  src={bio?.portraitImage || '/images/munna_nirala_portrait.jpg'}
                  alt={artistName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/munna_nirala_portrait.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-xs uppercase tracking-widest text-gold font-semibold">
                    {lang === 'hi' ? 'शास्त्रीय एवं सुगम संगीत' : 'Classical & Devotional Sadhana'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio Content */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="text-gold text-xs sm:text-sm uppercase tracking-widest font-semibold">
                {t('section.aboutSinger')}
              </span>

              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-ivory">
                {artistName}
              </h2>

              <p className="text-sm sm:text-base text-ivory/80 leading-relaxed font-light">
                {shortBio}
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4 text-left">
                <div className="bg-navy p-3.5 rounded-xl border border-gold/20">
                  <span className="text-xs text-gold uppercase tracking-wider block font-semibold">
                    {lang === 'hi' ? 'विशेषज्ञता' : 'Speciality'}
                  </span>
                  <p className="text-xs sm:text-sm text-ivory/90 mt-1 font-medium">
                    {lang === 'hi' ? 'सुंदरकांड पाठ, जागरण व श्याम संध्या' : 'Sundarkand, Jagran & Shyam Sandhya'}
                  </p>
                </div>

                <div className="bg-navy p-3.5 rounded-xl border border-gold/20">
                  <span className="text-xs text-gold uppercase tracking-wider block font-semibold">
                    {lang === 'hi' ? 'कार्यक्षेत्र' : 'Service Areas'}
                  </span>
                  <p className="text-xs sm:text-sm text-ivory/90 mt-1 font-medium">
                    {lang === 'hi' ? 'दिल्ली एनसीआर, बिहार व सम्पूर्ण भारत' : 'Delhi NCR, Bihar & All India'}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold hover:bg-gold-light text-navy font-bold text-sm shadow-md transition"
                >
                  <span>{t('btn.viewBio')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: POPULAR MUSIC
      ========================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-gold text-xs sm:text-sm uppercase tracking-widest font-semibold">
              {t('section.popularMusic')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
              {lang === 'hi' ? 'लोकप्रिय भजन एवं संगीत संग्रह' : 'Popular Tracks & Bhajans'}
            </h2>
          </div>

          <Link
            href="/music"
            className="text-xs sm:text-sm text-gold hover:text-gold-light font-semibold flex items-center gap-1.5 transition"
          >
            <span>{t('btn.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTracks.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                className="bg-[#192033] rounded-xl border border-gold/30 p-4 shadow-lg hover:border-gold/60 transition group flex flex-col justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gold/30">
                    <img
                      src={track.coverImage || '/images/munna_nirala_hero.jpg'}
                      alt={track.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/munna_nirala_hero.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <button
                      onClick={() => playTrack(track)}
                      className="absolute inset-0 bg-navy/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition"
                      aria-label="Play track"
                    >
                      <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center shadow">
                        {isThisPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-gold uppercase tracking-wider font-semibold block">
                      {lang === 'hi' && track.categoryHi ? track.categoryHi : track.category}
                    </span>
                    <h4 className="text-sm font-serif font-bold text-ivory truncate mt-0.5">
                      {lang === 'hi' && track.titleHi ? track.titleHi : track.title}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">
                      {lang === 'hi' && track.albumHi ? track.albumHi : track.album} • {track.duration}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-light flex items-center justify-between text-xs">
                  <button
                    onClick={() => playTrack(track)}
                    className="text-gold hover:text-gold-light font-semibold flex items-center gap-1"
                  >
                    {isThisPlaying ? 'Pause' : 'Play Now'}
                  </button>

                  <span className="text-gray-400 text-[11px]">{track.releaseDate || '2025'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: PERFORMANCE HIGHLIGHTS (ENRICHED GALLERY ON HOME)
      ========================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-gold text-xs sm:text-sm uppercase tracking-widest font-semibold">
              {t('section.performanceHighlights')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
              {lang === 'hi' ? 'भक्ति संध्या एवं मंच की अलौकिक छवियां' : 'Stage Moments & Devotional Celebrations'}
            </h2>
          </div>

          <Link
            href="/gallery"
            className="text-xs sm:text-sm text-gold hover:text-gold-light font-semibold flex items-center gap-1.5 transition"
          >
            <span>{lang === 'hi' ? 'सम्पूर्ण फोटो गैलरी देखें' : 'View Full Gallery'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Pills on Home */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'ALL', labelHi: 'सभी तस्वीरें', labelEn: 'All Photos' },
            { key: 'Stage', labelHi: 'मंच प्रस्तुतियां', labelEn: 'Stage Concerts' },
            { key: 'Devotional', labelHi: 'धार्मिक अनुष्ठान', labelEn: 'Devotional' },
            { key: 'Portraits', labelHi: 'पोर्ट्रेट्स', labelEn: 'Portraits' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setGalleryCategory(cat.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                galleryCategory === cat.key
                  ? 'bg-gold text-navy shadow-md font-bold'
                  : 'bg-navy-light text-gray-300 hover:text-gold border border-gold/20'
              }`}
            >
              {lang === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredHighlights.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-gold/30 shadow-lg group cursor-pointer bg-navy-dark"
            >
              <img
                src={img.imageUrl}
                alt={img.altText || img.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/munna_nirala_stage.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 p-3.5 flex flex-col justify-end">
                <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                  {lang === 'hi' && img.categoryHi ? img.categoryHi : img.category}
                </span>
                <p className="text-xs sm:text-sm font-serif font-bold text-ivory truncate">
                  {lang === 'hi' && img.titleHi ? img.titleHi : img.title}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-gold-light">
                  <ZoomIn className="w-3 h-3" />
                  <span>{lang === 'hi' ? 'बड़ा देखें' : 'View Full'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: UPCOMING EVENTS & SCHEDULE
      ========================================================================== */}
      {upcomingEvents.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-gold text-xs sm:text-sm uppercase tracking-widest font-semibold">
                {t('section.upcomingEvents')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
                {lang === 'hi' ? 'आगामी धार्मिक व संगीत कार्यक्रम' : 'Upcoming Spiritual & Musical Shows'}
              </h2>
            </div>

            <Link
              href="/events"
              className="text-xs sm:text-sm text-gold hover:text-gold-light font-semibold flex items-center gap-1.5 transition"
            >
              <span>{lang === 'hi' ? 'पूरा कैलेंडर देखें' : 'View Full Schedule'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => {
              const eventDateObj = new Date(event.eventDate);
              const formattedDate = eventDateObj.toLocaleDateString(
                lang === 'hi' ? 'hi-IN' : 'en-US',
                { day: 'numeric', month: 'short', year: 'numeric' }
              );

              return (
                <div
                  key={event.id}
                  className="bg-[#192033] rounded-2xl border border-gold/30 p-5 shadow-lg flex flex-col sm:flex-row gap-4 items-center"
                >
                  <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden border border-gold/30 flex-shrink-0">
                    <img
                      src={event.posterImage || '/images/munna_nirala_bhajan.jpg'}
                      alt={event.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/munna_nirala_bhajan.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
                    <span className="text-[11px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 inline-block">
                      {formattedDate}
                    </span>
                    <h3 className="text-base font-serif font-bold text-ivory truncate">
                      {lang === 'hi' && event.titleHi ? event.titleHi : event.title}
                    </h3>
                    <p className="text-xs text-gray-300 flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      <span className="truncate">
                        {lang === 'hi' && event.venueHi ? event.venueHi : event.venue},{' '}
                        {lang === 'hi' && event.cityHi ? event.cityHi : event.city}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      <span>{event.time}</span>
                    </p>
                  </div>

                  <Link
                    href="/contact"
                    className="px-4 py-2 rounded-lg bg-[#6F1D35] hover:bg-[#872441] text-ivory font-semibold text-xs border border-gold/40 shadow transition flex-shrink-0"
                  >
                    {t('btn.bookNow')}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 9: SUCCESSFUL PROGRAM LOCATIONS (देशभर में सफल कार्यक्रम)
      ========================================================================== */}
      {programLocations && programLocations.length > 0 && (
        <SuccessfulLocations locations={programLocations} />
      )}

      {/* =========================================================================
          SECTION 10: CLIENT / ORGANIZER TESTIMONIALS & REVIEWS (सच्चे रिव्यूज)
      ========================================================================== */}
      {testimonials && testimonials.length > 0 && (
        <ClientTestimonials testimonials={testimonials} />
      )}

      {/* =========================================================================
          SECTION 11: ACHIEVEMENTS & PRESS
      ========================================================================== */}
      {(awards.length > 0 || pressItems.length > 0) && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-gold text-xs sm:text-sm uppercase tracking-widest font-semibold">
              {lang === 'hi' ? 'सम्मान एवं मीडिया कवरेज' : 'Recognition & Press'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-ivory">
              {t('section.achievements')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {awards.map((award) => (
              <div
                key={award.id}
                className="bg-[#192033] rounded-2xl border border-gold/30 p-6 shadow-xl flex flex-col items-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/40 text-gold flex items-center justify-center">
                  <Award className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-gold">{award.year}</span>
                <h3 className="text-base font-serif font-bold text-ivory">
                  {lang === 'hi' && award.titleHi ? award.titleHi : award.title}
                </h3>
                <p className="text-xs text-gray-400">
                  {lang === 'hi' && award.organizationHi ? award.organizationHi : award.organization}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 12: BOOKING CALL TO ACTION
      ========================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#6F1D35] via-[#151B2B] to-[#151B2B] border-2 border-gold/50 p-8 sm:p-14 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 text-gold text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{t('cta.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black text-ivory max-w-2xl mx-auto leading-tight">
            {lang === 'hi'
              ? 'अपने मांगलिक एवं धार्मिक आयोजन को बनाएं पावन व अविस्मरणीय'
              : 'Invite Singer Munna Kumar Nirala to Your Sacred Event'}
          </h2>

          <p className="text-sm sm:text-base text-ivory/80 max-w-xl mx-auto font-light">
            {lang === 'hi'
              ? 'सुंदरकांड पाठ, भव्य माता की चौकी, श्री खाटू श्याम संकीर्तन एवं विशेष मंच प्रस्तुतियों के लिए आज ही संपर्क करें।'
              : 'Book now for Sundarkand Path, Mata Ki Chowki, Khatu Shyam Sandhya, and Grand Stage Bhajans.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-sm sm:text-base shadow-xl transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              <span>{t('nav.bookBtn')}</span>
            </Link>

            <a
              href={`https://wa.me/91${settings?.whatsappNumber || '9990739614'}?text=${encodeURIComponent(
                'जय श्री राम! मैं गायक मुन्ना कुमार निराला जी के कार्यक्रम के संबंध में चर्चा करना चाहता हूँ।'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-xl transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>सीधा व्हाट्सएप करें</span>
            </a>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.url || ''}
        title={activeVideo?.title}
      />

      {/* Lightbox Modal */}
      <GalleryLightbox
        isOpen={lightboxOpen}
        images={filteredHighlights}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredHighlights.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < filteredHighlights.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
}
