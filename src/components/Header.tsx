'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { Menu, X, Calendar, Sparkles } from 'lucide-react';

interface HeaderProps {
  artistName?: string;
  artistNameHi?: string;
  phone?: string;
}

export function Header({
  artistName = 'Singer Munna Kumar Nirala',
  artistNameHi = 'गायक मुन्ना कुमार निराला',
  phone = '9990739614',
}: HeaderProps) {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Main Navigation Tabs (Gallery and Contact removed from tabs as per instruction)
  const navTabs = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.music'), href: '/music' },
    { label: t('nav.videos'), href: '/videos' },
    { label: t('nav.events'), href: '/events' },
  ];

  const displayName = lang === 'hi' ? artistNameHi : artistName;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#151B2B]/95 backdrop-blur-md shadow-xl border-b border-[#C7A45A]/30 py-2.5'
          : 'bg-[#151B2B] border-b border-[#222633] py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Artist Name */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6F1D35] to-[#C7A45A] flex items-center justify-center text-ivory font-serif font-bold text-lg shadow-md group-hover:scale-105 transition border border-gold/40">
            M
          </div>
          <div>
            <span className="block text-base sm:text-lg font-serif font-bold tracking-wide text-ivory group-hover:text-gold transition">
              {displayName}
            </span>
            <span className="block text-[10px] tracking-widest uppercase text-gold/90 font-medium">
              {lang === 'hi' ? 'आधिकारिक कलाकार पोर्टल' : 'Official Artist Website'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5">
          {navTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-gold bg-gold/15 border border-gold/40 font-semibold shadow-sm'
                    : 'text-ivory/85 hover:text-gold hover:bg-navy-light/60'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons: "Book for an Event" first, then Language switch to its right */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Primary Action Button: Book for an Event */}
          <Link
            href="/contact"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6F1D35] hover:bg-[#872441] text-ivory text-xs sm:text-sm font-semibold tracking-wide border border-[#C7A45A]/50 shadow-lg hover:shadow-gold/20 transition transform hover:-translate-y-0.5"
          >
            <Calendar className="w-4 h-4 text-gold-light" />
            <span>{t('nav.bookBtn')}</span>
          </Link>

          {/* Language Switcher strictly placed to the RIGHT of Book for an Event */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gold/50 bg-navy-light/70 text-gold hover:bg-gold hover:text-navy transition shadow"
            title="भाषा बदलें / Switch Language"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-light" />
            <span>{lang === 'hi' ? 'English' : 'हिन्दी'}</span>
          </button>
        </div>

        {/* Mobile Menu & Language Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Book button on mobile header */}
          <Link
            href="/contact"
            className="px-2.5 py-1 rounded-lg bg-[#6F1D35] text-ivory text-xs font-semibold border border-gold/40"
          >
            <span>बुक करें</span>
          </Link>

          <button
            onClick={toggleLang}
            className="px-2 py-1 text-xs rounded border border-gold/40 text-gold"
          >
            {lang === 'hi' ? 'EN' : 'हिन्दी'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-ivory hover:text-gold hover:bg-navy-light focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-gold" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-[#151B2B] border-b border-gold/30 shadow-2xl p-5 transition-all z-50">
          <nav className="flex flex-col gap-2">
            {navTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-base font-medium flex items-center justify-between ${
                    isActive
                      ? 'bg-gold/15 text-gold border-l-4 border-gold font-semibold'
                      : 'text-ivory hover:text-gold hover:bg-navy-light'
                  }`}
                >
                  <span>{tab.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-navy-light flex flex-col gap-3">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-lg bg-[#6F1D35] text-ivory font-bold text-center border border-gold/40 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-gold" />
                <span>{t('nav.bookBtn')}</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
