'use client';

import React, { useState, useEffect } from 'react';
import { Save, Sparkles, CheckCircle2, Eye, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { adminApi } from '@/lib/admin-client';

export default function AdminHeroPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((d) => setSettings(d))
      .catch((err) => {
        console.error(err);
        setErrorMsg('सेटिंग्स लोड करने में समस्या आई');
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async (dataToSave?: any) => {
    setSaving(true);
    setErrorMsg(null);
    const payload = dataToSave || settings;

    try {
      const res = await adminApi('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (res?.settings) {
        setSettings(res.settings);
      }
      setSuccessMsg('हीरो बैनर सफलतापूर्वक अपडेट हो गया! मुख्य वेबसाइट पर तुरंत लाइव है।');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setErrorMsg(`बदलाव सेव करने में समस्या: ${err.message || 'Error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings();
  };

  // Instant Auto-Save on Image Selection/Crop
  const handleHeroImageChange = async (newUrl: string) => {
    const updated = { ...settings, heroImage: newUrl };
    setSettings(updated);
    await saveSettings(updated);
  };

  const handleHeroVideoChange = async (newUrl: string) => {
    const updated = { ...settings, heroVideo: newUrl };
    setSettings(updated);
    await saveSettings(updated);
  };

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ivory">
            होमपेज हीरो बैनर प्रबंधन (Hero Banner Management)
          </h1>
          <p className="text-xs text-gray-400">
            यहाँ से मुख्य होमपेज की सबसे बड़ी फोटो, वीडियो और मुख्य शीर्षक बदलें। फोटो बदलते ही यह तुरंत ऑटो-सेव होकर लाइव हो जाती है।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-navy-light hover:bg-gold hover:text-navy text-gold text-xs font-semibold flex items-center gap-1.5 transition border border-gold/30 shadow"
          >
            <span>वेबसाइट पर देखें (Live)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => saveSettings()}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs flex items-center gap-2 shadow-lg transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-navy" />
                <span>सेव हो रहा है...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>सेव करें (Save Now)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/60 text-red-300 text-xs flex items-center gap-2.5 animate-fadeIn shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleManualSubmit} className="space-y-6">
        {/* 1. Hero Main Image Upload with Instant Auto-Save & Crop */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <div className="border-b border-navy-light pb-2">
            <h2 className="text-base font-serif font-bold text-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>१. होमपेज मुख्य फोटो (Hero Banner Active Image)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              यह फोटो वेबसाइट खुलते ही सबसे ऊपर बड़े पर्दे पर दिखती है। फोटो चुनते ही स्मार्ट क्रॉपर खुलेगा और सेव करते ही यह स्वतः लाइव हो जाएगी।
            </p>
          </div>

          <MediaUploader
            label="Hero Background Image"
            labelHi="हीरो बैनर की मुख्य फोटो"
            recommendedSize="1920 × 1080 पिक्सल (16:9 आड़ा फोटो / Landscape), अधिकतम 5MB"
            aspectRatioHint="aspect-video"
            value={settings?.heroImage || ''}
            onChange={handleHeroImageChange}
            helperTextHi="पापा की मंच प्रस्तुति या हाई-रेज़ोल्यूशन आड़ा (Landscape) फोटो यहाँ अपलोड करें। फोटो बदलते ही ऑटो-सेव हो जाएगी।"
          />
        </div>

        {/* 2. Optional Background Video Upload */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <div className="border-b border-navy-light pb-2">
            <h2 className="text-base font-serif font-bold text-gold">
              २. बैकग्राउंड वीडियो (Hero Background Video - वैकल्पिक)
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              यदि आप फोटो की जगह वीडियो चलाना चाहते हैं (वैकल्पिक / Optional)।
            </p>
          </div>

          <MediaUploader
            label="Hero Video"
            labelHi="हीरो बैकग्राउंड वीडियो"
            recommendedSize="1920 × 1080 पिक्सल (16:9 MP4 फॉर्मेट), अधिकतम 25MB"
            aspectRatioHint="aspect-video"
            value={settings?.heroVideo || ''}
            onChange={handleHeroVideoChange}
            fileType="VIDEO"
            helperTextHi="मंच का छोटा सा सुंदर वीडियो अपलोड कर सकते हैं।"
          />
        </div>

        {/* 3. Text Headlines */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <div className="border-b border-navy-light pb-2">
            <h2 className="text-base font-serif font-bold text-gold">
              ३. हीरो बैनर का मुख्य शीर्षक (Headings & Subheading)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                मुख्य शीर्षक (हिन्दी)
              </label>
              <input
                type="text"
                value={settings?.heroHeadingHi || ''}
                onChange={(e) => setSettings({ ...settings, heroHeadingHi: e.target.value })}
                placeholder="सुर और भक्ति का पावन संगम"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Main Heading (English)
              </label>
              <input
                type="text"
                value={settings?.heroHeading || ''}
                onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
                placeholder="Spiritual Bliss & Soulful Melodies"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                उप-शीर्षक (हिन्दी)
              </label>
              <input
                type="text"
                value={settings?.heroSubheadingHi || ''}
                onChange={(e) => setSettings({ ...settings, heroSubheadingHi: e.target.value })}
                placeholder="गायक मुन्ना कुमार निराला की आधिकारिक वेबसाइट"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Subheading (English)
              </label>
              <input
                type="text"
                value={settings?.heroSubheading || ''}
                onChange={(e) => setSettings({ ...settings, heroSubheading: e.target.value })}
                placeholder="Official Website & Booking Portal"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* 4. Live Preview Box */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-navy-light pb-2">
            <h2 className="text-base font-serif font-bold text-gold flex items-center gap-2">
              <Eye className="w-4 h-4 text-gold" />
              <span>४. लाइव प्रीव्यू (Hero Banner Active Image Live Preview)</span>
            </h2>
            <span className="text-[11px] text-emerald-400 font-semibold">
              ● लाइव वेबसाइट पर ऐसा दिखेगा
            </span>
          </div>

          <div className="relative h-60 sm:h-80 rounded-2xl overflow-hidden border-2 border-gold/60 shadow-2xl bg-black">
            <img
              src={settings?.heroImage || '/images/munna_nirala_hero.jpg'}
              alt="Live Hero Preview"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/munna_nirala_hero.jpg';
              }}
              className="w-full h-full object-cover object-top filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent flex flex-col justify-end p-6 text-center sm:text-left">
              <span className="text-[11px] uppercase tracking-widest text-gold font-bold">
                {settings?.artistNameHi || 'गायक मुन्ना कुमार निराला'}
              </span>
              <h3 className="text-xl sm:text-3xl font-serif font-black text-ivory mt-1">
                {settings?.heroHeadingHi || settings?.heroHeading || 'सुर और भक्ति का पावन संगम'}
              </h3>
              <p className="text-xs text-ivory/80 mt-1 max-w-xl line-clamp-1">
                {settings?.heroSubheadingHi || settings?.heroSubheading}
              </p>
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
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-navy" />
                <span>सेव हो रहा है... (Saving...)</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>बदलाव सेव करें और तुरंत लाइव करें (Save Changes & Publish)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
