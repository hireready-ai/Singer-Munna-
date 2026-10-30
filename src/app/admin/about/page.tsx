'use client';

import React, { useState, useEffect } from 'react';
import { Save, BookOpen, CheckCircle2, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { adminApi } from '@/lib/admin-client';

export default function AdminAboutPage() {
  const [bio, setBio] = useState<any>({
    introduction: '',
    introductionHi: '',
    fullBio: '',
    fullBioHi: '',
    musicalJourney: '',
    musicalJourneyHi: '',
    musicalStyles: '',
    musicalStylesHi: '',
    portraitImage: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/biography')
      .then((res) => res.json())
      .then((data) => {
        if (data) setBio(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e?: React.FormEvent, customData?: any) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const dataToSave = customData || bio;
      await adminApi('/api/biography', {
        method: 'PUT',
        body: JSON.stringify(dataToSave),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'जीवनी सेव करने में समस्या आई');
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
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ivory">
            जीवन परिचय एवं प्रोफाइल फोटो (About & Biography Management)
          </h1>
          <p className="text-xs text-gray-400">
            यहाँ से पापा की मुख्य प्रोफाइल फोटो (Portrait), संगीत साधना, और विस्तृत जीवन परिचय अपडेट करें।
          </p>
        </div>

        <a
          href="/about"
          target="_blank"
          className="px-4 py-2 rounded-xl bg-navy-light hover:bg-gold hover:text-navy text-gold text-xs font-semibold flex items-center gap-1.5 transition border border-gold/30 shadow"
        >
          <span>About पेज देखें (View About)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>जीवन परिचय सफलतापूर्वक अपडेट हो गया! मुख्य About पेज पर तुरंत लाइव है।</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Portrait Photo Upload */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <div className="border-b border-navy-light pb-2">
            <h2 className="text-base font-serif font-bold text-gold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>१. कलाकार प्रोफाइल फोटो (Biography Portrait Image)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              यह फोटो About पेज और होमपेज के 'About the Singer' सेक्शन में दिखती है।
            </p>
          </div>

          <MediaUploader
            label="Artist Biography Portrait Photo"
            labelHi="पापा की मुख्य प्रोफाइल/पोर्ट्रेट फोटो"
            recommendedSize="1200 × 1600 पिक्सल (3:4 अनुपात, सीधा/खड़ा फोटो / Portrait), अधिकतम 5MB"
            aspectRatioHint="aspect-[3/4]"
            value={bio.portraitImage || ''}
            onChange={(url) => {
              const updated = { ...bio, portraitImage: url };
              setBio(updated);
              handleSubmit(undefined, updated);
            }}
            helperTextHi="पापा की सुंदर, स्पष्ट और सीधे पोज़ (Vertical Portrait) वाली फोटो यहाँ अपलोड करें। फोटो बदलते ही तुरंत ऑटो-सेव हो जाएगी।"
          />
        </div>

        {/* 2. Musical Styles / Disciplines */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <h2 className="text-base font-serif font-bold text-gold border-b border-navy-light pb-2">
            २. गायन विधाएं एवं शैलियां (Musical Specialities)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                गायन विधाएं (हिन्दी)
              </label>
              <input
                type="text"
                value={bio.musicalStylesHi || ''}
                onChange={(e) => setBio({ ...bio, musicalStylesHi: e.target.value })}
                placeholder="श्री सुंदरकांड पाठ, माता का जागरण, खाटू श्याम संध्या, अखंड अष्टयाम..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Musical Disciplines (English)
              </label>
              <input
                type="text"
                value={bio.musicalStyles || ''}
                onChange={(e) => setBio({ ...bio, musicalStyles: e.target.value })}
                placeholder="Devotional, Bhajan, Sundarkand, Ghazal & Classical..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* 3. Short Intro */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <h2 className="text-base font-serif font-bold text-gold border-b border-navy-light pb-2">
            ३. संक्षिप्त परिचय (Short Introduction)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                संक्षिप्त परिचय (हिन्दी)
              </label>
              <textarea
                rows={4}
                value={bio.introductionHi || ''}
                onChange={(e) => setBio({ ...bio, introductionHi: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Short Introduction (English)
              </label>
              <textarea
                rows={4}
                value={bio.introduction || ''}
                onChange={(e) => setBio({ ...bio, introduction: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* 4. Full Biography */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <h2 className="text-base font-serif font-bold text-gold border-b border-navy-light pb-2">
            ४. विस्तृत जीवन परिचय एवं संगीत साधना (Full Biography)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                विस्तृत जीवन परिचय (हिन्दी)
              </label>
              <textarea
                rows={8}
                value={bio.fullBioHi || ''}
                onChange={(e) => setBio({ ...bio, fullBioHi: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Full Biography (English)
              </label>
              <textarea
                rows={8}
                value={bio.fullBio || ''}
                onChange={(e) => setBio({ ...bio, fullBio: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 5. Musical Journey */}
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 p-6 space-y-4 shadow-xl">
          <h2 className="text-base font-serif font-bold text-gold border-b border-navy-light pb-2">
            ५. संगीत यात्रा एवं गुरु परंपरा (Musical Journey & Tradition)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                संगीत साधना यात्रा (हिन्दी)
              </label>
              <textarea
                rows={5}
                value={bio.musicalJourneyHi || ''}
                onChange={(e) => setBio({ ...bio, musicalJourneyHi: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Musical Journey (English)
              </label>
              <textarea
                rows={5}
                value={bio.musicalJourney || ''}
                onChange={(e) => setBio({ ...bio, musicalJourney: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-serif font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'सेव हो रहा है... (Saving...)' : 'जीवन परिचय सेव करें (Save Biography)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
