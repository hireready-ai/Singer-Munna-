'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'hi' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.about': { en: 'About', hi: 'परिचय' },
  'nav.music': { en: 'Music', hi: 'संगीत' },
  'nav.videos': { en: 'Videos', hi: 'वीडियो' },
  'nav.gallery': { en: 'Gallery', hi: 'गैलरी' },
  'nav.events': { en: 'Events', hi: 'कार्यक्रम' },
  'nav.contact': { en: 'Contact / Booking', hi: 'संपर्क / बुकिंग' },
  'nav.bookBtn': { en: 'Book for an Event', hi: 'कार्यक्रम हेतु बुक करें' },
  'nav.adminPortal': { en: 'Admin Portal', hi: 'एडमिन पोर्टल' },

  // Hero
  'hero.exploreMusic': { en: 'Explore Music', hi: 'संगीत सुनें' },
  'btn.exploreMusic': { en: 'Explore Music', hi: 'संगीत सुनें' },
  'hero.bookEvent': { en: 'Book for an Event', hi: 'कार्यक्रम हेतु बुक करें' },
  'nav.bookEvent': { en: 'Book for an Event', hi: 'कार्यक्रम हेतु बुक करें' },
  'hero.badge': { en: 'Official Artist Portal', hi: 'आधिकारिक कलाकार पोर्टल' },

  // Sections
  'section.featuredMusic': { en: 'Featured Release', hi: 'नवीनतम प्रस्तुति' },
  'section.featuredVideo': { en: 'Featured Performance', hi: 'प्रमुख वीडियो' },
  'section.aboutSinger': { en: 'About the Singer', hi: 'गायक का परिचय' },
  'section.popularMusic': { en: 'Popular Melodies', hi: 'लोकप्रिय भजन व संगीत' },
  'section.performanceHighlights': { en: 'Performance Highlights', hi: 'कार्यक्रमों की झलकियाँ' },
  'section.upcomingEvents': { en: 'Upcoming Events & Programs', hi: 'आगामी धार्मिक व सांस्कृतिक कार्यक्रम' },
  'section.achievements': { en: 'Achievements & Press', hi: 'उपलब्धियां एवं सम्मान' },
  'section.bookingCTA': { en: 'Invite the Singer to Your Event', hi: 'अपने शुभ अवसर पर गायक को आमंत्रित करें' },
  'section.availabilityCalendar': { en: 'Program Schedule & Availability', hi: 'कार्यक्रम अनुसूची एवं उपलब्धता कैलेंडर' },

  // Common CTA
  'btn.listenNow': { en: 'Listen Now', hi: 'अभी सुनें' },
  'btn.viewAll': { en: 'View All', hi: 'सभी देखें' },
  'btn.viewBio': { en: 'View Full Biography', hi: 'विस्तृत जीवन परिचय' },
  'btn.watchVideo': { en: 'Watch Video', hi: 'वीडियो देखें' },
  'btn.bookNow': { en: 'Book Now', hi: 'अभी बुक करें' },
  'btn.callNow': { en: 'Call Now', hi: 'कॉल करें' },
  'btn.whatsapp': { en: 'WhatsApp Chat', hi: 'व्हाट्सएप संपर्क' },
  'btn.submit': { en: 'Submit Booking Enquiry', hi: 'बुकिंग अनुरोध भेजें' },

  // Contact / Booking Form
  'form.fullName': { en: 'Full Name', hi: 'पूरा नाम' },
  'form.phone': { en: 'Mobile Number', hi: 'मोबाइल नंबर' },
  'form.whatsapp': { en: 'WhatsApp Number', hi: 'व्हाट्सएप नंबर' },
  'form.email': { en: 'Email Address (Optional)', hi: 'ईमेल (वैकल्पिक)' },
  'form.eventType': { en: 'Type of Event / Program', hi: 'कार्यक्रम का प्रकार' },
  'form.eventDate': { en: 'Preferred Event Date', hi: 'कार्यक्रम की तिथि' },
  'form.city': { en: 'City / District', hi: 'शहर / जिला' },
  'form.venue': { en: 'Venue / Address', hi: 'स्थान / पता' },
  'form.audienceSize': { en: 'Expected Audience Size', hi: 'अनुमानित भक्तजन / संख्या' },
  'form.budget': { en: 'Approximate Budget (Optional)', hi: 'अनुमानित बजट (वैकल्पिक)' },
  'form.specialReq': { en: 'Special Requirements / Details', hi: 'विशेष आवश्यकताएं / विवरण' },

  // Footer
  'footer.quickLinks': { en: 'Quick Links', hi: 'त्वरित लिंक' },
  'footer.contactInfo': { en: 'Contact & Booking', hi: 'संपर्क एवं बुकिंग सूत्र' },
  'footer.blessings': { en: 'Jai Shree Ram | Jai Mata Di | Jai Shree Shyam', hi: '🚩 जय श्री राम! 🔱 जय माता दी! 🙏 जय श्री खाटू श्याम!' },
  'footer.rights': { en: 'All Rights Reserved. Official Artist Website.', hi: 'सर्वाधिकार सुरक्षित। आधिकारिक कलाकार वेबसाइट।' },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'hi',
  setLang: () => {},
  toggleLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('hi');

  useEffect(() => {
    const saved = localStorage.getItem('munna_lang') as Language;
    if (saved && (saved === 'hi' || saved === 'en')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('munna_lang', newLang);
  };

  const toggleLang = () => {
    const next = lang === 'hi' ? 'en' : 'hi';
    setLang(next);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

