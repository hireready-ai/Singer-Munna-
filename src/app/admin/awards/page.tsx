'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Award as AwardIcon,
  Newspaper,
  CheckCircle2,
  X,
} from 'lucide-react';
import { adminApi } from '@/lib/admin-client';

export default function AdminAwardsPage() {
  const [tab, setTab] = useState<'AWARDS' | 'PRESS'>('AWARDS');
  const [awards, setAwards] = useState<any[]>([]);
  const [press, setPress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [editingAward, setEditingAward] = useState<any | null>(null);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);

  const [editingPress, setEditingPress] = useState<any | null>(null);
  const [isPressModalOpen, setIsPressModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [awRes, prRes] = await Promise.all([
        fetch('/api/awards'),
        fetch('/api/press'),
      ]);
      const aw = await awRes.json();
      const pr = await prRes.json();
      setAwards(aw);
      setPress(pr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Awards Save & Delete
  const handleSaveAward = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = Boolean(editingAward.id);
      const url = isEdit ? `/api/awards/${editingAward.id}` : '/api/awards';
      const method = isEdit ? 'PUT' : 'POST';

      await adminApi(url, {
        method,
        body: JSON.stringify(editingAward),
      });

      setIsAwardModalOpen(false);
      fetchData();
      setMsg(isEdit ? 'Award updated!' : 'Award added!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAward = async (id: string, title: string) => {
    if (!confirm(`Delete award "${title}"?`)) return;
    try {
      await adminApi(`/api/awards/${id}`, { method: 'DELETE' });
      fetchData();
      setMsg('Award deleted!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Press Save & Delete
  const handleSavePress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = Boolean(editingPress.id);
      const url = isEdit ? `/api/press/${editingPress.id}` : '/api/press';
      const method = isEdit ? 'PUT' : 'POST';

      await adminApi(url, {
        method,
        body: JSON.stringify(editingPress),
      });

      setIsPressModalOpen(false);
      fetchData();
      setMsg(isEdit ? 'Press article updated!' : 'Press article added!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePress = async (id: string, title: string) => {
    if (!confirm(`Delete press item "${title}"?`)) return;
    try {
      await adminApi(`/api/press/${id}`, { method: 'DELETE' });
      fetchData();
      setMsg('Press article deleted!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ivory">Awards & Press Management</h1>
          <p className="text-xs text-gray-400">
            Maintain verified awards, certifications, collaborations, and official news coverage.
          </p>
        </div>

        <div>
          {tab === 'AWARDS' ? (
            <button
              onClick={() => {
                setEditingAward({
                  title: '',
                  titleHi: '',
                  organization: '',
                  year: new Date().getFullYear().toString(),
                  description: '',
                  descriptionHi: '',
                });
                setIsAwardModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Award</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingPress({
                  title: '',
                  titleHi: '',
                  publisher: '',
                  publishDate: 'Recent',
                  articleUrl: '',
                  summary: '',
                  summaryHi: '',
                });
                setIsPressModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Press Coverage</span>
            </button>
          )}
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-navy-light pb-2">
        <button
          onClick={() => setTab('AWARDS')}
          className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition flex items-center gap-2 ${
            tab === 'AWARDS'
              ? 'bg-gold text-navy shadow-md'
              : 'text-ivory/80 hover:text-gold hover:bg-navy-light'
          }`}
        >
          <AwardIcon className="w-4 h-4" />
          <span>Verified Awards & Honors ({awards.length})</span>
        </button>

        <button
          onClick={() => setTab('PRESS')}
          className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition flex items-center gap-2 ${
            tab === 'PRESS'
              ? 'bg-gold text-navy shadow-md'
              : 'text-ivory/80 hover:text-gold hover:bg-navy-light'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Press & Media Articles ({press.length})</span>
        </button>
      </div>

      {/* Awards List */}
      {tab === 'AWARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {awards.map((a) => (
            <div
              key={a.id}
              className="bg-[#151B2B] rounded-2xl border border-gold/30 p-5 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                    <AwardIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gold">{a.year}</span>
                </div>
                <h3 className="text-base font-serif font-bold text-ivory">{a.title}</h3>
                <p className="text-xs text-gold/80">{a.organization}</p>
                <p className="text-xs text-gray-400 line-clamp-2">{a.description}</p>
              </div>

              <div className="pt-3 border-t border-navy-light flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingAward(a);
                    setIsAwardModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-navy hover:bg-gold hover:text-navy text-gold transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteAward(a.id, a.title)}
                  className="p-1.5 rounded-lg bg-navy hover:bg-red-500 text-red-400 hover:text-white transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Press List */}
      {tab === 'PRESS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {press.map((p) => (
            <div
              key={p.id}
              className="bg-[#151B2B] rounded-2xl border border-gold/30 p-5 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gold font-semibold">
                  <span>{p.publisher}</span>
                  <span>{p.publishDate}</span>
                </div>
                <h3 className="text-base font-serif font-bold text-ivory">{p.title}</h3>
                <p className="text-xs text-gray-300 line-clamp-3">{p.summary}</p>
              </div>

              <div className="pt-3 border-t border-navy-light flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingPress(p);
                    setIsPressModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-navy hover:bg-gold hover:text-navy text-gold transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeletePress(p.id, p.title)}
                  className="p-1.5 rounded-lg bg-navy hover:bg-red-500 text-red-400 hover:text-white transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Award Modal */}
      {isAwardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151B2B] rounded-2xl border border-gold/40 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-light pb-3">
              <h3 className="text-lg font-serif font-bold text-ivory">
                {editingAward.id ? 'Edit Award' : 'Add Award'}
              </h3>
              <button onClick={() => setIsAwardModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAward} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Award Title (English) *</label>
                <input
                  type="text"
                  required
                  value={editingAward.title}
                  onChange={(e) => setEditingAward({ ...editingAward, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">सम्मान का नाम (हिन्दी)</label>
                <input
                  type="text"
                  value={editingAward.titleHi || ''}
                  onChange={(e) => setEditingAward({ ...editingAward, titleHi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingAward.organization}
                    onChange={(e) => setEditingAward({ ...editingAward, organization: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Year (e.g. 2024)</label>
                  <input
                    type="text"
                    value={editingAward.year}
                    onChange={(e) => setEditingAward({ ...editingAward, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingAward.description || ''}
                  onChange={(e) => setEditingAward({ ...editingAward, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-navy-light">
                <button
                  type="button"
                  onClick={() => setIsAwardModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-light text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold"
                >
                  {saving ? 'Saving...' : 'Save Award'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Press Modal */}
      {isPressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151B2B] rounded-2xl border border-gold/40 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-light pb-3">
              <h3 className="text-lg font-serif font-bold text-ivory">
                {editingPress.id ? 'Edit Press Item' : 'Add Press Item'}
              </h3>
              <button onClick={() => setIsPressModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePress} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Headline (English) *</label>
                <input
                  type="text"
                  required
                  value={editingPress.title}
                  onChange={(e) => setEditingPress({ ...editingPress, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">शीर्षक (हिन्दी)</label>
                <input
                  type="text"
                  value={editingPress.titleHi || ''}
                  onChange={(e) => setEditingPress({ ...editingPress, titleHi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Publisher (Newspaper/Channel)</label>
                  <input
                    type="text"
                    required
                    value={editingPress.publisher}
                    onChange={(e) => setEditingPress({ ...editingPress, publisher: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Date (e.g. Oct 2024)</label>
                  <input
                    type="text"
                    value={editingPress.publishDate}
                    onChange={(e) => setEditingPress({ ...editingPress, publishDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Article Summary</label>
                <textarea
                  rows={3}
                  value={editingPress.summary || ''}
                  onChange={(e) => setEditingPress({ ...editingPress, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-navy-light">
                <button
                  type="button"
                  onClick={() => setIsPressModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-light text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold"
                >
                  {saving ? 'Saving...' : 'Save Press Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

