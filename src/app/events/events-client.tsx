'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { AvailabilityCalendar, CalendarSlot } from '@/components/AvailabilityCalendar';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  CalendarCheck,
  CheckCircle,
} from 'lucide-react';

interface EventsClientProps {
  upcomingEvents: any[];
  pastEvents: any[];
  schedules: any[];
}

export function EventsClient({ upcomingEvents, pastEvents, schedules }: EventsClientProps) {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [tab, setTab] = useState<'UPCOMING' | 'CALENDAR' | 'PAST'>('UPCOMING');

  const handleSelectDate = (dateStr: string) => {
    router.push(`/contact?date=${dateStr}`);
  };

  return (
    <div className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-ivory">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'कार्यक्रम अनुसूची एवं तिथि' : 'Official Performance Calendar'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-ivory">
          {lang === 'hi' ? 'कार्यक्रम एवं उपलब्धता' : 'Events & Availability'}
        </h1>
        <p className="text-xs sm:text-sm text-ivory/70 max-w-xl mx-auto">
          {lang === 'hi'
            ? 'आगामी धार्मिक आयोजनों का विवरण देखें अथवा अपनी पसंदीदा तिथि की उपलब्धता जाँचकर बुकिंग करें।'
            : 'Explore scheduled shows and check calendar availability for booking Singer Munna Kumar Nirala.'}
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setTab('UPCOMING')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition flex items-center gap-2 ${
            tab === 'UPCOMING'
              ? 'bg-gold text-navy shadow-lg'
              : 'bg-navy-card text-ivory/80 hover:text-gold border border-gold/30'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{lang === 'hi' ? 'आगामी कार्यक्रम' : 'Upcoming Events'} ({upcomingEvents.length})</span>
        </button>

        <button
          onClick={() => setTab('CALENDAR')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition flex items-center gap-2 ${
            tab === 'CALENDAR'
              ? 'bg-gold text-navy shadow-lg'
              : 'bg-navy-card text-ivory/80 hover:text-gold border border-gold/30'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>{lang === 'hi' ? 'उपलब्धता कैलेंडर (Free/Booked)' : 'Availability Calendar'}</span>
        </button>

        <button
          onClick={() => setTab('PAST')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition flex items-center gap-2 ${
            tab === 'PAST'
              ? 'bg-gold text-navy shadow-lg'
              : 'bg-navy-card text-ivory/80 hover:text-gold border border-gold/30'
          }`}
        >
          <span>{lang === 'hi' ? 'पूर्व कार्यक्रम' : 'Past Highlights'} ({pastEvents.length})</span>
        </button>
      </div>

      {/* Tab 1: Upcoming Events */}
      {tab === 'UPCOMING' && (
        <div className="space-y-6 animate-fadeIn">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16 bg-navy-card rounded-2xl border border-gold/20 p-8 space-y-3">
              <Calendar className="w-12 h-12 text-gold/40 mx-auto" />
              <p className="text-base font-serif text-ivory">
                {lang === 'hi'
                  ? 'वर्तमान में कोई नया सार्वजनिक कार्यक्रम निर्धारित नहीं है।'
                  : 'No upcoming public events scheduled currently.'}
              </p>
              <Link
                href="/contact"
                className="inline-block mt-2 px-6 py-2.5 rounded-lg bg-gold text-navy font-bold text-xs"
              >
                {t('nav.bookBtn')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => {
                const dateObj = new Date(event.eventDate);
                const dateStr = dateObj.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                const title = lang === 'hi' && event.titleHi ? event.titleHi : event.title;
                const venue = lang === 'hi' && event.venueHi ? event.venueHi : event.venue;
                const city = lang === 'hi' && event.cityHi ? event.cityHi : event.city;
                const desc = lang === 'hi' && event.descriptionHi ? event.descriptionHi : event.description;

                return (
                  <div
                    key={event.id}
                    className="bg-[#192033] rounded-2xl border border-gold/40 overflow-hidden shadow-xl flex flex-col justify-between"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold border border-gold/30">
                          {dateStr}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          {lang === 'hi' ? 'आगामी' : 'Upcoming'}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-serif font-bold text-ivory">
                        {title}
                      </h3>

                      <div className="space-y-1.5 text-xs text-ivory/80">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                          <span>{venue}, {city}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                          <span>{event.time}</span>
                        </p>
                      </div>

                      {desc && (
                        <p className="text-xs text-ivory/70 leading-relaxed pt-1">
                          {desc}
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-navy-dark border-t border-navy-light flex items-center justify-between">
                      <span className="text-xs text-gold font-semibold">
                        {city}
                      </span>
                      <Link
                        href={`/contact?eventType=${encodeURIComponent(title)}`}
                        className="px-4 py-2 rounded-lg bg-[#6F1D35] hover:bg-[#872441] text-ivory font-bold text-xs border border-gold/40 shadow transition"
                      >
                        {t('btn.bookNow')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Availability Calendar */}
      {tab === 'CALENDAR' && (
        <div className="space-y-6 animate-fadeIn">
          <AvailabilityCalendar
            initialSchedules={schedules}
            onSelectDate={handleSelectDate}
          />
        </div>
      )}

      {/* Tab 3: Past Events */}
      {tab === 'PAST' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map((event) => {
              const dateObj = new Date(event.eventDate);
              const dateStr = dateObj.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              const title = lang === 'hi' && event.titleHi ? event.titleHi : event.title;
              const venue = lang === 'hi' && event.venueHi ? event.venueHi : event.venue;
              const city = lang === 'hi' && event.cityHi ? event.cityHi : event.city;

              return (
                <div
                  key={event.id}
                  className="bg-[#192033]/70 rounded-2xl border border-navy-light p-6 shadow-md space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{dateStr}</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {lang === 'hi' ? 'सफलतापूर्वक संपन्न' : 'Completed'}
                    </span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-ivory">
                    {title}
                  </h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>{venue}, {city}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

