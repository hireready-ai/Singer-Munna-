'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { MapPin, CheckCircle2, Calendar, Sparkles, ArrowRight } from 'lucide-react';

interface LocationItem {
  id: string;
  city: string;
  cityHi: string;
  state: string;
  stateHi?: string | null;
  programCount: number;
  highlightText?: string | null;
  highlightHi?: string | null;
  image?: string | null;
}

interface SuccessfulLocationsProps {
  locations: LocationItem[];
}

export function SuccessfulLocations({ locations }: SuccessfulLocationsProps) {
  const { lang } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {lang === 'hi'
              ? 'अखिल भारतीय प्रस्तुति सेवा'
              : 'Pan-India Devotional Presence'}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif font-black text-ivory tracking-tight">
          {lang === 'hi'
            ? 'देशभर के प्रमुख तीर्थों व नगरों में 1000+ सफल कार्यक्रम'
            : '1000+ Successful Programs Across India & Abroad'}
        </h2>

        <p className="text-xs sm:text-sm text-ivory/70 max-w-2xl mx-auto">
          {lang === 'hi'
            ? 'दिल्ली एनसीआर, बिहार, उत्तर प्रदेश, राजस्थान, महाराष्ट्र सहित सम्पूर्ण भारत के विभिन्न राज्यों में भव्य भक्ति व संगीत आयोजनों का गौरवशाली अनुभव।'
            : 'A divine track record of successful spiritual concerts, Jagrans, and musical festivals across Delhi NCR, Bihar, UP, Rajasthan, Maharashtra, and worldwide.'}
        </p>
      </div>

      {/* Grid of Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {locations.map((loc) => {
          const city = lang === 'hi' && loc.cityHi ? loc.cityHi : loc.city;
          const state = lang === 'hi' && loc.stateHi ? loc.stateHi : loc.state;
          const highlight = lang === 'hi' && loc.highlightHi ? loc.highlightHi : loc.highlightText;

          return (
            <div
              key={loc.id}
              className="bg-gradient-to-b from-[#192033] to-[#121624] rounded-2xl border border-gold/30 hover:border-gold p-5 shadow-xl flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/40 text-gold flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{loc.programCount}+ {lang === 'hi' ? 'कार्यक्रम' : 'Shows'}</span>
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-ivory group-hover:text-gold transition">
                  {city}
                </h3>
                <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                  {state}
                </span>

                {highlight && (
                  <p className="text-xs text-ivory/80 mt-2.5 line-clamp-2 leading-relaxed font-light">
                    {highlight}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-navy-light flex items-center justify-between">
                <Link
                  href={`/contact?city=${encodeURIComponent(loc.city)}`}
                  className="text-xs text-gold hover:text-gold-light font-semibold flex items-center gap-1 transition"
                >
                  <span>{lang === 'hi' ? 'यहाँ बुक करें' : 'Book in this city'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </Link>

                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                  Verified
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

