'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import {
  Sparkles,
  Award,
  Music,
  Calendar,
  BookOpen,
  CheckCircle,
  FileDown,
  ArrowRight,
} from 'lucide-react';

interface AboutClientProps {
  settings: any;
  bio: any;
  awards: any[];
  press: any[];
}

export function AboutClient({ settings, bio, awards, press }: AboutClientProps) {
  const { lang, t } = useLanguage();

  const artistName =
    lang === 'hi'
      ? settings?.artistNameHi || 'गायक मुन्ना कुमार निराला'
      : settings?.artistName || 'Singer Munna Kumar Nirala';

  const intro = lang === 'hi' ? bio?.introductionHi : bio?.introduction;
  const fullBio = lang === 'hi' ? bio?.fullBioHi : bio?.fullBio;
  const musicalJourney = lang === 'hi' ? bio?.musicalJourneyHi : bio?.musicalJourney;
  const styles = lang === 'hi' ? bio?.musicalStylesHi : bio?.musicalStyles;

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-ivory">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'जीवन यात्रा एवं साधना' : 'Life Journey & Devotion'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-ivory">
          {lang === 'hi' ? 'विस्तृत जीवन परिचय' : 'Artist Biography'}
        </h1>
        <p className="text-gold text-sm sm:text-base font-serif max-w-2xl mx-auto">
          {artistName}
        </p>
      </div>

      {/* Hero Intro with Portrait */}
      <div className="bg-[#192033] rounded-3xl border border-gold/40 p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 sm:w-80 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold shadow-2xl">
              <img
                src={bio?.portraitImage || '/images/munna_nirala_portrait.jpg'}
                alt={artistName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gold">
              {lang === 'hi' ? 'सुर और साधना का समर्पित सफर' : 'A Dedicated Life of Melody & Devotion'}
            </h2>
            <p className="text-sm sm:text-base text-ivory/90 leading-relaxed font-light whitespace-pre-line">
              {intro}
            </p>
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-gold font-semibold block mb-1">
                {lang === 'hi' ? 'गायन विधाएं एवं शैलियां' : 'Musical Disciplines'}
              </span>
              <p className="text-xs sm:text-sm text-ivory/80 bg-navy p-3 rounded-xl border border-gold/20">
                {styles}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Biography & Journey Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Full Bio */}
        <div className="bg-[#192033] rounded-2xl border border-gold/30 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-gold">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-xl font-serif font-bold text-ivory">
              {lang === 'hi' ? 'आध्यात्मिक एवं संगीतमय पृष्ठभूमि' : 'Spiritual & Musical Foundation'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed font-light whitespace-pre-line">
            {fullBio}
          </p>
        </div>

        {/* Musical Journey */}
        <div className="bg-[#192033] rounded-2xl border border-gold/30 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-gold">
            <Music className="w-5 h-5" />
            <h3 className="text-xl font-serif font-bold text-ivory">
              {lang === 'hi' ? 'संगीत साधना एवं गुरु परंपरा' : 'The Musical Voyage & Tradition'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed font-light whitespace-pre-line">
            {musicalJourney}
          </p>

          <div className="pt-4 border-t border-navy-light space-y-2">
            <h4 className="text-xs font-bold text-gold uppercase tracking-wider">
              {lang === 'hi' ? 'आयोजनों की मुख्य विशेषताएं' : 'Key Performance Features'}
            </h4>
            <ul className="text-xs sm:text-sm text-ivory/80 space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{lang === 'hi' ? 'उच्च कोटि के अनुभवी वादक एवं लाइव ऑर्केस्ट्रा' : 'Experienced accompanists & live orchestra'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{lang === 'hi' ? 'पारंपरिक एवं शास्त्र सम्मत चौपाई पाठ' : 'Traditional and authentic Chaupai recitation'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                <span>{lang === 'hi' ? 'अलौकिक सजीव झांकियों की मनमोहक प्रस्तुति' : 'Stunning live theatrical Jhanki presentations'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Verified Awards & Accolades */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-gold text-xs uppercase tracking-widest font-semibold">
            {t('section.achievements')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
            {lang === 'hi' ? 'सम्मान एवं उपलब्धियां' : 'Honors & Recognitions'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {awards.map((award) => (
            <div
              key={award.id}
              className="bg-[#192033] rounded-2xl border border-gold/30 p-6 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-gold">{award.year}</span>
              </div>
              <h4 className="text-base font-serif font-bold text-ivory">
                {lang === 'hi' && award.titleHi ? award.titleHi : award.title}
              </h4>
              <p className="text-xs text-gold/80 font-medium">{award.organization}</p>
              <p className="text-xs text-ivory/70 leading-relaxed">
                {lang === 'hi' && award.descriptionHi ? award.descriptionHi : award.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Press Coverage */}
      {press.length > 0 && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-gold text-xs uppercase tracking-widest font-semibold">
              {lang === 'hi' ? 'समाचार पत्रों में' : 'In the Media'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
              {lang === 'hi' ? 'प्रेस एवं मीडिया समीक्षाएं' : 'Press Features & Reviews'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {press.map((item) => (
              <div
                key={item.id}
                className="bg-[#192033] rounded-2xl border border-gold/30 p-6 shadow-lg space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-gold font-semibold">
                  <span>{item.publisher}</span>
                  <span>{item.publishDate}</span>
                </div>
                <h4 className="text-base font-serif font-bold text-ivory">
                  {lang === 'hi' && item.titleHi ? item.titleHi : item.title}
                </h4>
                <p className="text-xs sm:text-sm text-ivory/70 leading-relaxed font-light">
                  {lang === 'hi' && item.summaryHi ? item.summaryHi : item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking CTA Banner */}
      <div className="bg-gradient-to-r from-navy via-[#6F1D35]/50 to-navy rounded-3xl border border-gold/40 p-8 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
          {lang === 'hi'
            ? 'धार्मिक अनुष्ठान एवं मांगलिक कार्यक्रमों हेतु आज ही संपर्क करें'
            : 'Plan Your Devotional & Cultural Program with Munna Kumar Nirala'}
        </h3>
        <p className="text-xs sm:text-sm text-ivory/80 max-w-xl mx-auto">
          {lang === 'hi'
            ? 'श्री सुंदरकांड पाठ, माता का जागरण, खाटू श्याम संध्या व रंगारंग कार्यक्रम'
            : 'Sundarkand Path, Mata Ka Jagran, Khatu Shyam Sandhya & Auspicious Celebrations'}
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-sm shadow-lg transition"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('nav.bookBtn')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

