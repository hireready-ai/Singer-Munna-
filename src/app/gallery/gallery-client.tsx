'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { GalleryLightbox } from '@/components/GalleryLightbox';
import { Sparkles, Image as ImageIcon, ZoomIn } from 'lucide-react';

interface GalleryClientProps {
  initialImages: any[];
}

export function GalleryClient({ initialImages }: GalleryClientProps) {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = [
    { key: 'ALL', en: 'All Photos', hi: 'सभी छायाचित्र' },
    { key: 'Stage', en: 'Stage & Concerts', hi: 'मंच प्रस्तुतियां' },
    { key: 'Devotional', en: 'Devotional Events', hi: 'धार्मिक अनुष्ठान' },
    { key: 'Portraits', en: 'Portraits', hi: 'व्यक्तिगत पोर्ट्रेट्स' },
    { key: 'Cultural', en: 'Cultural Celebrations', hi: 'सांस्कृतिक उत्सव' },
  ];

  const filteredImages = initialImages.filter((img) => {
    if (selectedCategory === 'ALL') return true;
    return (
      img.category.includes(selectedCategory) ||
      (selectedCategory === 'Stage' && img.category.includes('Stage')) ||
      (selectedCategory === 'Devotional' && img.category.includes('Devotional')) ||
      (selectedCategory === 'Portraits' && img.category.includes('Portrait')) ||
      (selectedCategory === 'Cultural' && img.category.includes('Cultural'))
    );
  });

  return (
    <div className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-ivory">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'भक्तिमय दृश्य दर्शन' : 'Visual Highlights'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-ivory">
          {lang === 'hi' ? 'फोटो गैलरी' : 'Photo Gallery'}
        </h1>
        <p className="text-xs sm:text-sm text-ivory/70 max-w-xl mx-auto">
          {lang === 'hi'
            ? 'धार्मिक अनुष्ठानों, मंच प्रस्तुतियों और भक्ति संध्याओं के यादगार पलों का संग्रह।'
            : 'A visual celebration of live performances, spiritual gatherings, stage concerts, and devotional moments.'}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((c) => {
          const isSelected = selectedCategory === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                isSelected
                  ? 'bg-gold text-navy shadow-md font-bold'
                  : 'bg-navy-light text-ivory/80 hover:text-gold hover:bg-navy border border-gold/20'
              }`}
            >
              {lang === 'hi' ? c.hi : c.en}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-16 bg-navy-card rounded-2xl border border-gold/20 p-8 space-y-3">
          <ImageIcon className="w-12 h-12 text-gold/40 mx-auto" />
          <p className="text-base font-serif text-ivory">
            {lang === 'hi' ? 'इस श्रेणी में कोई चित्र नहीं है' : 'No photos found in this category'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, idx) => {
            const title = lang === 'hi' && image.titleHi ? image.titleHi : image.title;
            const caption = lang === 'hi' && image.captionHi ? image.captionHi : image.caption;
            const category = lang === 'hi' && image.categoryHi ? image.categoryHi : image.category;

            return (
              <div
                key={image.id}
                onClick={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
                className="bg-[#192033] rounded-2xl border border-gold/30 overflow-hidden shadow-lg hover:border-gold/60 transition group cursor-pointer"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-dark">
                  <img
                    src={image.imageUrl}
                    alt={image.altText || title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/munna_nirala_stage.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                    <div className="text-ivory space-y-1">
                      <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                        {category}
                      </span>
                      <h4 className="text-sm font-serif font-bold truncate">{title}</h4>
                      {caption && <p className="text-xs text-gray-300 line-clamp-1">{caption}</p>}
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-navy/80 border border-gold/40 text-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-3 text-center sm:text-left">
                  <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                    {category}
                  </span>
                  <h4 className="text-sm font-serif font-bold text-ivory truncate mt-0.5">
                    {title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Popup */}
      <GalleryLightbox
        isOpen={lightboxOpen}
        images={filteredImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
}

