'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { BookingForm } from '@/components/BookingForm';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Sparkles,
  CalendarCheck,
  CheckCircle,
} from 'lucide-react';

interface ContactClientProps {
  settings: any;
  schedules: any[];
  prefillDate?: string;
}

export function ContactClient({ settings, schedules, prefillDate }: ContactClientProps) {
  const { lang, t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string>(prefillDate || '');

  const phone = settings?.primaryPhone || '9990739614';
  const whatsapp1 = settings?.whatsappNumber || '9990739614';
  const whatsapp2 = settings?.secondaryWhatsapp || '7484004540';
  const email = settings?.email || 'singermunnakumarnirala@gmail.com';
  const address =
    lang === 'hi'
      ? settings?.addressHi || 'दिल्ली एनसीआर एवं बिहार, भारत (संपूर्ण भारत एवं विदेशों में सेवा उपलब्ध)'
      : settings?.address || 'Delhi NCR & Bihar, India (Available Across India & Worldwide)';

  return (
    <div className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-ivory">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'संपर्क एवं कार्यक्रम बुकिंग' : 'Official Booking & Contact Desk'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-ivory">
          {lang === 'hi' ? 'कार्यक्रम बुकिंग एवं संपर्क सूत्र' : 'Book Singer Munna Kumar Nirala'}
        </h1>
        <p className="text-xs sm:text-sm text-ivory/70 max-w-xl mx-auto">
          {lang === 'hi'
            ? 'धार्मिक अनुष्ठान, माता का जागरण, सुंदरकांड पाठ व मांगलिक उत्सवों के सफल आयोजन हेतु संपर्क करें।'
            : 'Enquire for auspicious programs, Sundarkand, Mata Jagran, Khatu Shyam Sandhya, and cultural musical nights.'}
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mobile Call */}
        <a
          href={`tel:${phone}`}
          className="bg-[#192033] rounded-2xl border border-gold/30 p-5 shadow-lg hover:border-gold transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-gold font-semibold block">
              {lang === 'hi' ? 'सीधे कॉल करें' : 'Phone Call'}
            </span>
            <span className="text-sm font-bold text-ivory">{phone}</span>
          </div>
        </a>

        {/* WhatsApp 1 */}
        <a
          href={`https://wa.me/91${whatsapp1}?text=${encodeURIComponent(
            'जय श्री राम! मैं गायक मुन्ना कुमार निराला जी के कार्यक्रम बुकिंग के संबंध में जानकारी चाहता हूँ।'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#192033] rounded-2xl border border-gold/30 p-5 shadow-lg hover:border-emerald-400 transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
              WhatsApp 1
            </span>
            <span className="text-sm font-bold text-ivory">{whatsapp1}</span>
          </div>
        </a>

        {/* WhatsApp 2 */}
        {whatsapp2 && (
          <a
            href={`https://wa.me/91${whatsapp2}?text=${encodeURIComponent(
              'जय श्री राम! मैं गायक मुन्ना कुमार निराला जी के कार्यक्रम बुकिंग के संबंध में जानकारी चाहता हूँ।'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#192033] rounded-2xl border border-gold/30 p-5 shadow-lg hover:border-emerald-400 transition flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
                WhatsApp 2 (Alt)
              </span>
              <span className="text-sm font-bold text-ivory">{whatsapp2}</span>
            </div>
          </a>
        )}

        {/* Email */}
        <a
          href={`mailto:${email}`}
          className="bg-[#192033] rounded-2xl border border-gold/30 p-5 shadow-lg hover:border-gold transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
            <Mail className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] uppercase tracking-wider text-gold font-semibold block">
              Email
            </span>
            <span className="text-xs sm:text-sm font-bold text-ivory truncate block">
              {email}
            </span>
          </div>
        </a>
      </div>

      {/* Main Booking Section: Calendar + Booking Form */}
      <div className="space-y-8">
        {/* Availability Calendar */}
        <div className="space-y-4">
          <AvailabilityCalendar
            initialSchedules={schedules}
            onSelectDate={(dateStr) => {
              setSelectedDate(dateStr);
              // scroll to form
              document.getElementById('booking-form-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Booking Form Section */}
        <div id="booking-form-section">
          <BookingForm
            initialDate={selectedDate}
            whatsappNumber={whatsapp1}
            primaryPhone={phone}
          />
        </div>
      </div>

      {/* Location / Service Coverage Banner */}
      <div className="bg-[#192033] rounded-2xl border border-gold/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-serif font-bold text-ivory">
              {lang === 'hi' ? 'सेवा क्षेत्र एवं उपस्थिति' : 'Service Coverage & Availability'}
            </h4>
            <p className="text-xs sm:text-sm text-ivory/80 mt-0.5">{address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'hi' ? 'संगीतमय कार्यक्रम बुकिंग चालू है' : 'Bookings Open for 2025-2026'}</span>
        </div>
      </div>
    </div>
  );
}

