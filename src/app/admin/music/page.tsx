'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Play,
  Pause,
  CheckCircle2,
  X,
  Music2,
  ExternalLink,
  Upload,
  Link as LinkIcon,
  Volume2,
} from 'lucide-react';
import { useAudio } from '@/lib/audio-context';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { adminApi } from '@/lib/admin-client';

export default function AdminMusicPage() {
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrack, setEditingTrack] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [audioSourceMode, setAudioSourceMode] = useState<'upload' | 'link'>('upload');

  const fetchTracks = () => {
    fetch('/api/music?all=true')
      .then((res) => res.json())
      .then((d) => {
        if (Array.isArray(d)) setTracks(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleOpenModal = (track?: any) => {
    if (track) {
      setEditingTrack(track);
      const isExternalLink = track.audioUrl?.startsWith('http') && !track.audioUrl.includes(window?.location?.hostname || '');
      setAudioSourceMode(isExternalLink ? 'link' : 'upload');
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
      setAudioSourceMode('upload');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack?.audioUrl?.trim()) {
      alert('कृपया भजन की ऑडियो फ़ाइल या लिंक दर्ज करें।');
      return;
    }

    setSaving(true);

    try {
      const isEdit = Boolean(editingTrack.id);
      const url = isEdit ? `/api/music/${editingTrack.id}` : '/api/music';
      const method = isEdit ? 'PUT' : 'POST';

      await adminApi(url, {
        method,
        body: JSON.stringify(editingTrack),
      });

      setIsModalOpen(false);
      fetchTracks();
      setMsg(isEdit ? 'भजन विवरण सफलतापूर्वक अपडेट हुआ!' : 'नया भजन सफलतापूर्वक जुड़ गया!');
      setTimeout(() => setMsg(null), 3500);
    } catch (err: any) {
      alert(err.message || 'भजन सेव करने में समस्या आई');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`क्या आप भजन "${title}" को हटाना चाहते हैं?`)) return;

    try {
      await adminApi(`/api/music/${id}`, { method: 'DELETE' });
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
            यहाँ से नए रिकॉर्ड किए गए भजन (MP3) अपलोड करें या ऑनलाइन लिंक जोड़ें। होमपेज और Music प्लेयर में तुरंत उपलब्ध होगा।
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
            <span>+ नया भजन जोड़ें (Add Bhajan)</span>
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
            <thead className="bg-[#192033] text-gold uppercase tracking-wider font-semibold border-b border-gold/20">
              <tr>
                <th className="p-4 w-12 text-center">चलाएँ</th>
                <th className="p-4">शीर्षक व एल्बम</th>
                <th className="p-4">श्रेणी</th>
                <th className="p-4">अवधि</th>
                <th className="p-4">स्थिति</th>
                <th className="p-4 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-light/60">
              {tracks.map((track) => {
                const isThisPlaying = isPlaying && currentTrack?.id === track.id;
                return (
                  <tr key={track.id} className="hover:bg-navy-light/30 transition">
                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          playTrack({
                            id: track.id,
                            title: track.title,
                            titleHi: track.titleHi || track.title,
                            artist: 'गायक मुन्ना कुमार निराला',
                            album: track.albumHi || track.album,
                            audioUrl: track.audioUrl,
                            coverImage: track.coverImage || '/images/munna_nirala_hero.jpg',
                            duration: track.duration || '05:00',
                          })
                        }
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow ${
                          isThisPlaying
                            ? 'bg-gold text-navy shadow-gold/50'
                            : 'bg-navy-light hover:bg-gold hover:text-navy text-gold'
                        }`}
                      >
                        {isThisPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={track.coverImage || '/images/munna_nirala_hero.jpg'}
                          alt={track.title}
                          className="w-10 h-10 rounded-lg object-cover border border-gold/30 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/munna_nirala_hero.jpg';
                          }}
                        />
                        <div>
                          <p className="font-serif font-bold text-ivory text-sm">
                            {track.titleHi || track.title}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {track.albumHi || track.album} • {track.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-navy-light text-gold border border-gold/20">
                        {track.categoryHi || track.category}
                      </span>
                    </td>

                    <td className="p-4 text-gray-300 font-mono text-[11px]">
                      {track.duration || '05:00'}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            track.published ? 'text-emerald-400 bg-emerald-500/20' : 'text-red-400 bg-red-500/20'
                          }`}
                        >
                          {track.published ? 'लाइव' : 'ड्राफ्ट'}
                        </span>
                        {track.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6F1D35] text-gold-light border border-gold/30">
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#151B2B] rounded-2xl border border-gold/40 p-5 sm:p-7 max-w-3xl w-full shadow-2xl max-h-[92vh] overflow-y-auto space-y-5 text-ivory">
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
              {/* Cover Artwork Uploader */}
              <MediaUploader
                label="Album Cover Artwork"
                labelHi="भजन/एल्बम का कवर फोटो (Artwork)"
                recommendedSize="1000 × 1000 पिक्सल (1:1 अनुपात, चौकोर फोटो / Square), अधिकतम 5MB"
                aspectRatioHint="aspect-square"
                value={editingTrack.coverImage || ''}
                onChange={(url) => setEditingTrack({ ...editingTrack, coverImage: url })}
                helperTextHi="चौकोर पोस्टर या फोटो यहाँ अपलोड करें।"
              />

              {/* Audio Source Selector */}
              <div className="space-y-3 bg-[#192033] p-4 rounded-xl border border-gold/30">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-ivory">
                    ऑडियो फ़ाइल या लिंक (Audio Recording / MP3) *
                  </label>
                  <div className="flex items-center gap-1 bg-[#101422] p-1 rounded-lg border border-gold/20">
                    <button
                      type="button"
                      onClick={() => setAudioSourceMode('upload')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                        audioSourceMode === 'upload'
                          ? 'bg-gold text-navy shadow'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>फ़ाइल अपलोड (Upload MP3)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAudioSourceMode('link')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                        audioSourceMode === 'link'
                          ? 'bg-gold text-navy shadow'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>ऑनलाइन ऑडियो लिंक</span>
                    </button>
                  </div>
                </div>

                {audioSourceMode === 'upload' ? (
                  <MediaUploader
                    label="Audio Recording (.mp3 / .wav / .m4a)"
                    labelHi="कंप्यूटर या मोबाइल से MP3 ऑडियो फ़ाइल चुनें"
                    recommendedSize="MP3, WAV, M4A, OGG फ़ाइल, अधिकतम 50MB"
                    value={editingTrack.audioUrl || ''}
                    onChange={(url) => setEditingTrack({ ...editingTrack, audioUrl: url })}
                    fileType="AUDIO"
                    helperTextHi="पापा की रिकॉर्ड की गई MP3 ऑडियो फाइल यहाँ अपलोड करें। यह तुरंत वेबसाइट पर लाइव हो जाएगी।"
                  />
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-gold font-medium">
                      किसी भी ऑनलाइन MP3, ऑडियो सीडीएन, या क्लाउड स्टोरेज का डायरेक्ट लिंक डालें:
                    </p>
                    <input
                      type="text"
                      required
                      value={editingTrack.audioUrl || ''}
                      onChange={(e) => setEditingTrack({ ...editingTrack, audioUrl: e.target.value })}
                      placeholder="उदा. https://.../bhajan.mp3"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold font-mono"
                    />
                  </div>
                )}

                {/* Instant Audio Listen Bar */}
                {editingTrack.audioUrl && (
                  <div className="pt-2 bg-black/40 p-3 rounded-lg border border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <Volume2 className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="text-xs text-gray-300 truncate font-mono text-[11px]">
                        {editingTrack.audioUrl}
                      </span>
                    </div>
                    <audio
                      src={editingTrack.audioUrl}
                      controls
                      className="h-8 max-w-full sm:max-w-xs"
                    />
                  </div>
                )}
              </div>

              {/* Title Fields */}
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
                    value={editingTrack.title || ''}
                    onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })}
                    placeholder="e.g. Mangal Bhavan Amangal Hari"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Category, Album, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={editingTrack.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      let catHi = 'भजन';
                      if (cat === 'Sundarkand') catHi = 'श्री सुंदरकांड पाठ';
                      else if (cat === 'Mata Jagran') catHi = 'माता जागरण एवं चौकी';
                      else if (cat === 'Khatu Shyam Sandhya') catHi = 'श्री खाटू श्याम संध्या';
                      else if (cat === 'Sai Sandhya') catHi = 'श्री साईं संध्या';
                      else if (cat === 'Akhand Ashtayam') catHi = 'अखंड अष्टयाम';
                      else if (cat === 'Rangarang') catHi = 'रंगारंग व सांस्कृतिक';
                      setEditingTrack({ ...editingTrack, category: cat, categoryHi: catHi });
                    }}
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
                    onChange={(e) => setEditingTrack({ ...editingTrack, album: e.target.value, albumHi: e.target.value })}
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

              {/* External Links (YouTube / Spotify) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    यूट्यूब वीडियो लिंक (वैकल्पिक / Optional)
                  </label>
                  <input
                    type="text"
                    value={editingTrack.youtubeUrl || ''}
                    onChange={(e) => setEditingTrack({ ...editingTrack, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-3.5 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Spotify लिंक (वैकल्पिक / Optional)
                  </label>
                  <input
                    type="text"
                    value={editingTrack.spotifyUrl || ''}
                    onChange={(e) => setEditingTrack({ ...editingTrack, spotifyUrl: e.target.value })}
                    placeholder="https://open.spotify.com/track/..."
                    className="w-full px-3.5 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
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
                  {saving ? 'सेव हो रहा है...' : 'भजन सेव करें (Save Bhajan)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
