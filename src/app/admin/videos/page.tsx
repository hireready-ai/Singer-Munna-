'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Play,
  CheckCircle2,
  X,
  Video as VideoIcon,
  ExternalLink,
  Sparkles,
  Link as LinkIcon,
  Upload,
  Film,
} from 'lucide-react';
import { VideoModal, parseVideoUrl } from '@/components/VideoModal';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { adminApi } from '@/lib/admin-client';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<{ url: string; title: string } | null>(null);
  const [videoSourceMode, setVideoSourceMode] = useState<'link' | 'upload'>('link');

  const fetchVideos = () => {
    fetch('/api/videos?all=true')
      .then((res) => res.json())
      .then((d) => {
        if (Array.isArray(d)) setVideos(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenModal = (v?: any) => {
    if (v) {
      setEditingVideo(v);
      const isLocal = v.videoUrl?.startsWith('/uploads/') || /\.(mp4|webm|mov)$/i.test(v.videoUrl || '');
      setVideoSourceMode(isLocal ? 'upload' : 'link');
    } else {
      setEditingVideo({
        title: '',
        titleHi: '',
        description: '',
        descriptionHi: '',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: '/images/munna_nirala_stage.jpg',
        category: 'Mata Jagran',
        categoryHi: 'माता जागरण एवं चौकी',
        duration: '10:00',
        isFeatured: false,
        published: true,
        order: 0,
      });
      setVideoSourceMode('link');
    }
    setIsModalOpen(true);
  };

  // Helper when user types/pastes video URL
  const handleUrlChange = (url: string) => {
    const parsed = parseVideoUrl(url);
    const updates: any = { videoUrl: url };

    // Auto-suggest YouTube thumbnail if current thumbnail is default or empty
    if (parsed.type === 'youtube' && parsed.videoId) {
      if (
        !editingVideo?.thumbnail ||
        editingVideo.thumbnail === '/images/munna_nirala_stage.jpg' ||
        editingVideo.thumbnail.includes('img.youtube.com')
      ) {
        updates.thumbnail = `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`;
      }
    }

    setEditingVideo((prev: any) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo?.videoUrl?.trim()) {
      alert('कृपया वीडियो का लिंक या अपलोड की गई फ़ाइल दर्ज करें।');
      return;
    }

    setSaving(true);

    try {
      const isEdit = Boolean(editingVideo.id);
      const url = isEdit ? `/api/videos/${editingVideo.id}` : '/api/videos';
      const method = isEdit ? 'PUT' : 'POST';

      await adminApi(url, {
        method,
        body: JSON.stringify(editingVideo),
      });

      setIsModalOpen(false);
      fetchVideos();
      setMsg(isEdit ? 'वीडियो सफलतापूर्वक अपडेट हुआ!' : 'नया वीडियो सफलतापूर्वक जुड़ गया!');
      setTimeout(() => setMsg(null), 3500);
    } catch (err: any) {
      alert(err.message || 'वीडियो सेव करने में समस्या आई');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`क्या आप वीडियो "${title}" को हटाना चाहते हैं?`)) return;

    try {
      await adminApi(`/api/videos/${id}`, { method: 'DELETE' });
      fetchVideos();
      setMsg('वीडियो सफलतापूर्वक हटा दिया गया!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error deleting video');
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentParsedVideo = editingVideo?.videoUrl ? parseVideoUrl(editingVideo.videoUrl) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ivory">
            वीडियो लाइब्रेरी प्रबंधन (Videos Management)
          </h1>
          <p className="text-xs text-gray-400">
            यूट्यूब वीडियो (Shorts / Live / Full), इंस्टाग्राम रील्स, फेसबुक वीडियो जोड़ें अथवा सीधे अपने कंप्यूटर/फ़ोन से वीडियो अपलोड करें।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/videos"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-navy-light hover:bg-gold hover:text-navy text-gold text-xs font-semibold flex items-center gap-1.5 transition border border-gold/30 shadow"
          >
            <span>Videos पेज देखें</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs flex items-center gap-2 shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ नया वीडियो जोड़ें (Add Video)</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v) => {
          const parsed = parseVideoUrl(v.videoUrl);
          return (
            <div
              key={v.id}
              className="bg-[#151B2B] rounded-2xl border border-gold/30 overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-navy-dark">
                  <img
                    src={v.thumbnail || '/images/munna_nirala_stage.jpg'}
                    alt={v.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/munna_nirala_stage.jpg';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewVideo({ url: v.videoUrl, title: v.titleHi || v.title })}
                    className="absolute inset-0 bg-navy/40 flex items-center justify-center text-gold hover:text-white transition group"
                  >
                    <div className="w-12 h-12 rounded-full bg-black/60 border border-gold/50 flex items-center justify-center group-hover:scale-110 transition shadow-lg">
                      <Play className="w-6 h-6 fill-gold text-gold ml-0.5" />
                    </div>
                  </button>
                  {v.isFeatured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#6F1D35] text-[10px] text-white font-bold border border-gold/30 shadow">
                      ★ Featured Video (होमपेज)
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] text-gold font-mono border border-gold/20">
                    {parsed.type.toUpperCase()}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">
                    {v.categoryHi || v.category}
                  </span>
                  <h3 className="text-sm font-serif font-bold text-ivory line-clamp-1">{v.titleHi || v.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{v.descriptionHi || v.description}</p>
                </div>
              </div>

              <div className="p-4 bg-navy-light/40 border-t border-navy-light flex items-center justify-between text-xs">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    v.published ? 'text-emerald-400 bg-emerald-500/20' : 'text-red-400 bg-red-500/20'
                  }`}
                >
                  {v.published ? 'लाइव (Live)' : 'ड्राफ्ट (Draft)'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(v)}
                    className="p-1.5 rounded-lg bg-navy hover:bg-gold hover:text-navy text-gold transition"
                    title="बदलें (Edit)"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id, v.title)}
                    className="p-1.5 rounded-lg bg-navy hover:bg-red-500 text-red-400 hover:text-white transition"
                    title="हटाएँ (Delete)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#151B2B] rounded-2xl border border-gold/40 p-5 sm:p-7 max-w-3xl w-full shadow-2xl max-h-[92vh] overflow-y-auto space-y-5 text-ivory">
            <div className="flex items-center justify-between border-b border-navy-light pb-3">
              <h3 className="text-lg font-serif font-bold text-ivory flex items-center gap-2">
                <VideoIcon className="w-5 h-5 text-gold" />
                <span>{editingVideo.id ? 'वीडियो में बदलाव करें (Edit Video)' : 'नया वीडियो जोड़ें (Add New Video)'}</span>
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
              {/* Video Source Selection Tabs */}
              <div className="space-y-3 bg-[#192033] p-4 rounded-xl border border-gold/30">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-ivory">
                    वीडियो का स्रोत (Video Source) *
                  </label>
                  <div className="flex items-center gap-1 bg-[#101422] p-1 rounded-lg border border-gold/20">
                    <button
                      type="button"
                      onClick={() => setVideoSourceMode('link')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                        videoSourceMode === 'link'
                          ? 'bg-gold text-navy shadow'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>ऑनलाइन लिंक (URL)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSourceMode('upload')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                        videoSourceMode === 'upload'
                          ? 'bg-gold text-navy shadow'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>फ़ाइल अपलोड (Upload)</span>
                    </button>
                  </div>
                </div>

                {videoSourceMode === 'link' ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-gold font-medium">
                      <span>YouTube, Instagram Reels, Facebook Video, या डायरेक्ट वीडियो लिंक पेस्ट करें:</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={editingVideo.videoUrl || ''}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="उदा. https://www.youtube.com/watch?v=... या https://instagram.com/reel/..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold font-mono"
                    />
                    <div className="flex flex-wrap gap-2 text-[10px] text-gray-400 pt-1">
                      <span className="px-2 py-0.5 rounded bg-navy-light/60 border border-gold/15">
                        ✓ YouTube Video & Shorts
                      </span>
                      <span className="px-2 py-0.5 rounded bg-navy-light/60 border border-gold/15">
                        ✓ Instagram Reels & Posts
                      </span>
                      <span className="px-2 py-0.5 rounded bg-navy-light/60 border border-gold/15">
                        ✓ Facebook Video & Watch
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <MediaUploader
                      label="Upload Video from Computer/Phone"
                      labelHi="कंप्यूटर या मोबाइल से MP4 / WebM वीडियो फ़ाइल चुनें"
                      recommendedSize="MP4, WebM, MOV फ़ाइल, अधिकतम 50MB"
                      value={
                        editingVideo.videoUrl?.startsWith('/uploads/') || /\.(mp4|webm|mov)$/i.test(editingVideo.videoUrl || '')
                          ? editingVideo.videoUrl
                          : ''
                      }
                      onChange={(url) => setEditingVideo({ ...editingVideo, videoUrl: url })}
                      fileType="VIDEO"
                      helperTextHi="आपकी वीडियो फ़ाइल सीधे वेबसाइट के सर्वर पर अपलोड होगी और तुरंत ग्राहक देख सकेंगे।"
                    />
                  </div>
                )}

                {/* Instant Video Test / Preview Bar */}
                {editingVideo.videoUrl && (
                  <div className="pt-2 flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-gold/20 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <Film className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="truncate text-gray-300 font-mono text-[11px]">
                        {editingVideo.videoUrl}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewVideo({
                          url: editingVideo.videoUrl,
                          title: editingVideo.titleHi || editingVideo.title || 'वीडियो प्रीव्यू',
                        })
                      }
                      className="px-3 py-1 rounded bg-gold/20 hover:bg-gold hover:text-navy text-gold font-semibold text-xs border border-gold/40 flex items-center gap-1 transition flex-shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>चलाकर देखें (Play)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnail Image Uploader */}
              <MediaUploader
                label="Video Thumbnail Image"
                labelHi="वीडियो थंबनेल फोटो (Thumbnail)"
                recommendedSize="1280 × 720 पिक्सल (16:9 आड़ा फोटो / Landscape), अधिकतम 5MB"
                aspectRatioHint="aspect-video"
                value={editingVideo.thumbnail || ''}
                onChange={(url) => setEditingVideo({ ...editingVideo, thumbnail: url })}
                helperTextHi="यूट्यूब लिंक डालने पर थंबनेल अपने-आप आ जाता है, या आप यहाँ अपनी मनपसंद फोटो भी अपलोड कर सकते हैं।"
              />

              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    वीडियो का नाम (हिन्दी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVideo.titleHi || ''}
                    onChange={(e) => setEditingVideo({ ...editingVideo, titleHi: e.target.value })}
                    placeholder="उदा. भव्य माता की चौकी एवं जागरण लाइव"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Video Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingVideo.title || ''}
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    placeholder="e.g. Grand Mata Ki Chowki Live"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    श्रेणी (Category)
                  </label>
                  <select
                    value={editingVideo.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      let catHi = 'माता जागरण';
                      if (cat === 'Sundarkand') catHi = 'श्री सुंदरकांड पाठ';
                      else if (cat === 'Khatu Shyam Sandhya') catHi = 'श्री खाटू श्याम संध्या';
                      else if (cat === 'Jhanki') catHi = 'सजीव झाँकी कार्यक्रम';
                      else if (cat === 'Concert') catHi = 'लाइव मंच प्रस्तुतियां';
                      else if (cat === 'Shorts') catHi = 'शॉर्ट्स व क्लिप्स';
                      setEditingVideo({ ...editingVideo, category: cat, categoryHi: catHi });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="Mata Jagran">🚩 माता जागरण एवं चौकी (Mata Jagran)</option>
                    <option value="Sundarkand">🌺 श्री सुंदरकांड पाठ (Sundarkand)</option>
                    <option value="Khatu Shyam Sandhya">🙏 श्री खाटू श्याम संध्या (Shyam Bhajan)</option>
                    <option value="Jhanki">🎭 सजीव झाँकी कार्यक्रम (Jhanki Prastuti)</option>
                    <option value="Concert">🎤 लाइव मंच प्रस्तुतियां (Live Concert)</option>
                    <option value="Shorts">⚡ शॉर्ट्स / रील्स / क्लिप्स (Shorts)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    अवधि (Duration जैसे 12:35)
                  </label>
                  <input
                    type="text"
                    value={editingVideo.duration || ''}
                    onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    placeholder="12:30"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  विवरण / कार्यक्रम की जानकारी (Description)
                </label>
                <textarea
                  rows={2}
                  value={editingVideo.descriptionHi || editingVideo.description || ''}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      descriptionHi: e.target.value,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 p-3 rounded-xl bg-navy-light/60 border border-navy-light">
                <label className="flex items-center gap-2 text-xs font-semibold text-ivory cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVideo.isFeatured}
                    onChange={(e) => setEditingVideo({ ...editingVideo, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded accent-gold"
                  />
                  <span>होमपेज पर मुख्य वीडियो के रूप में दिखाएँ (Featured on Homepage)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-ivory cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingVideo.published}
                    onChange={(e) => setEditingVideo({ ...editingVideo, published: e.target.checked })}
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
                  {saving ? 'सेव हो रहा है...' : 'वीडियो सेव करें (Save Video)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <VideoModal
        isOpen={Boolean(previewVideo)}
        onClose={() => setPreviewVideo(null)}
        videoUrl={previewVideo?.url || ''}
        title={previewVideo?.title || ''}
      />
    </div>
  );
}
