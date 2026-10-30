'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Sparkles,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Building2,
} from 'lucide-react';
import { MediaUploader } from '@/components/admin/MediaUploader';

interface LocationItem {
  id: string;
  city: string;
  cityHi: string;
  state: string;
  stateHi?: string | null;
  programCount: number;
  highlightText?: string | null;
  highlightHi?: string | null;
  image?: string | null;
  order: number;
  published: boolean;
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<LocationItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations?all=true');
      const data = await res.json();
      setLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const openCreateModal = () => {
    setEditingItem({
      city: '',
      cityHi: '',
      state: 'India',
      stateHi: 'भारत',
      programCount: 25,
      highlightText: '',
      highlightHi: '',
      image: '/images/munna_nirala_stage.jpg',
      order: locations.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: LocationItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);

    try {
      const isEdit = Boolean(editingItem.id);
      const url = isEdit ? `/api/locations/${editingItem.id}` : '/api/locations';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (!res.ok) throw new Error('स्थान सुरक्षित करने में विफल');

      setIsModalOpen(false);
      await fetchLocations();
      setMsg(isEdit ? 'कार्यक्रम स्थान सफलतापूर्वक अपडेट हो गया!' : 'नया स्थान सफलतापूर्वक जोड़ा गया!');
      setTimeout(() => setMsg(null), 3500);
    } catch (err: any) {
      alert(err.message || 'त्रुटि हुई');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`क्या आप स्थान "${name}" को हटाना चाहते हैं?`)) return;
    try {
      const res = await fetch(`/api/locations/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('हटाने में विफल');
      await fetchLocations();
      setMsg('स्थान हटा दिया गया!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'त्रुटि हुई');
    }
  };

  const togglePublished = async (item: LocationItem) => {
    try {
      await fetch(`/api/locations/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      fetchLocations();
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
            <MapPin className="w-6 h-6 text-gold" />
            सफल कार्यक्रम शहर (Successful Program Locations CMS)
          </h1>
          <p className="text-xs sm:text-sm text-ivory/60 mt-1">
            वे सभी शहर जहां गायक मुन्ना कुमार निराला जी के सफल भक्ति कार्यक्रम आयोजित हो चुके हैं (जैसे दिल्ली, पटना, अयोध्या, काशी, मुंबई आदि)।
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-burgundy to-burgundy-light text-ivory font-semibold text-sm border border-gold/40 shadow-lg hover:shadow-gold/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-gold-light" />
          <span>नया शहर जोड़ें (Add Location)</span>
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
      ) : locations.length === 0 ? (
        <div className="py-16 text-center bg-navy-light/40 rounded-2xl border border-dashed border-gold/30 p-8">
          <Sparkles className="w-12 h-12 text-gold/40 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-ivory">कोई शहर दर्ज नहीं है</h3>
          <p className="text-sm text-ivory/60 mt-1">ऊपर दिए गए बटन से नया कार्यक्रम शहर जोड़ें।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {locations.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                item.published
                  ? 'bg-navy-light/50 border-gold/30 hover:border-gold/60 shadow-md'
                  : 'bg-navy-light/20 border-red-500/30 opacity-70'
              }`}
            >
              {/* Image banner */}
              <div className="h-32 bg-navy relative overflow-hidden">
                <img
                  src={item.image || '/images/munna_nirala_stage.jpg'}
                  alt={item.city}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/munna_nirala_stage.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151B2B] via-transparent to-black/30" />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-gold/90 text-navy font-bold text-xs shadow">
                  {item.programCount}+ कार्यक्रम
                </span>
                <span className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-gold border border-gold/30">
                  #{item.order}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-serif font-bold text-lg text-ivory flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                      <span>{item.cityHi || item.city}</span>
                    </h3>
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

                  <p className="text-xs text-gold/80 font-medium mb-2">
                    {item.city} ({item.stateHi || item.state})
                  </p>

                  {item.highlightHi && (
                    <p className="text-xs text-ivory/70 line-clamp-2 bg-navy/60 p-2 rounded-lg border border-gold/10">
                      {item.highlightHi}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-gold/15">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/15 hover:bg-gold/25 text-gold text-xs font-semibold border border-gold/30 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>एडिट</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.cityHi || item.city)}
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
              {editingItem.id ? 'स्थान जानकारी एडिट करें (Edit Location)' : 'नया कार्यक्रम शहर जोड़ें (Add Location)'}
            </h2>
            <p className="text-xs text-gold/80 mb-5">
              होमपेज के सफल कार्यक्रम शहरों के सेक्शन में यह शहर व आयोजित कार्यक्रमों की संख्या प्रदर्शित होगी।
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    शहर का नाम (हिन्दी में) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.cityHi || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, cityHi: e.target.value })}
                    placeholder="उदा. दिल्ली एनसीआर / अयोध्या धाम"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    City Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.city || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                    placeholder="e.g. Delhi NCR / Ayodhya"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    राज्य / क्षेत्र (हिन्दी)
                  </label>
                  <input
                    type="text"
                    value={editingItem.stateHi || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, stateHi: e.target.value })}
                    placeholder="उदा. दिल्ली / उत्तर प्रदेश"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    State / Region (English)
                  </label>
                  <input
                    type="text"
                    value={editingItem.state || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, state: e.target.value })}
                    placeholder="e.g. Delhi / Uttar Pradesh"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ivory/80 mb-1">
                    सफल कार्यक्रमों की संख्या (Program Count) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingItem.programCount ?? 20}
                    onChange={(e) => setEditingItem({ ...editingItem, programCount: Number(e.target.value) })}
                    placeholder="250"
                    className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                  />
                </div>
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
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory/80 mb-1">
                  मुख्य आकर्षण / प्रमुख स्थल (हिन्दी में)
                </label>
                <input
                  type="text"
                  value={editingItem.highlightHi || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, highlightHi: e.target.value })}
                  placeholder="उदा. भव्य रामलीला मैदान, रोहिणी, कनाट प्लेस एवं पीतमपुरा में सफल संकीर्तन"
                  className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ivory/80 mb-1">
                  Highlights (English)
                </label>
                <input
                  type="text"
                  value={editingItem.highlightText || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, highlightText: e.target.value })}
                  placeholder="e.g. Major Jagrans in Ramlila Ground, Connaught Place & Rohini"
                  className="w-full px-3 py-2 rounded-xl bg-navy border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                />
              </div>

              {/* City Photo Uploader */}
              <MediaUploader
                label="शहर / मंच की तस्वीर (City / Event Photo)"
                labelHi="सुंदर मंच या कार्यक्रम का फोटो"
                recommendedSize="800 × 500 px (16:10 आड़ा फोटो / Landscape)"
                aspectRatioHint="aspect-[16/10]"
                value={editingItem.image || ''}
                onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                fileType="IMAGE"
              />

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="publishedLocCheck"
                  checked={editingItem.published !== false}
                  onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                  className="w-4 h-4 rounded text-gold bg-navy border-gold/40 focus:ring-gold"
                />
                <label htmlFor="publishedLocCheck" className="text-xs font-medium text-ivory select-none cursor-pointer">
                  होमपेज पर तुरंत दिखाएं (Published Live)
                </label>
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
                  <span>{editingItem.id ? 'अपडेट सुरक्षित करें' : 'नया शहर जोड़ें'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

