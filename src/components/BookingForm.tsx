'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import {
  Calendar,
  Phone,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Users,
} from 'lucide-react';

interface BookingFormProps {
  initialDate?: string;
  whatsappNumber?: string;
  primaryPhone?: string;
}

export function BookingForm({
  initialDate = '',
  whatsappNumber = '9990739614',
  primaryPhone = '9990739614',
}: BookingFormProps) {
  const { lang, t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    eventType: 'श्री सुंदरकांड पाठ (Sundarkand Path)',
    eventDate: initialDate || '',
    city: '',
    venue: '',
    audienceSize: '200 - 500',
    budget: '',
    specialRequirements: '',
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    referenceId: string;
    whatsappUrl: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventTypes = [
    { en: 'Shree Sundarkand Path', hi: '🌺 श्री सुंदरकांड पाठ' },
    { en: 'Mata Ka Jagran & Chowki', hi: '🚩 माता का जागरण एवं चौकी' },
    { en: 'Shree Khatu Shyam Sandhya', hi: '🙏 श्री खाटू श्याम संध्या' },
    { en: 'Shree Sai Sandhya', hi: '🌼 श्री साईं संध्या' },
    { en: 'Akhand Ashtayam Sankirtan', hi: '🪔 अखंड अष्टयाम संकीर्तन' },
    { en: 'Jhanki Karyakram (Radha Krishna / Shiv Tandav)', hi: '🎭 सजीव झाँकी कार्यक्रम' },
    { en: 'Rangarang Sangeet Karyakram (Cultural Night)', hi: '🎤 रंगारंग सांस्कृतिक कार्यक्रम' },
    { en: 'Birthday / Auspicious Family Celebration', hi: '🎂 जन्मदिवस एवं मांगलिक उत्सव' },
    { en: 'Other Devotional / Musical Event', hi: '✨ अन्य धार्मिक / संगीतमय कार्यक्रम' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.fullName || !formData.phone || !formData.city || !formData.eventDate) {
      setError(
        lang === 'hi'
          ? 'कृपया नाम, मोबाइल नंबर, शहर और तिथि अवश्य भरें।'
          : 'Please fill in Name, Phone, City, and Event Date.'
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSuccessData({
        referenceId: data.referenceId,
        whatsappUrl: data.whatsappUrl,
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try calling directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#151B2B] rounded-2xl border border-gold/40 p-6 sm:p-8 shadow-2xl text-ivory">
      {/* Form Title & Introduction */}
      <div className="mb-6 border-b border-gold/20 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'आधिकारिक बुकिंग सूत्र' : 'Official Booking Enquiry'}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-ivory">
          {lang === 'hi'
            ? 'कार्यक्रम बुकिंग हेतु संपर्क फॉर्म'
            : 'Book Singer Munna Kumar Nirala for Your Event'}
        </h3>
        <p className="text-xs sm:text-sm text-ivory/70 mt-1">
          {lang === 'hi'
            ? 'नीचे दिए गए विवरण भरें। फॉर्म जमा होने के बाद आपको व्हाट्सएप पर भी त्वरित संदेश भेजने का विकल्प मिलेगा।'
            : 'Fill in event details below. You can also send this enquiry directly on WhatsApp for instant confirmation.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {successData ? (
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h4 className="text-xl font-serif font-bold text-ivory">
            {lang === 'hi' ? 'बुकिंग अनुरोध सफलतापूर्वक दर्ज हुआ!' : 'Enquiry Submitted Successfully!'}
          </h4>

          <p className="text-sm text-ivory/80">
            {lang === 'hi'
              ? 'आपका अनुरोध प्रबंधन टीम के पास पहुंच गया है।'
              : 'Your booking enquiry has been received by management.'}
          </p>

          <div className="inline-block bg-navy-light px-4 py-2 rounded-lg border border-gold/40 text-gold text-sm font-bold tracking-wider">
            {lang === 'hi' ? 'संदर्भ संख्या (Ref ID)' : 'Reference ID'}: {successData.referenceId}
          </div>

          <p className="text-xs text-ivory/70">
            {lang === 'hi'
              ? 'त्वरित प्रतिक्रिया हेतु नीचे दिए गए हरे बटन पर क्लिक करके व्हाट्सएप पर सीधे विवरण भेजें:'
              : 'For priority response, click below to send this enquiry directly to WhatsApp:'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={successData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{lang === 'hi' ? 'व्हाट्सएप पर भेजें (WhatsApp)' : 'Send to WhatsApp'}</span>
            </a>

            <a
              href={`tel:${primaryPhone}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-light hover:bg-gold hover:text-navy border border-gold/50 text-gold font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
            >
              <Phone className="w-5 h-5" />
              <span>{lang === 'hi' ? 'सीधे कॉल करें' : 'Call Directly'}</span>
            </a>
          </div>

          <button
            onClick={() => setSuccessData(null)}
            className="text-xs text-gray-400 hover:text-gold underline pt-2 block mx-auto"
          >
            {lang === 'hi' ? 'नया अनुरोध दर्ज करें' : 'Submit Another Enquiry'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
                {t('form.fullName')} *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder={lang === 'hi' ? 'उदा. राजेश शर्मा' : 'e.g. Rajesh Sharma'}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory placeholder-gray-400 focus:outline-none focus:border-gold text-sm"
              />
            </div>

            {/* Mobile Phone */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
                {t('form.phone')} *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory placeholder-gray-400 focus:outline-none focus:border-gold text-sm"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
                {t('form.whatsapp')}
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder={lang === 'hi' ? 'यदि मोबाइल नंबर से भिन्न हो' : 'Optional if same as phone'}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory placeholder-gray-400 focus:outline-none focus:border-gold text-sm"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
                {t('form.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory placeholder-gray-400 focus:outline-none focus:border-gold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Event Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
                {t('form.eventType')} *
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold text-sm"
              >
                {eventTypes.map((et, idx) => (
                  <option key={idx} value={lang === 'hi' ? et.hi : et.en} className="bg-navy text-ivory">
                    {lang === 'hi' ? et.hi : et.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
                {t('form.eventDate')} *
              </label>
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold text-sm"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
                {t('form.city')} *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder={lang === 'hi' ? 'उदा. दिल्ली / पटना / नोएडा' : 'e.g. Delhi / Patna / Noida'}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory placeholder-gray-400 focus:outline-none focus:border-gold text-sm"
              />
            </div>

            {/* Venue */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
                {t('form.venue')}
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder={lang === 'hi' ? 'मंदिर परिसर / बैंक्वेट हॉल / निवास' : 'Temple, Hall, Residence, etc.'}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory placeholder-gray-400 focus:outline-none focus:border-gold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Audience Size */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
                {t('form.audienceSize')}
              </label>
              <select
                value={formData.audienceSize}
                onChange={(e) => setFormData({ ...formData, audienceSize: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold text-sm"
              >
                <option value="100 - 200" className="bg-navy">100 - 200</option>
                <option value="200 - 500" className="bg-navy">200 - 500</option>
                <option value="500 - 1000" className="bg-navy">500 - 1000</option>
                <option value="1000+" className="bg-navy">1000+ (विशाल जनसमूह / Grand Event)</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
                {t('form.budget')}
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder={lang === 'hi' ? 'बजट अपेक्षा (वैकल्पिक)' : 'Expected budget (optional)'}
                className="w-full px-4 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory placeholder-gray-400 focus:outline-none focus:border-gold text-sm"
              />
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
              {t('form.specialReq')}
            </label>
            <textarea
              rows={3}
              value={formData.specialRequirements}
              onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
              placeholder={
                lang === 'hi'
                  ? 'जैसे: लाइव ऑर्केस्ट्रा, झांकी व्यवस्था, साउंड सिस्टम, या विशेष समय...'
                  : 'e.g. Live orchestra, sound requirements, jhanki prastuti, time slot...'
              }
              className="w-full px-4 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory placeholder-gray-400 focus:outline-none focus:border-gold text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#6F1D35] hover:bg-[#872441] text-ivory font-serif font-bold text-base tracking-wide border border-gold/50 shadow-xl hover:shadow-gold/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
                <span>{lang === 'hi' ? 'जमा हो रहा है...' : 'Submitting...'}</span>
              </span>
            ) : (
              <>
                <Send className="w-5 h-5 text-gold" />
                <span>{t('btn.submit')}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

