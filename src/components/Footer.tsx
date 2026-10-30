'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import {
  Phone,
  Mail,
  MapPin,
  Youtube,
  Instagram,
  Facebook,
  Music2,
  Lock,
  MessageCircle,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface FooterProps {
  settings?: {
    artistName?: string;
    artistNameHi?: string;
    tagline?: string;
    taglineHi?: string;
    primaryPhone?: string;
    whatsappNumber?: string;
    secondaryWhatsapp?: string;
    email?: string;
    address?: string;
    addressHi?: string;
    youtubeUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    spotifyUrl?: string;
  };
}

export function Footer({ settings }: FooterProps) {
  const { lang, t } = useLanguage();

  const artistName =
    lang === 'hi'
      ? settings?.artistNameHi || 'गायक मुन्ना कुमार निराला'
      : settings?.artistName || 'Singer Munna Kumar Nirala';

  const tagline =
    lang === 'hi'
      ? settings?.taglineHi ||
        'सुप्रसिद्ध भजन एवं शास्त्रीय गायक | श्री सुंदरकांड पाठ, माता का जागरण, खाटू श्याम संध्या एवं रंगारंग कार्यक्रम'
      : settings?.tagline ||
        'Renowned Devotional & Classical Vocalist | Shree Sundarkand Path, Mata Jagran, Khatu Shyam Sandhya & Rangarang Karyakram';

  const phone = settings?.primaryPhone || '9990739614';
  const whatsapp1 = settings?.whatsappNumber || '9990739614';
  const whatsapp2 = settings?.secondaryWhatsapp || '7484004540';
  const email = settings?.email || 'singermunnakumarnirala@gmail.com';
  const address =
    lang === 'hi'
      ? settings?.addressHi || 'दिल्ली एनसीआर एवं बिहार, भारत (संपूर्ण भारत एवं विदेशों में सेवा उपलब्ध)'
      : settings?.address || 'Delhi NCR & Bihar, India (Available Across India & Worldwide)';

  return (
    <footer className="bg-[#0F1420] text-ivory/80 border-t border-[#C7A45A]/30">
      {/* Devotional Invocations Banner */}
      <div className="bg-[#0A0D15] border-b border-[#222633] py-4 px-4 text-center">
        <p className="text-gold font-serif text-sm sm:text-base tracking-wide flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <span className="flex items-center gap-1.5 font-bold">🚩 जय श्री राम!</span>
          <span className="hidden sm:inline text-gold/40">•</span>
          <span className="flex items-center gap-1.5 font-bold">🔱 जय माता दी!</span>
          <span className="hidden sm:inline text-gold/40">•</span>
          <span className="flex items-center gap-1.5 font-bold">🌸 जय श्री राधे कृष्णा!</span>
          <span className="hidden sm:inline text-gold/40">•</span>
          <span className="flex items-center gap-1.5 font-bold">🙏 जय श्री खाटू श्याम जी!</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Artist Intro & Trust Badges */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6F1D35] to-[#C7A45A] flex items-center justify-center text-ivory font-serif font-bold text-lg shadow-md border border-gold/40">
                M
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-ivory">{artistName}</h3>
                <span className="text-[10px] text-gold uppercase tracking-wider block font-semibold">
                  {lang === 'hi' ? 'आधिकारिक कलाकार पोर्टल' : 'Official Artist Website'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ivory/70 leading-relaxed">{tagline}</p>

            {/* Trust Badges */}
            <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-gold">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gold/10 border border-gold/30">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-light" />
                <span>100% Devotional</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gold/10 border border-gold/30">
                <Sparkles className="w-3.5 h-3.5 text-gold-light" />
                <span>Verified Artist</span>
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-navy-light border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition shadow"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-navy-light border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition shadow"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-navy-light border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition shadow"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.spotifyUrl && (
                <a
                  href={settings.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-navy-light border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-navy transition shadow"
                  aria-label="Spotify"
                >
                  <Music2 className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-gold font-serif font-semibold text-base mb-4 tracking-wide border-b border-gold/20 pb-2">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/music" className="hover:text-gold transition">
                  {t('nav.music')}
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-gold transition">
                  {t('nav.videos')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold transition">
                  {lang === 'hi' ? 'फोटो गैलरी' : 'Photo Gallery'}
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-gold transition">
                  {t('nav.events')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition">
                  {lang === 'hi' ? 'कार्यक्रम बुकिंग' : 'Book for an Event'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Devotional Programs */}
          <div>
            <h4 className="text-gold font-serif font-semibold text-base mb-4 tracking-wide border-b border-gold/20 pb-2">
              {lang === 'hi' ? 'प्रमुख भक्ति कार्यक्रम' : 'Sacred Programs'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-ivory/70">
              <li>• श्री सुंदरकांड पाठ (संगीतमय)</li>
              <li>• मां भगवती की विशाल चौकी</li>
              <li>• भव्य माता का जागरण</li>
              <li>• श्री खाटू श्याम भजन संकीर्तन</li>
              <li>• शिरडी साईं संध्या एवं भजन</li>
              <li>• संत सत्संग एवं रामकथा संकीर्तन</li>
              <li>• रुद्राभिषेक एवं शिव महिमा संकीर्तन</li>
            </ul>
          </div>

          {/* Col 4: Official Booking Contact */}
          <div className="space-y-4">
            <h4 className="text-gold font-serif font-semibold text-base tracking-wide border-b border-gold/20 pb-2">
              {t('footer.contactInfo')}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-ivory/80">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`tel:+91${phone}`} className="hover:text-gold transition">
                  +91 {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href={`https://wa.me/91${whatsapp1}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition"
                >
                  +91 {whatsapp1} / +91 {whatsapp2}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-gold transition truncate">
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-xs text-ivory/70">{address}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs shadow-lg transition"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'कार्यक्रम हेतु अभी बुक करें' : 'Book for an Event'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#222633] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/60">
          <p>© {new Date().getFullYear()} {artistName}. {t('footer.rights')}</p>

          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-gold transition">
              {lang === 'hi' ? 'परिचय' : 'About'}
            </Link>
            <span>•</span>
            <Link href="/music" className="hover:text-gold transition">
              {lang === 'hi' ? 'संगीत' : 'Music'}
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-gold transition">
              {lang === 'hi' ? 'संपर्क / बुकिंग' : 'Contact'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
