'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Save, Sparkles, CheckCircle2, AlertCircle, Phone, MessageCircle, Mail, MapPin, Youtube, ExternalLink, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { adminApi } from '@/lib/admin-client';

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<any>({
    artistName: '',
    artistNameHi: '',
    tagline: '',
    taglineHi: '',
    shortBio: '',
    shortBioHi: '',
    heroHeading: '',
    heroHeadingHi: '',
    heroSubheading: '',
    heroSubheadingHi: '',
    primaryPhone: '',
    whatsappNumber: '',
    secondaryWhatsapp: '',
    email: '',
    address: '',
    addressHi: '',
    youtubeUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    spotifyUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setFormData(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      await adminApi('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'सेटिंग्स सेव करने में समस्या आई');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl text-ivory">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ivory">
            वेबसाइट सेटिंग्स (Website Settings & Contact Info)
          </h1>
          <p className="text-xs text-gray-400">
            पापा का नाम, मोबाइल नंबर, व्हाट्सएप नंबर, ईमेल, पता और यूट्यूब/सोशल मीडिया के लिंक यहाँ से बदलें।
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          className="px-4 py-2 rounded-xl bg-navy-light hover:bg-gold hover:text-navy text-gold text-xs font-semibold flex items-center gap-1.5 transition border border-gold/30 shadow"
        >
          <span>वेबसाइट पर देखें</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Admin Security Banner */}
      <div className="bg-gradient-to-r from-[#1A162B] via-[#151B2B] to-[#151B2B] rounded-2xl border border-gold/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-gold flex items-center gap-2">
              <span>एडमिन सुरक्षा एवं पासवर्ड (Security & Password)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">सुरक्षित</span>
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              वेबसाइट लाइव करने से पहले अपना एडमिन पासवर्ड व यूज़रनेम यहाँ से बदलें।
            </p>
          </div>
        </div>

        <Link
          href="/admin/security"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold flex items-center justify-center gap-2 transition shadow-lg flex-shrink-0"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>पासवर्ड बदलें (Change Password)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>वेबसाइट सेटिंग्स सफलतापूर्वक अपडेट हो गई! पूरी वेबसाइट पर तुरंत नए नंबर और विवरण दिखने लगे हैं।</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Artist Identification */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <div className="border-b border-navy-light pb-2">
            <h2 className="text-base font-serif font-bold text-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>१. कलाकार का नाम एवं परिचय (Artist Name & Taglines)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                कलाकार का नाम (हिन्दी) *
              </label>
              <input
                type="text"
                required
                value={formData.artistNameHi || ''}
                onChange={(e) => setFormData({ ...formData, artistNameHi: e.target.value })}
                placeholder="गायक मुन्ना कुमार निराला"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Artist Name (English) *
              </label>
              <input
                type="text"
                required
                value={formData.artistName || ''}
                onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                placeholder="Singer Munna Kumar Nirala"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                टैगलाइन / मुख्य परिचय (हिन्दी)
              </label>
              <input
                type="text"
                value={formData.taglineHi || ''}
                onChange={(e) => setFormData({ ...formData, taglineHi: e.target.value })}
                placeholder="सुप्रसिद्ध भजन एवं शास्त्रीय गायक..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Tagline (English)
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Renowned Devotional & Cultural Vocalist..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* 2. Contact & Booking Numbers */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <div className="border-b border-navy-light pb-2">
            <h2 className="text-base font-serif font-bold text-gold flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold" />
              <span>२. संपर्क एवं बुकिंग सूत्र (Call & WhatsApp Numbers)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              यहाँ जो नंबर डालेंगे, वेबसाइट पर बुकिंग फॉर्म और कॉल बटन पर सीधे वही नंबर डायल होगा।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                मुख्य फोन नंबर (Primary Phone / Call) *
              </label>
              <input
                type="text"
                required
                value={formData.primaryPhone || ''}
                onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                placeholder="9990739614"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">
                मुख्य व्हाट्सएप नंबर (Primary WhatsApp) *
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="9990739614"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-emerald-500/40 text-emerald-300 text-xs focus:outline-none focus:border-emerald-400 font-bold"
              />
              <span className="text-[10px] text-gray-400">बुकिंग रिक्वेस्ट इसी नंबर पर व्हाट्सएप होगी</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">
                दूसरा व्हाट्सएप नंबर (Secondary WhatsApp)
              </label>
              <input
                type="text"
                value={formData.secondaryWhatsapp || ''}
                onChange={(e) => setFormData({ ...formData, secondaryWhatsapp: e.target.value })}
                placeholder="7484004540"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-emerald-500/40 text-emerald-300 text-xs focus:outline-none focus:border-emerald-400 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                ऑफिशियल ईमेल (Official Email)
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="singermunnakumarnirala@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                पता एवं सेवा क्षेत्र (हिन्दी)
              </label>
              <input
                type="text"
                value={formData.addressHi || ''}
                onChange={(e) => setFormData({ ...formData, addressHi: e.target.value })}
                placeholder="दिल्ली एनसीआर एवं बिहार, भारत (संपूर्ण भारत में उपलब्ध)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* 3. Social Media & YouTube Links */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <div className="border-b border-navy-light pb-2">
            <h2 className="text-base font-serif font-bold text-gold flex items-center gap-2">
              <Youtube className="w-4 h-4 text-gold" />
              <span>३. यूट्यूब एवं सोशल मीडिया लिंक्स (Social Media Channels)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                यूट्यूब चैनल लिंक (YouTube Channel URL)
              </label>
              <input
                type="text"
                value={formData.youtubeUrl || ''}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/@SingerMunnaKumarNirala"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                इंस्टाग्राम लिंक (Instagram Profile URL)
              </label>
              <input
                type="text"
                value={formData.instagramUrl || ''}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://www.instagram.com/singermunnakumarnirala"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                फेसबुक पेज लिंक (Facebook Page URL)
              </label>
              <input
                type="text"
                value={formData.facebookUrl || ''}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                placeholder="https://www.facebook.com/singermunnakumarnirala"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                स्पॉटिफाई लिंक (Spotify Artist URL)
              </label>
              <input
                type="text"
                value={formData.spotifyUrl || ''}
                onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                placeholder="https://open.spotify.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold font-mono"
              />
            </div>
          </div>
        </div>

        {/* Big Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-serif font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'सेव हो रहा है... (Saving...)' : 'सेटिंग्स सेव करें (Save All Settings)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
