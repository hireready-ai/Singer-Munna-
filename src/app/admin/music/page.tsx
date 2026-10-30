'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Play,
  Pause,
  Sparkles,
  CheckCircle2,
  X,
  Music2,
  ExternalLink,
} from 'lucide-react';
import { useAudio } from '@/lib/audio-context';
import { MediaUploader } from '@/components/admin/MediaUploader';

export default function AdminMusicPage() {
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrack, setEditingTrack] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchTracks = () => {
    fetch('/api/music?all=true')
      .then((res) => res.json())
      .then((d) => setTracks(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleOpenModal = (track?: any) => {
    if (track) {
      setEditingTrack(track);
    } else {
      setEditingTrack({
        title: '',
        titleHi: '',
        album: 'Single',
        albumHi: 'एकल',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverImage: '/images/munna_nirala_hero.jpg',
        duration: '06:00',
        releaseDate: new Date().toISOString().split('T')[0],
        category: 'Sundarkand',
        categoryHi: 'श्री सुंदरकांड पाठ',
        isFeatured: false,
        order: 0,
        published: true,
        youtubeUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const isEdit = Boolean(editingTrack.id);
      const url = isEdit ? `/api/music/${editingTrack.id}` : '/api/music';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTrack),
      });

      if (!res.ok) throw new Error('भजन सेव करने में समस्या आई');

      setIsModalOpen(false);
      fetchTracks();
      setMsg(isEdit ? 'भजन विवरण सफलतापूर्वक अपडेट हुआ!' : 'नया भजन सफलतापूर्वक जुड़ गया!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving track');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`क्या आप भजन "${title}" को हटाना चाहते हैं?`)) return;

    try {
      const res = await fetch(`/api/music/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete track');
      fetchTracks();
      setMsg('भजन सफलतापूर्वक हटा दिया गया!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error deleting track');
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
            भजन एवं संगीत प्रबंधन (Music & Bhajans Management)
          </h1>
          <p className="text-xs text-gray-400">
            यहाँ से पापा के नए भजन, ऑडियो फाइल, कवर फोटो और श्रेणी जोड़ें या बदलें।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/music"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-navy-light hover:bg-gold hover:text-navy text-gold text-xs font-semibold flex items-center gap-1.5 transition border border-gold/30 shadow"
          >
            <span>Music पेज देखें</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs flex items-center gap-2 shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ नया भजन जोड़ें (Add Track)</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tracks Table */}
      <div className="bg-[#151B2B] rounded-2xl border border-gold/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-navy-light bg-navy-light/60 text-gold font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">भजन / Track</th>
                <th className="py-3 px-4">श्रेणी / Category</th>
                <th className="py-3 px-4">एल्बम / Album</th>
                <th className="py-3 px-4">अवधि / Duration</th>
                <th className="py-3 px-4">फीचर्ड (Featured)</th>
                <th className="py-3 px-4">स्थिति (Status)</th>
                <th className="py-3 px-4 text-right">कार्रवाई (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-light">
              {tracks.map((track) => {
                const isPlayingThis = currentTrack?.id === track.id && isPlaying;
                return (
                  <tr key={track.id} className="hover:bg-navy-light/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-gold/30 flex-shrink-0 bg-black">
                          <img
                            src={track.coverImage || '/images/munna_nirala_hero.jpg'}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => playTrack(track)}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center text-gold hover:text-white"
                          >
                            {isPlayingThis ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-ivory text-sm truncate max-w-xs">{track.titleHi || track.title}</p>
                          <p className="text-gray-400 text-[11px] truncate max-w-xs">{track.title}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-gold font-medium">{track.categoryHi || track.category}</td>
                    <td className="py-3 px-4 text-gray-300">{track.albumHi || track.album || 'एकल'}</td>
                    <td className="py-3 px-4 text-gray-400 font-mono">{track.duration}</td>

                    <td className="py-3 px-4">
                      {track.isFeatured ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          ★ Featured (होमपेज)
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[11px]">सामान्य</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          track.published
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {track.published ? 'लाइव (Live)' : 'ड्राफ्ट (Draft)'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(track)}
                          className="p-1.5 rounded-lg bg-navy-light hover:bg-gold hover:text-navy text-gold transition"
                          title="बदलें (Edit)"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(track.id, track.title)}
                          className="p-1.5 rounded-lg bg-navy-light hover:bg-red-500 text-red-400 hover:text-white transition"
                          title="हटाएँ (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151B2B] rounded-2xl border border-gold/40 p-6 sm:p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 text-ivory">
            <div className="flex items-center justify-between border-b border-navy-light pb-3">
              <h3 className="text-lg font-serif font-bold text-ivory flex items-center gap-2">
                <Music2 className="w-5 h-5 text-gold" />
                <span>{editingTrack.id ? 'भजन में बदलाव करें (Edit Track)' : 'नया भजन जोड़ें (Add New Track)'}</span>
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
              {/* Cover Artwork Uploader with Exact Recommended Size */}
              <MediaUploader
                label="Album Cover Artwork"
                labelHi="भजन/एल्बम का कवर फोटो (Artwork)"
                recommendedSize="1000 × 1000 पिक्सल (1:1 अनुपात, चौकोर फोटो / Square), अधिकतम 5MB"
                aspectRatioHint="aspect-square"
                value={editingTrack.coverImage || ''}
                onChange={(url) => setEditingTrack({ ...editingTrack, coverImage: url })}
                helperTextHi="चौकोर पोस्टर या फोटो यहाँ अपलोड करें।"
              />

              {/* Audio File Uploader with Exact Size Guidelines */}
              <MediaUploader
                label="Audio Recording (.mp3 / .wav)"
                labelHi="ऑडियो भजन फ़ाइल (Audio MP3 File)"
                recommendedSize="MP3, WAV, M4A फ़ाइल, अधिकतम 50MB"
                value={editingTrack.audioUrl || ''}
                onChange={(url) => setEditingTrack({ ...editingTrack, audioUrl: url })}
                fileType="AUDIO"
                helperTextHi="पापा की रिकॉर्ड की गई MP3 ऑडियो फाइल यहाँ अपलोड करें। या कोई ऑनलाइन लिंक भी डाल सकते हैं।"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    भजन का शीर्षक (हिन्दी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTrack.titleHi || ''}
                    onChange={(e) => setEditingTrack({ ...editingTrack, titleHi: e.target.value })}
                    placeholder="उदा. मंगल भवन अमंगल हारी - सुंदरकांड"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Track Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTrack.title}
                    onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })}
                    placeholder="e.g. Mangal Bhavan Amangal Hari"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={editingTrack.category}
                    onChange={(e) => setEditingTrack({ ...editingTrack, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Sundarkand">🌺 श्री सुंदरकांड पाठ (Sundarkand)</option>
                    <option value="Mata Jagran">🚩 माता का जागरण एवं चौकी (Mata Jagran)</option>
                    <option value="Khatu Shyam Sandhya">🙏 श्री खाटू श्याम संध्या (Shyam Bhajan)</option>
                    <option value="Sai Sandhya">🌼 श्री साईं संध्या (Sai Sandhya)</option>
                    <option value="Akhand Ashtayam">🪔 अखंड अष्टयाम (Akhand Ashtayam)</option>
                    <option value="Rangarang">🎤 रंगारंग व सांस्कृतिक (Cultural/Folk)</option>
                    <option value="Bhajan">✨ सामान्य भजन (Devotional Bhajan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    एल्बम / संग्रह का नाम
                  </label>
                  <input
                    type="text"
                    value={editingTrack.album || ''}
                    onChange={(e) => setEditingTrack({ ...editingTrack, album: e.target.value })}
                    placeholder="उदा. सुंदरकांड भाग १"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    अवधि (Duration जैसे 06:45)
                  </label>
                  <input
                    type="text"
                    value={editingTrack.duration || ''}
                    onChange={(e) => setEditingTrack({ ...editingTrack, duration: e.target.value })}
                    placeholder="06:30"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 p-3 rounded-xl bg-navy-light/60 border border-navy-light">
                <label className="flex items-center gap-2 text-xs font-semibold text-ivory cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTrack.isFeatured}
                    onChange={(e) => setEditingTrack({ ...editingTrack, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded accent-gold"
                  />
                  <span>होमपेज पर मुख्य भजन के रूप में दिखाएँ (Feature on Homepage)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-ivory cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTrack.published}
                    onChange={(e) => setEditingTrack({ ...editingTrack, published: e.target.checked })}
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
                  {saving ? 'सेव हो रहा है...' : 'भजन सेव करें (Save Track)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
