'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Calendar } from 'lucide-react';

interface EventTypeItem {
  id: string;
  title: string;
  titleHi: string;
  subtitle?: string | null;
  subtitleHi?: string | null;
  iconImage: string;
}

interface PopularEventTypesProps {
  eventTypes: EventTypeItem[];
}

export function PopularEventTypes({ eventTypes }: PopularEventTypesProps) {
  const { lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -320 : 320;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header matching the reference style */}
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-gold/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-gold inline-block" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-ivory tracking-tight">
              {lang === 'hi' ? 'प्रमुख भक्ति व मांगलिक कार्यक्रम' : 'Popular Event Types'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 pl-3.5">
            {lang === 'hi'
              ? 'माता की चौकी, सुंदरकांड पाठ, भजन संध्या एवं संपूर्ण धार्मिक अनुष्ठान'
              : 'Sacred Chowki, Sundarkand Path, Bhajan Sandhya & Devotional Gatherings'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/events"
            className="text-xs sm:text-sm text-gold hover:text-gold-light font-semibold flex items-center gap-1 transition group"
          >
            <span>{lang === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>

          {/* Carousel Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-8 h-8 rounded-full border border-gold/40 text-gold flex items-center justify-center hover:bg-gold hover:text-navy transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-8 h-8 rounded-full border border-gold/40 text-gold flex items-center justify-center hover:bg-gold hover:text-navy transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track (Right-to-Left Scrollable) */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {eventTypes.map((item) => {
          const title = lang === 'hi' && item.titleHi ? item.titleHi : item.title;
          const subtitle = lang === 'hi' && item.subtitleHi ? item.subtitleHi : item.subtitle;

          return (
            <Link
              key={item.id}
              href={`/contact?eventType=${encodeURIComponent(item.title)}`}
              className="flex-shrink-0 w-36 sm:w-44 bg-gradient-to-b from-[#1C2438] to-[#151B2B] rounded-2xl border border-gold/30 hover:border-gold p-4 sm:p-5 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:shadow-gold/10 transition-all duration-300 transform hover:-translate-y-1.5 group cursor-pointer"
            >
              {/* Devotional Icon / Illustration */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex items-center justify-center mb-3 group-hover:scale-108 transition duration-300">
                <img
                  src={item.iconImage || '/icons/events/jagran.svg'}
                  alt={title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/icons/events/jagran.svg';
                  }}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>

              {/* Title & Category */}
              <h3 className="text-xs sm:text-sm font-serif font-bold text-ivory group-hover:text-gold transition line-clamp-1">
                {title}
              </h3>

              {subtitle && (
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 font-sans">
                  {subtitle}
                </p>
              )}

              {/* Booking CTA Pill */}
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition duration-200">
                <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[9px] font-bold border border-gold/40 flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>बुक करें</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

