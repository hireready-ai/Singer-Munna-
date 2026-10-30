'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import {
  Star,
  Quote,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  HeartHandshake,
  Award,
} from 'lucide-react';

interface TestimonialItem {
  id: string;
  clientName: string;
  clientNameHi?: string | null;
  designation?: string | null;
  designationHi?: string | null;
  city?: string | null;
  cityHi?: string | null;
  eventType: string;
  eventTypeHi?: string | null;
  rating: number;
  reviewText: string;
  reviewTextHi: string;
  avatarUrl?: string | null;
  verified: boolean;
}

interface ClientTestimonialsProps {
  testimonials: TestimonialItem[];
}

export function ClientTestimonials({ testimonials }: ClientTestimonialsProps) {
  const { lang } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Devotional Trust Banner matching User Inspiration Image 2 */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#6F1D35]/95 via-[#1E1724] to-[#151B2B] border-2 border-gold/40 p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs uppercase tracking-widest text-gold font-bold flex items-center justify-center lg:justify-start gap-1.5">
              <span>॥ भक्ति से ही शक्ति है ॥</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-ivory">
              {lang === 'hi'
                ? 'अपने पावन धार्मिक आयोजन के लिए सर्वश्रेष्ठ गायक चुनें'
                : 'Book the Best Devotional Artist for Your Sacred Event'}
            </h3>
            <p className="text-xs sm:text-sm text-ivory/80 max-w-xl font-light">
              {lang === 'hi'
                ? 'सुप्रसिद्ध भजन गायक मुन्ना कुमार निराला एवं उनकी संपूर्ण संगीत मंडली के साथ भक्ति व साधना का दिव्य अनुभव।'
                : 'Experience divine soulfulness with renowned Bhajan vocalist Singer Munna Kumar Nirala and full professional musical troop.'}
            </p>
          </div>

          {/* 4 Pillars of Trust */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="bg-navy/70 backdrop-blur-sm p-3 rounded-xl border border-gold/30 text-center">
              <ShieldCheck className="w-5 h-5 text-gold mx-auto mb-1" />
              <span className="text-[11px] font-bold text-ivory block">सत्यापित कलाकार</span>
              <span className="text-[9px] text-gray-300">Verified Artist</span>
            </div>
            <div className="bg-navy/70 backdrop-blur-sm p-3 rounded-xl border border-gold/30 text-center">
              <HeartHandshake className="w-5 h-5 text-gold mx-auto mb-1" />
              <span className="text-[11px] font-bold text-ivory block">सुरक्षित बुकिंग</span>
              <span className="text-[9px] text-gray-300">Secure Booking</span>
            </div>
            <div className="bg-navy/70 backdrop-blur-sm p-3 rounded-xl border border-gold/30 text-center">
              <Sparkles className="w-5 h-5 text-gold mx-auto mb-1" />
              <span className="text-[11px] font-bold text-ivory block">100% भक्तिमय</span>
              <span className="text-[9px] text-gray-300">Pure Devotion</span>
            </div>
            <div className="bg-navy/70 backdrop-blur-sm p-3 rounded-xl border border-gold/30 text-center">
              <Award className="w-5 h-5 text-gold mx-auto mb-1" />
              <span className="text-[11px] font-bold text-ivory block">15+ वर्ष साधना</span>
              <span className="text-[9px] text-gray-300">Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {lang === 'hi' ? 'भक्तों एवं आयोजकों के अनुभव' : 'Organizer Reviews & Feedback'}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif font-black text-ivory tracking-tight">
          {lang === 'hi'
            ? 'श्रोताओं व मंदिर समितियों की सच्ची प्रतिक्रियाएं'
            : 'Heartfelt Testimonials from Devotees & Organizers'}
        </h2>

        <p className="text-xs sm:text-sm text-ivory/70 max-w-2xl mx-auto">
          {lang === 'hi'
            ? 'विशाल माता की चौकी, सुंदरकांड पाठ, व श्याम संकीर्तन करवाने वाले आयोजकों द्वारा दिए गए 5-स्टार अनुभव।'
            : 'Real feedback and 5-star ratings from temple committees, samitis, and spiritual patrons across India.'}
        </p>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => {
          const clientName = lang === 'hi' && item.clientNameHi ? item.clientNameHi : item.clientName;
          const designation = lang === 'hi' && item.designationHi ? item.designationHi : item.designation;
          const eventType = lang === 'hi' && item.eventTypeHi ? item.eventTypeHi : item.eventType;
          const review = lang === 'hi' && item.reviewTextHi ? item.reviewTextHi : item.reviewText;
          const city = lang === 'hi' && item.cityHi ? item.cityHi : item.city;

          return (
            <div
              key={item.id}
              className="bg-gradient-to-b from-[#1A2236] to-[#141A29] rounded-2xl border border-gold/30 hover:border-gold p-6 shadow-xl flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div>
                {/* Top Row: Stars & Quote Icon */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-gold">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <Quote className="w-8 h-8 text-gold/25 group-hover:text-gold/50 transition" />
                </div>

                {/* Event Type Badge */}
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider mb-3 border border-gold/30">
                  {eventType}
                </span>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-ivory/90 leading-relaxed font-light italic">
                  "{review}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 mt-5 border-t border-navy-light flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-ivory truncate group-hover:text-gold transition">
                    {clientName}
                  </h4>
                  {designation && (
                    <p className="text-[11px] text-gray-400 truncate">
                      {designation}
                    </p>
                  )}
                  {city && (
                    <p className="text-[10px] text-gold-light truncate font-mono">
                      📍 {city}
                    </p>
                  )}
                </div>

                {item.verified && (
                  <span className="flex-shrink-0 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>सत्यापित</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

