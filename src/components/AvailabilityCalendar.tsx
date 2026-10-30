'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { ChevronLeft, ChevronRight, CalendarCheck, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export interface CalendarSlot {
  id: string;
  dateString: string; // "YYYY-MM-DD"
  status: 'BOOKED' | 'AVAILABLE' | 'TENTATIVE';
  programTitle?: string | null;
  city?: string | null;
  note?: string | null;
}

interface CalendarProps {
  initialSchedules?: CalendarSlot[];
  onSelectDate?: (dateStr: string) => void;
}

export function AvailabilityCalendar({ initialSchedules = [], onSelectDate }: CalendarProps) {
  const { lang, t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Default to Nov 2026 or current
  const [schedules, setSchedules] = useState<CalendarSlot[]>(initialSchedules);
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot | null>(null);

  useEffect(() => {
    fetch('/api/calendar')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSchedules(data);
      })
      .catch(() => {});
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNamesHi = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  const monthName = lang === 'hi' ? monthNamesHi[month] : monthNamesEn[month];

  // Days in month calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
  const dayNames = lang === 'hi' ? dayNamesHi : dayNamesEn;

  // Render calendar grid
  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(<div key={`empty-${i}`} className="h-14 sm:h-20 bg-navy-dark/40 rounded-md opacity-30" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const slot = schedules.find((s) => s.dateString === dateStr);

    let statusBg = 'bg-navy-light/40 border-navy-light hover:border-gold/50';
    let statusBadge = null;

    if (slot?.status === 'BOOKED') {
      statusBg = 'bg-red-950/40 border-red-500/50 hover:border-red-400';
      statusBadge = (
        <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded bg-red-600/80 text-white truncate max-w-full block">
          🔴 {lang === 'hi' ? 'बुक' : 'Booked'}
        </span>
      );
    } else if (slot?.status === 'AVAILABLE') {
      statusBg = 'bg-green-950/40 border-green-500/50 hover:border-green-400 cursor-pointer';
      statusBadge = (
        <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-600/80 text-white truncate max-w-full block">
          🟢 {lang === 'hi' ? 'खाली' : 'Free'}
        </span>
      );
    } else if (slot?.status === 'TENTATIVE') {
      statusBg = 'bg-amber-950/40 border-amber-500/50 hover:border-amber-400';
      statusBadge = (
        <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-600/80 text-white truncate max-w-full block">
          🟡 {lang === 'hi' ? 'प्रक्रियाधीन' : 'Pending'}
        </span>
      );
    }

    days.push(
      <div
        key={dateStr}
        onClick={() => {
          setSelectedSlot(slot || { id: '', dateString: dateStr, status: 'AVAILABLE' });
          if (onSelectDate) onSelectDate(dateStr);
        }}
        className={`h-14 sm:h-20 p-1.5 rounded-lg border transition-all flex flex-col justify-between ${statusBg}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-ivory">{d}</span>
          {slot?.city && (
            <span className="hidden sm:inline text-[10px] text-gold truncate">
              {slot.city}
            </span>
          )}
        </div>
        <div className="mt-auto">{statusBadge}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-4 sm:p-6 shadow-2xl text-ivory">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gold/20">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-ivory flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-gold" />
            <span>{t('section.availabilityCalendar')}</span>
          </h3>
          <p className="text-xs sm:text-sm text-ivory/70 mt-1">
            {lang === 'hi'
              ? 'देखें कब कार्यक्रम निर्धारित हैं और कौन सी तिथियां बुकिंग हेतु उपलब्ध हैं'
              : 'Check scheduled dates and available slots for booking'}
          </p>
        </div>

        {/* Month selector */}
        <div className="flex items-center gap-3 bg-navy-light px-3 py-1.5 rounded-xl border border-gold/30 shadow-inner">
          <button
            onClick={prevMonth}
            className="p-1.5 hover:bg-gold hover:text-navy rounded-lg text-ivory transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm sm:text-base font-serif font-semibold text-gold min-w-[120px] text-center">
            {monthName} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-gold hover:text-navy rounded-lg text-ivory transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 py-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-ivory/90">{lang === 'hi' ? 'खाली / बुकिंग हेतु उपलब्ध (Free)' : 'Available for Booking'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
          <span className="text-ivory/90">{lang === 'hi' ? 'कार्यक्रम निर्धारित / बुक (Booked)' : 'Booked Program'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
          <span className="text-ivory/90">{lang === 'hi' ? 'पुष्टि प्रक्रिया में (Hold/Pending)' : 'Tentative'}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-4 text-center">
        {dayNames.map((d, idx) => (
          <div key={idx} className="text-xs font-semibold uppercase text-gold py-1">
            {d}
          </div>
        ))}
        {days}
      </div>

      {/* Selected Slot Information Card */}
      {selectedSlot && (
        <div className="mt-4 p-4 rounded-xl bg-navy-card border border-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-gold font-semibold">
                {lang === 'hi' ? 'चयनित तिथि' : 'Selected Date'}: {selectedSlot.dateString}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold ${
                  selectedSlot.status === 'BOOKED'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : selectedSlot.status === 'AVAILABLE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {selectedSlot.status === 'BOOKED'
                  ? lang === 'hi' ? 'कार्यक्रम निर्धारित (Booked)' : 'Booked'
                  : selectedSlot.status === 'AVAILABLE'
                  ? lang === 'hi' ? 'उपलब्ध (Available)' : 'Available'
                  : lang === 'hi' ? 'प्रक्रियाधीन (Tentative)' : 'Tentative'}
              </span>
            </div>
            {selectedSlot.programTitle && (
              <p className="text-sm font-semibold text-ivory mt-1">
                {selectedSlot.programTitle}
              </p>
            )}
            {selectedSlot.city && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                {selectedSlot.city}
              </p>
            )}
            {selectedSlot.note && (
              <p className="text-xs text-gray-300 italic mt-0.5">"{selectedSlot.note}"</p>
            )}
          </div>

          {selectedSlot.status === 'AVAILABLE' && onSelectDate && (
            <button
              onClick={() => onSelectDate(selectedSlot.dateString)}
              className="px-4 py-2 bg-gold hover:bg-gold-light text-navy font-bold text-xs sm:text-sm rounded-lg shadow-md transition"
            >
              {lang === 'hi' ? 'इस तिथि हेतु अनुरोध भरें' : 'Book This Date'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

