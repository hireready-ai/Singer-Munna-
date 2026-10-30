'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Sparkles,
  Upload,
  ExternalLink,
} from 'lucide-react';
import { MediaUploader } from '@/components/admin/MediaUploader';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchImages = () => {
    fetch('/api/gallery?all=true')
      .then((res) => res.json())
      .then((d) => setImages(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleOpenModal = (img?: any) => {
    if (img) {
      setEditingImage(img);
    } else {
      setEditingImage({
        title: 'मंच प्रस्तुति',
        titleHi: 'मंच प्रस्तुति',
        caption: 'धार्मिक अनुष्ठान में भजन प्रस्तुति',
        captionHi: 'धार्मिक अनुष्ठान में भजन प्रस्तुति',
        imageUrl: '/images/munna_nirala_stage.jpg',
        category: 'Stage Performances',
        categoryHi: 'मंच प्रदर्शन',
        altText: 'गायक मुन्ना कुमार निराला लाइव',
        showOnHome: true,
        order: 0,
        published: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const isEdit = Boolean(editingImage.id);
      const url = isEdit ? `/api/gallery/${editingImage.id}` : '/api/gallery';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingImage),
      });

      if (!res.ok) throw new Error('फोटो सेव करने में समस्या आई');

      setIsModalOpen(false);
      fetchImages();
      setMsg(isEdit ? 'फोटो विवरण अपडेट हुआ!' : 'नई फोटो गैलरी में जुड़ गई!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving photo');
    } finally {
      setSaving(false);
    }
  };

  // Bulk Multiple Photos Upload
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setBulkUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('category', 'Stage Performances');

    try {
      // 1. Upload to media library
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Bulk upload failed');

      const uploadedAssets = data.assets || [data];

      // 2. Automatically add each to Gallery!
      for (const asset of uploadedAssets) {
        await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: asset.title.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            titleHi: 'लाइव मंच फोटो',
            imageUrl: asset.fileUrl,
            category: 'Stage Performances',
            categoryHi: 'मंच प्रदर्शन',
            altText: 'Singer Munna Kumar Nirala',
            showOnHome: true,
            published: true,
          }),
        });
      }

      fetchImages();
      setMsg(`कुल ${uploadedAssets.length} तस्वीरें सफलतापूर्वक गैलरी में जुड़ गईं!`);
      setTimeout(() => setMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Error uploading photos');
    } finally {
      setBulkUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`क्या आप फोटो "${title}" को गैलरी से हटाना चाहते हैं?`)) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete photo');
      fetchImages();
      setMsg('फोटो गैलरी से हटा दी गई!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error deleting photo');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ivory">
            फोटो गैलरी प्रबंधन (Photo Gallery Management)
          </h1>
          <p className="text-xs text-gray-400">
            मंच और भक्ति कार्यक्रमों की तस्वीरें अपलोड करें। आप एक साथ कई फोटो भी चुन सकते हैं।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/gallery"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-navy-light hover:bg-gold hover:text-navy text-gold text-xs font-semibold flex items-center gap-1.5 transition border border-gold/30 shadow"
          >
            <span>Gallery पेज देखें</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Bulk Multi-Upload Button */}
          <label className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{bulkUploading ? 'अपलोड हो रहा है...' : '+ एक साथ कई फोटो अपलोड करें (Bulk Upload)'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleBulkUpload}
              disabled={bulkUploading}
              className="hidden"
            />
          </label>

          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs flex items-center gap-2 shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ एक फोटो जोड़ें (Add Single)</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-[#151B2B] rounded-2xl border border-gold/30 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-gold/60 transition"
          >
            <div>
              <div className="relative aspect-square w-full overflow-hidden bg-navy-dark">
                <img
                  src={img.imageUrl}
                  alt={img.altText || img.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/munna_nirala_stage.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                {img.showOnHome && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-gold text-navy text-[10px] font-bold shadow">
                    होमपेज पर दृश्य
                  </span>
                )}
              </div>

              <div className="p-3 space-y-1">
                <span className="text-[10px] text-gold uppercase tracking-wider font-semibold block">
                  {img.categoryHi || img.category}
                </span>
                <h3 className="text-xs sm:text-sm font-serif font-bold text-ivory truncate">{img.titleHi || img.title}</h3>
                {img.caption && <p className="text-[11px] text-gray-400 line-clamp-1">{img.caption}</p>}
              </div>
            </div>

            <div className="p-3 bg-navy-light/40 border-t border-navy-light flex items-center justify-between text-xs">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  img.published ? 'text-emerald-400 bg-emerald-500/20' : 'text-red-400 bg-red-500/20'
                }`}
              >
                {img.published ? 'लाइव (Live)' : 'ड्राफ्ट'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(img)}
                  className="p-1.5 rounded-lg bg-navy hover:bg-gold hover:text-navy text-gold transition"
                  title="बदलें (Edit)"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(img.id, img.title)}
                  className="p-1.5 rounded-lg bg-navy hover:bg-red-500 text-red-400 hover:text-white transition"
                  title="हटाएँ (Delete)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Single Photo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151B2B] rounded-2xl border border-gold/40 p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 text-ivory">
            <div className="flex items-center justify-between border-b border-navy-light pb-3">
              <h3 className="text-lg font-serif font-bold text-ivory flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gold" />
                <span>{editingImage.id ? 'फोटो में बदलाव करें' : 'नई फोटो जोड़ें'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Media Uploader with Exact Recommended Size */}
              <MediaUploader
                label="Gallery Photo Image"
                labelHi="गैलरी हेतु फोटो अपलोड करें"
                recommendedSize="1200 × 900 पिक्सल (4:3 अनुपात) या 1200 × 1200 पिक्सल (चौकोर), अधिकतम 5MB"
                aspectRatioHint="aspect-[4/3]"
                value={editingImage.imageUrl || ''}
                onChange={(url) => setEditingImage({ ...editingImage, imageUrl: url })}
                helperTextHi="पापा की मंच, जागरण या भक्ति संध्या की स्पष्ट फोटो यहाँ अपलोड करें।"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    फोटो का शीर्षक (हिन्दी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingImage.titleHi || ''}
                    onChange={(e) => setEditingImage({ ...editingImage, titleHi: e.target.value })}
                    placeholder="उदा. भव्य माता का जागरण मंच"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingImage.title}
                    onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                    placeholder="e.g. Grand Mata Jagran Stage"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={editingImage.category}
                    onChange={(e) => setEditingImage({ ...editingImage, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Stage Performances">मंच प्रस्तुतियां (Stage Performances)</option>
                    <option value="Devotional Events">धार्मिक अनुष्ठान (Devotional Events)</option>
                    <option value="Portraits">पोर्ट्रेट्स (Portraits)</option>
                    <option value="Cultural Celebrations">सांस्कृतिक उत्सव (Cultural Events)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Alt Text (विवरण)
                  </label>
                  <input
                    type="text"
                    value={editingImage.altText || ''}
                    onChange={(e) => setEditingImage({ ...editingImage, altText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  कैप्शन / विवरण (Caption)
                </label>
                <textarea
                  rows={2}
                  value={editingImage.caption || ''}
                  onChange={(e) => setEditingImage({ ...editingImage, caption: e.target.value })}
                  placeholder="उदा. दिल्ली में आयोजित नवरात्रि जागरण का दिव्य दृश्य..."
                  className="w-full px-3.5 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 p-3 rounded-xl bg-navy-light/60 border border-navy-light">
                <label className="flex items-center gap-2 text-xs font-semibold text-ivory cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingImage.showOnHome}
                    onChange={(e) => setEditingImage({ ...editingImage, showOnHome: e.target.checked })}
                    className="w-4 h-4 rounded accent-gold"
                  />
                  <span>होमपेज के 'Performance Highlights' में दिखाएँ</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-ivory cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingImage.published}
                    onChange={(e) => setEditingImage({ ...editingImage, published: e.target.checked })}
                    className="w-4 h-4 rounded accent-gold"
                  />
                  <span>वेबसाइट पर लाइव रखें (Published)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-navy-light">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-light text-gray-300 text-xs font-semibold"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs shadow-lg transition"
                >
                  {saving ? 'सेव हो रहा है...' : 'फोटो सेव करें (Save Photo)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
