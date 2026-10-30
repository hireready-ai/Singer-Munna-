'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  X,
  Star,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { adminApi } from '@/lib/admin-client';

interface TestimonialItem {
  id: string;
  clientName: string;
  clientNameHi?: string | null;
  designation?: string | null;
  designationHi?: string | null;
  city?: string | null;
  cityHi?: string | null;
  eventType: string;
  eventTypeHi?: string | null;
  rating: number;
  reviewText: string;
  reviewTextHi: string;
  avatarUrl?: string | null;
  verified: boolean;
  order: number;
  published: boolean;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<TestimonialItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/testimonials?all=true');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem({
      clientName: '',
      clientNameHi: '',
      designation: 'Devotee / Event Organizer',
      designationHi: 'भक्त एवं कार्यक्रम आयोजक',
      city: 'Delhi',
      cityHi: 'दिल्ली',
      eventType: 'Mata Ki Chowki',
      eventTypeHi: 'माता की चौकी',
      rating: 5,
      reviewText: 'Divine singing and spiritual aura! The entire audience was immersed in devotion.',
      reviewTextHi: 'परम पूज्य मुन्ना निराला जी के भजनों से सम्पूर्ण वातावरण भक्तिमय हो गया। अद्भुत कंठ एवं दिव्य भाव!',
      avatarUrl: '/images/munna_nirala_portrait.jpg',
      verified: true,
      order: items.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);

    try {
      const isEdit = Boolean(editingItem.id);
      const url = isEdit ? `/api/testimonials/${editingItem.id}` : '/api/testimonials';
      const method = isEdit ? 'PUT' : 'POST';

      await adminApi(url, {
        method,
        body: JSON.stringify(editingItem),
      });

      setIsModalOpen(false);
      await fetchItems();
      setMsg(isEdit ? 'समीक्षा सफलतापूर्वक अपडेट हो गई!' : 'नई समीक्षा सफलतापूर्वक जोड़ी गई!');
      setTimeout(() => setMsg(null), 3500);
    } catch (err: any) {
      alert(err.message || 'त्रुटि हुई');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`क्या आप समीक्षा "${name}" को हटाना चाहते हैं?`)) return;
    try {
      await adminApi(`/api/testimonials/${id}`, { method: 'DELETE' });
      await fetchItems();
      setMsg('समीक्षा हटा दी गई!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'त्रुटि हुई');
    }
  };

  const togglePublished = async (item: TestimonialItem) => {
    try {
      await adminApi(`/api/testimonials/${item.id}`, {
        method: 'PUT',
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
            <MessageSquare className="w-6 h-6 text-gold" />
            समीक्षाएं व रिव्यूज (Devotee & Client Reviews CMS)
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 mt-1">
            भक्तों, आयोजन समितियों एवं श्रोताओं के 5-स्टार अनुभव व प्रशंसा पत्र का प्रबंधन करें।
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-burgundy to-burgundy-light text-ivory font-semibold text-sm border border-gold/40 shadow-lg hover:shadow-gold/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-gold-light" />
          <span>नई समीक्षा जोड़ें (Add Review)</span>
        </button>
      </div>

      {/* Alert Notification */}
      {msg && (
        <div className="p-4 rounded-xl bg-gold/15 border border-gold/40 text-gold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{msg}</span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-ivory/50">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          लोड हो रहा है...
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center bg-navy-light/40 rounded-2xl border border-dashed border-gold/30 p-8">
          <Sparkles className="w-12 h-12 text-gold/40 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-ivory">कोई समीक्षा दर्ज नहीं है</h3>
          <p className="text-sm text-ivory/60 mt-1">ऊपर दिए गए बटन से नई समीक्षा जोड़ें।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                item.published
                  ? 'bg-navy-light/50 border-gold/30 hover:border-gold/60 shadow-md'
                  : 'bg-navy-light/20 border-red-500/30 opacity-70'
              }`}
            >
              <div>
                {/* Header: Avatar + Name + Rating */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatarUrl || '/images/munna_nirala_portrait.jpg'}
                      alt={item.clientName}
                      className="w-12 h-12 rounded-full object-cover border border-gold/40 flex-shrink-0 shadow"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/munna_nirala_portrait.jpg';
                      }}
                    />
                    <div>
                      <h4 className="font-serif font-bold text-base text-ivory flex items-center gap-1.5">
                        <span>{item.clientNameHi || item.clientName}</span>
                        {item.verified && (
                          <span title="सत्यापित आयोजक (Verified Organizer)">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gold/80 font-medium">
                        {item.designationHi || item.designation} • {item.cityHi || item.city}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePublished(item)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      item.published
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {item.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{item.published ? 'लाइव' : 'छिपा'}</span>
                  </button>
                </div>

                {/* Stars & Event Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-burgundy/40 text-gold-light border border-gold/30">
                    {item.eventTypeHi || item.eventType}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed italic bg-navy/60 p-3 rounded-xl border border-gold/10">
                  &ldquo;{item.reviewTextHi || item.reviewText}&rdquo;
                </p>
                {item.reviewText && item.reviewTextHi && (
                  <p className="text-[11px] text-ivory/50 mt-1 italic line-clamp-1">
                    En: &ldquo;{item.reviewText}&rdquo;
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 mt-4 border-t border-gold/15">
                <span className="text-[10px] font-mono text-ivory/50">क्रम: #{item.order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 text-gold text-xs font-semibold border border-gold/30 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>एडिट</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.clientNameHi || item.clientName)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-rose-300 text-xs font-semibold border border-red-500/30 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>हटाएं</span>
                  </button>
                </div>
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
              {editingItem.id ? 'समीक्षा एडिट करें (Edit Review)' : 'नई समीक्षा जोड़ें (Add Review)'}
            </h2>
            <p className="text-xs text-gold/80 mb-5">
              भक्तों, आयोजन समिति एवं यजमानों के अनुभव होमपेज पर प्रदर्शित होंगे।
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    समीक्षक / यजमान का नाम (हिन्दी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.clientNameHi || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, clientNameHi: e.target.value })}
                    placeholder="उदा. श्री राजेश शर्मा जी"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.clientName || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    पद / समिति (हिन्दी)
                  </label>
                  <input
                    type="text"
                    value={editingItem.designationHi || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, designationHi: e.target.value })}
                    placeholder="उदा. अध्यक्ष, श्री श्याम मित्र मंडल"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    Designation (English)
                  </label>
                  <input
                    type="text"
                    value={editingItem.designation || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, designation: e.target.value })}
                    placeholder="e.g. President, Shree Shyam Mandal"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    शहर (City)
                  </label>
                  <input
                    type="text"
                    value={editingItem.cityHi || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, cityHi: e.target.value, city: e.target.value })}
                    placeholder="उदा. दिल्ली / पटना"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    कार्यक्रम प्रकार (Event Type)
                  </label>
                  <input
                    type="text"
                    value={editingItem.eventTypeHi || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, eventTypeHi: e.target.value, eventType: e.target.value })}
                    placeholder="उदा. माता का जागरण"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    रेटिंग (Star Rating: 1-5)
                  </label>
                  <select
                    value={editingItem.rating ?? 5}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Star)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Star)</option>
                    <option value={3}>⭐⭐⭐ (3 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory/80 mb-1">
                  समीक्षा / अनुभव (हिन्दी में) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.reviewTextHi || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, reviewTextHi: e.target.value })}
                  placeholder="भजनों की दिव्यता, गायकी का अनुभव और आयोजन पर टिप्पणी..."
                  className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory/80 mb-1">
                  Review Text (English) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.reviewText || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, reviewText: e.target.value })}
                  placeholder="Review message in English..."
                  className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                />
              </div>

              {/* Photo Uploader */}
              <MediaUploader
                label="समीक्षक का फोटो / अवतार (Reviewer Photo)"
                labelHi="गोल प्रोफ़ाइल फोटो"
                recommendedSize="300 × 300 px (1:1 चौकोर / Circle Avatar)"
                aspectRatioHint="aspect-square"
                value={editingItem.avatarUrl || ''}
                onChange={(url) => setEditingItem({ ...editingItem, avatarUrl: url })}
                fileType="IMAGE"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    क्रम (Order #)
                  </label>
                  <input
                    type="number"
                    value={editingItem.order ?? 1}
                    onChange={(e) => setEditingItem({ ...editingItem, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="verifiedCheck"
                    checked={editingItem.verified !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, verified: e.target.checked })}
                    className="w-4 h-4 rounded text-gold bg-navy border-gold/40 focus:ring-gold"
                  />
                  <label htmlFor="verifiedCheck" className="text-xs font-medium text-ivory select-none cursor-pointer">
                    सत्यापित आयोजक (Verified Badge)
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="publishedTestimonialCheck"
                    checked={editingItem.published !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                    className="w-4 h-4 rounded text-gold bg-navy border-gold/40 focus:ring-gold"
                  />
                  <label htmlFor="publishedTestimonialCheck" className="text-xs font-medium text-ivory select-none cursor-pointer">
                    लाइव दिखाएं (Published)
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
                  <span>{editingItem.id ? 'अपडेट सुरक्षित करें' : 'समीक्षा जोड़ें'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
