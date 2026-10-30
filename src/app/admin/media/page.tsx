'use client';

import React, { useState, useEffect } from 'react';
import {
  Upload,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Image as ImageIcon,
  Music,
  Video,
  FileText,
  Copy,
  Check,
  Crop,
} from 'lucide-react';
import { ImageCropperModal } from '@/components/admin/ImageCropperModal';

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<any | null>(null);

  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState('');
  const [cropperTargetName, setCropperTargetName] = useState('cropped_photo.jpg');

  const fetchAssets = () => {
    fetch('/api/media')
      .then((res) => res.json())
      .then((d) => setAssets(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropperSrc(reader.result as string);
        setCropperTargetName(file.name);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'Uploads');

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload file');
      fetchAssets();
      setMsg(`फ़ाइल "${file.name}" सफलतापूर्वक अपलोड हो गई!`);
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', croppedBlob, `crop_${Date.now()}.jpg`);
    formData.append('category', 'Uploads');

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to save cropped image');
      setCropperOpen(false);
      fetchAssets();
      setMsg('क्रॉप की गई फोटो सफलतापूर्वक मीडिया लाइब्रेरी में सेव हो गई!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving cropped image');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, force = false) => {
    try {
      const res = await fetch(`/api/media/${id}${force ? '?force=true' : ''}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.status === 409) {
        // In use warning
        setDeleteWarning({
          id,
          usages: data.usages || [],
          error: data.error,
        });
        return;
      }

      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setDeleteWarning(null);
      fetchAssets();
      setMsg('फ़ाइल सफलतापूर्वक हटा दी गई!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error deleting file');
    }
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.fileUrl.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || a.fileType === typeFilter;
    return matchesSearch && matchesType;
  });

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
            सेंट्रल मीडिया लाइब्रेरी (Central Media Library)
          </h1>
          <p className="text-xs text-gray-400">
            सभी फोटो, वीडियो, ऑडियो और पोस्टर का केंद्रीय संग्रह। सुरक्षित विलोपन (Safe Deletion Protection) सक्रिय है।
          </p>
        </div>

        <label className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'अपलोड हो रहा है...' : '+ नई फ़ाइल अपलोड करें (Upload File)'}</span>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Delete in-use warning modal */}
      {deleteWarning && (
        <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-500/60 text-amber-200 text-xs space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>सुरक्षा चेतावनी (Safe Deletion Protection)</span>
          </div>
          <p>{deleteWarning.error}</p>
          <div className="bg-navy p-3 rounded-lg border border-amber-500/30">
            <span className="font-semibold block mb-1 text-gold">यह फ़ाइल अभी वेबसाइट के इन सेक्शनों में उपयोग में है:</span>
            <ul className="list-disc list-inside space-y-0.5 text-gray-300">
              {deleteWarning.usages.map((u: string, idx: number) => (
                <li key={idx}>{u}</li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => setDeleteWarning(null)}
              className="px-4 py-1.5 rounded-lg bg-navy-light text-gray-300 hover:text-white font-semibold"
            >
              रद्द करें (फ़ाइल रखें)
            </button>
            <button
              onClick={() => handleDelete(deleteWarning.id, true)}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
            >
              फिर भी जबरन हटाएँ (Force Delete)
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#151B2B] p-4 rounded-xl border border-gold/30">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="नाम या पाथ खोजें..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'IMAGE', 'AUDIO', 'VIDEO', 'DOCUMENT'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                typeFilter === t
                  ? 'bg-gold text-navy font-bold'
                  : 'bg-navy-light text-gray-300 hover:text-gold'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredAssets.map((asset) => {
          const isCopied = copiedId === asset.id;
          return (
            <div
              key={asset.id}
              className="bg-[#151B2B] rounded-xl border border-gold/30 overflow-hidden shadow-lg flex flex-col justify-between group hover:border-gold/60 transition"
            >
              {/* Preview */}
              <div className="relative aspect-square w-full bg-navy-dark overflow-hidden flex items-center justify-center">
                {asset.fileType === 'IMAGE' ? (
                  <img
                    src={asset.fileUrl}
                    alt={asset.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/munna_nirala_hero.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : asset.fileType === 'AUDIO' ? (
                  <div className="flex flex-col items-center gap-2 text-gold">
                    <Music className="w-10 h-10" />
                    <span className="text-[10px] font-mono">AUDIO FILE</span>
                  </div>
                ) : asset.fileType === 'VIDEO' ? (
                  <div className="flex flex-col items-center gap-2 text-gold">
                    <Video className="w-10 h-10" />
                    <span className="text-[10px] font-mono">VIDEO FILE</span>
                  </div>
                ) : (
                  <FileText className="w-10 h-10 text-gold" />
                )}

                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-navy/80 border border-gold/20 text-[9px] font-bold text-gold">
                  {asset.fileType}
                </span>

                {asset.fileType === 'IMAGE' && (
                  <button
                    onClick={() => {
                      setCropperSrc(asset.fileUrl);
                      setCropperTargetName(asset.title);
                      setCropperOpen(true);
                    }}
                    className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-black/80 hover:bg-gold hover:text-navy text-gold text-[10px] font-semibold flex items-center gap-1 transition shadow border border-gold/30"
                    title="इस फोटो को क्रॉप करें"
                  >
                    <Crop className="w-3 h-3" />
                    <span>क्रॉप</span>
                  </button>
                )}
              </div>

              {/* Info & Actions */}
              <div className="p-3 space-y-2">
                <div>
                  <h4 className="text-xs font-bold text-ivory truncate" title={asset.title}>
                    {asset.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-mono truncate" title={asset.fileUrl}>
                    {asset.fileUrl}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-navy-light text-xs">
                  <button
                    onClick={() => copyUrl(asset.fileUrl, asset.id)}
                    className="p-1.5 rounded-lg bg-navy-light hover:bg-gold hover:text-navy text-gold transition flex items-center gap-1 text-[11px]"
                    title="Copy URL"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-1.5 rounded-lg bg-navy-light hover:bg-red-500 text-red-400 hover:text-white transition"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cropper Modal in Media Page */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        imageSrc={cropperSrc}
        defaultAspectRatio={16 / 9}
        aspectRatioLabel="16:9"
        recommendedSize="1920 × 1080 px"
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
