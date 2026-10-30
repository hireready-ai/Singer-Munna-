'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
  ArrowUpDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';
import { MediaUploader } from '@/components/admin/MediaUploader';

interface EventTypeItem {
  id: string;
  title: string;
  titleHi: string;
  subtitle?: string | null;
  subtitleHi?: string | null;
  iconImage: string;
  category?: string | null;
  order: number;
  published: boolean;
}

export default function AdminEventTypesPage() {
  const [items, setItems] = useState<EventTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<EventTypeItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/event-types?all=true');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching event types:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem({
      title: '',
      titleHi: '',
      subtitle: '',
      subtitleHi: '',
      iconImage: '/icons/events/jagran.svg',
      category: 'Devotional',
      order: items.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: EventTypeItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);

    try {
      const isEdit = Boolean(editingItem.id);
      const url = isEdit ? `/api/event-types/${editingItem.id}` : '/api/event-types';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (!res.ok) throw new Error('इवेंट श्रेणी सहेजने में विफल');

      setIsModalOpen(false);
      await fetchItems();
      setMsg(isEdit ? 'इवेंट श्रेणी सफलतापूर्वक अपडेट हो गई!' : 'नई इवेंट श्रेणी सफलतापूर्वक जोड़ी गई!');
      setTimeout(() => setMsg(null), 3500);
    } catch (err: any) {
      alert(err.message || 'त्रुटि हुई');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`क्या आप श्रेणी "${name}" को हटाना चाहते हैं?`)) return;
    try {
      const res = await fetch(`/api/event-types/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('हटाने में विफल');
      await fetchItems();
      setMsg('इवेंट श्रेणी हटा दी गई!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'त्रुटि हुई');
    }
  };

  const togglePublished = async (item: EventTypeItem) => {
    try {
      await fetch(`/api/event-types/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ivory flex items-center gap-2">
            <Layers className="w-6 h-6 text-gold" />
            कार्यक्रम श्रेणियां (Popular Event Types CMS)
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 mt-1">
            होमपेज पर राइट-टू-लेफ्ट स्क्रोल होने वाले भक्ति व धार्मिक कार्यक्रमों (जागरण, कीर्तन, सुंदरकांड आदि) का प्रबंधन करें।
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-burgundy to-burgundy-light text-ivory font-semibold text-sm border border-gold/40 shadow-lg hover:shadow-gold/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-gold-light" />
          <span>नई श्रेणी जोड़ें (Add Event Type)</span>
        </button>
      </div>

      {/* Alert Notification */}
      {msg && (
        <div className="p-4 rounded-xl bg-gold/15 border border-gold/40 text-gold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{msg}</span>
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <div className="py-20 text-center text-ivory/50">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          लोड हो रहा है...
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center bg-navy-light/40 rounded-2xl border border-dashed border-gold/30 p-8">
          <Sparkles className="w-12 h-12 text-gold/40 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-ivory">कोई कार्यक्रम श्रेणी नहीं मिली</h3>
          <p className="text-sm text-ivory/60 mt-1">ऊपर दिए गए बटन से नई श्रेणी जोड़ें।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                item.published
                  ? 'bg-navy-light/50 border-gold/30 hover:border-gold/60 shadow-md'
                  : 'bg-navy-light/20 border-red-500/30 opacity-70'
              }`}
            >
              <div>
                {/* Header with icon & order */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF5E6] to-[#FFE3BA] p-2 flex items-center justify-center shadow-inner border border-gold/30 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.iconImage}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-navy border border-gold/20 text-gold">
                      क्रम: #{item.order}
                    </span>
                    <div className="mt-1">
                      <button
                        onClick={() => togglePublished(item)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          item.published
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                        title="वेबसाइट पर दिखाएं / छिपाएं"
                      >
                        {item.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{item.published ? 'दिख रहा है' : 'छिपा हुआ'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Titles */}
                <h3 className="font-serif font-bold text-base text-ivory">{item.titleHi || item.title}</h3>
                <p className="text-xs text-gold/90 font-medium">{item.title}</p>
                {item.subtitleHi && (
                  <p className="text-xs text-ivory/60 mt-1 line-clamp-2">{item.subtitleHi}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-gold/15">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 text-gold text-xs font-semibold border border-gold/30 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>एडिट</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.titleHi || item.title)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-rose-300 text-xs font-semibold border border-red-500/30 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>हटाएं</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#151B2B] border border-gold/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-ivory/60 hover:text-gold transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-serif font-bold text-ivory mb-1">
              {editingItem.id ? 'कार्यक्रम श्रेणी एडिट करें (Edit Event Type)' : 'नई कार्यक्रम श्रेणी जोड़ें (Add Event Type)'}
            </h2>
            <p className="text-xs text-gold/80 mb-5">
              होमपेज पर प्रदर्शित होने वाला भक्ति कार्यक्रम नाम, चित्र व विवरण।
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    कार्यक्रम नाम (हिन्दी में) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.titleHi || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, titleHi: e.target.value })}
                    placeholder="उदा. माता का जागरण"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    Event Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="e.g. Mata Ki Chowki"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    उपशीर्षक / संक्षिप्त विवरण (हिन्दी)
                  </label>
                  <input
                    type="text"
                    value={editingItem.subtitleHi || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, subtitleHi: e.target.value })}
                    placeholder="उदा. सम्पूर्ण रात्रि भव्य संकीर्तन"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    Subtitle (English)
                  </label>
                  <input
                    type="text"
                    value={editingItem.subtitle || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                    placeholder="e.g. Divine Night of Devotion"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Icon Uploader with Size Info and Cropper */}
              <MediaUploader
                label="इवेंट का आइकॉन / चित्र (Event Icon/Image)"
                labelHi="गोल या चौकोर भक्ति आइकॉन (400×400 px अनुशंसित)"
                recommendedSize="400 × 400 px (1:1 चौकोर / Square SVG or PNG Icon)"
                aspectRatioHint="aspect-square"
                value={editingItem.iconImage || ''}
                onChange={(url) => setEditingItem({ ...editingItem, iconImage: url })}
                fileType="IMAGE"
                helperTextHi="यह आइकॉन होमपेज के राइट-टू-लेफ्ट स्क्रोल ट्रैक में गोल/चौकोर रूप में दिखेगा।"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    प्रदर्शन क्रम (Display Order #)
                  </label>
                  <input
                    type="number"
                    value={editingItem.order ?? 1}
                    onChange={(e) => setEditingItem({ ...editingItem, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="publishedCheck"
                    checked={editingItem.published !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                    className="w-4 h-4 rounded text-gold bg-navy border-gold/40 focus:ring-gold"
                  />
                  <label htmlFor="publishedCheck" className="text-xs font-medium text-ivory select-none cursor-pointer">
                    होमपेज पर तुरंत दिखाएं (Published Live)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy hover:bg-navy-light text-ivory/70 text-sm font-medium border border-gold/20 transition"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-burgundy to-burgundy-light hover:brightness-110 text-ivory text-sm font-semibold border border-gold/40 shadow transition flex items-center gap-2"
                >
                  {saving && <div className="w-4 h-4 border-2 border-ivory border-t-transparent rounded-full animate-spin" />}
                  <span>{editingItem.id ? 'अपडेट सुरक्षित करें' : 'नई श्रेणी जोड़ें'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

