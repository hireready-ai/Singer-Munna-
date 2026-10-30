'use client';

import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  FolderOpen,
  CheckCircle2,
  X,
  RefreshCw,
  Sparkles,
  Music,
  Video,
  Crop,
} from 'lucide-react';
import { ImageCropperModal } from './ImageCropperModal';
import { adminApi } from '@/lib/admin-client';

interface MediaUploaderProps {
  label: string;
  labelHi: string;
  recommendedSize: string; // e.g. "1920 × 1080 px (16:9 आड़ा फोटो / Landscape)"
  aspectRatioHint?: string; // e.g. "aspect-video" or "aspect-[3/4]" or "aspect-square" or "aspect-[4/3]"
  value: string;
  onChange: (url: string) => void;
  fileType?: 'IMAGE' | 'AUDIO' | 'VIDEO';
  helperText?: string;
  helperTextHi?: string;
}

export function MediaUploader({
  label,
  labelHi,
  recommendedSize,
  aspectRatioHint = 'aspect-video',
  value,
  onChange,
  fileType = 'IMAGE',
  helperText,
  helperTextHi,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<any[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string>('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Determine aspect ratio number from aspect ratio hint
  let defaultRatio = 16 / 9;
  let ratioTag = '16:9';
  if (aspectRatioHint.includes('square')) {
    defaultRatio = 1;
    ratioTag = '1:1';
  } else if (aspectRatioHint.includes('3/4')) {
    defaultRatio = 3 / 4;
    ratioTag = '3:4';
  } else if (aspectRatioHint.includes('4/3')) {
    defaultRatio = 4 / 3;
    ratioTag = '4:3';
  } else if (aspectRatioHint.includes('4/5')) {
    defaultRatio = 4 / 5;
    ratioTag = '4:5';
  }

  const fetchLibrary = () => {
    setLibraryLoading(true);
    adminApi(`/api/media${fileType !== 'IMAGE' ? `?type=${fileType}` : ''}`)
      .then((data) => {
        if (Array.isArray(data)) setLibraryAssets(data);
      })
      .catch(console.error)
      .finally(() => setLibraryLoading(false));
  };

  // Direct raw upload helper
  const performUpload = async (fileOrBlob: File | Blob, customName?: string) => {
    setUploading(true);
    const formData = new FormData();
    const filename = customName || (fileOrBlob instanceof File ? fileOrBlob.name : `crop-${Date.now()}.jpg`);
    formData.append('file', fileOrBlob, filename);
    formData.append('category', 'Uploaded');

    try {
      const data = await adminApi('/api/media', {
        method: 'POST',
        body: formData,
      });

      const finalUrl = data.fileUrl || data.url;
      if (!finalUrl) throw new Error('File URL not returned');
      onChange(finalUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      return finalUrl;
    } catch (err: any) {
      alert(`अपलोड में समस्या: ${err.message || 'Error uploading file'}`);
    } finally {
      setUploading(false);
    }
  };

  // When user selects a file from disk
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileType === 'IMAGE') {
      setPendingFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCropperImageSrc(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    } else {
      // Audio or Video: Direct Upload
      performUpload(file);
      e.target.value = '';
    }
  };

  // When Crop is confirmed in Cropper Modal
  const handleCropComplete = async (croppedBlob: Blob) => {
    await performUpload(croppedBlob, `crop_${Date.now()}.jpg`);
    setCropperOpen(false);
    setPendingFile(null);
  };

  // Direct upload without crop option
  const handleDirectUploadBypass = async () => {
    if (pendingFile) {
      await performUpload(pendingFile);
      setCropperOpen(false);
      setPendingFile(null);
    }
  };

  // Re-crop existing image
  const handleRecropExisting = () => {
    if (!value) return;
    setCropperImageSrc(value);
    setPendingFile(null);
    setCropperOpen(true);
  };

  return (
    <div className="space-y-2 bg-[#192033] p-4 rounded-xl border border-gold/30">
      {/* Label and Recommended Size Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <span className="block text-xs font-bold text-ivory tracking-wide">
            {labelHi} / <span className="text-gray-300 font-normal">{label}</span>
          </span>
          {(helperText || helperTextHi) && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              {helperTextHi || helperText}
            </p>
          )}
        </div>

        {/* Recommended Size Box */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold/15 border border-gold/40 text-[11px] text-gold font-medium">
          <Sparkles className="w-3.5 h-3.5 text-gold-light flex-shrink-0" />
          <span>
            <strong>सही साइज़ (Recommended):</strong> {recommendedSize}
          </span>
        </div>
      </div>

      {/* Main Preview and Action Box */}
      <div className="pt-2 flex flex-col md:flex-row gap-4 items-start">
        {/* Preview Container */}
        {value ? (
          <div className="relative w-full md:w-64 max-w-sm rounded-xl overflow-hidden border-2 border-gold/50 bg-black/60 shadow-lg group">
            {fileType === 'IMAGE' && (
              <img
                src={value}
                alt="Active Live Preview"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/munna_nirala_hero.jpg';
                }}
                className={`w-full ${aspectRatioHint} object-cover`}
              />
            )}

            {fileType === 'AUDIO' && (
              <div className="p-4 flex flex-col items-center gap-2 text-gold">
                <Music className="w-8 h-8 animate-bounce" />
                <span className="text-xs font-semibold text-ivory truncate max-w-full">
                  ऑडियो फ़ाइल चयनित है (Audio Selected)
                </span>
                <audio src={value} controls className="w-full h-8 mt-1" />
              </div>
            )}

            {fileType === 'VIDEO' && (
              <div className="w-full aspect-video bg-black flex items-center justify-center">
                {value.includes('youtube.com') || value.includes('youtu.be') ? (
                  <span className="text-xs text-gold font-semibold p-2 text-center">
                    यूट्यूब वीडियो लिंक (YouTube Link)
                  </span>
                ) : (
                  <video src={value} controls className="w-full h-full object-cover" />
                )}
              </div>
            )}

            {/* Overlay Status Badge */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-700/90 text-white text-[10px] font-bold flex items-center gap-1 shadow">
              <CheckCircle2 className="w-3 h-3" />
              <span>लाइव है (Live)</span>
            </div>

            {/* Crop Button Overlay for Images */}
            {fileType === 'IMAGE' && (
              <button
                type="button"
                onClick={handleRecropExisting}
                className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/80 hover:bg-gold hover:text-navy text-gold text-[10px] font-bold flex items-center gap-1 transition shadow border border-gold/40"
                title="फोटो को मनपसंद साइज़ में क्रॉप करें"
              >
                <Crop className="w-3 h-3" />
                <span>क्रॉप करें (Crop)</span>
              </button>
            )}

            {/* Remove button */}
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-500 transition shadow"
              title="हटाएँ (Remove)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-full md:w-64 h-36 rounded-xl border-2 border-dashed border-gray-600 bg-navy/50 flex flex-col items-center justify-center text-center p-4">
            <ImageIcon className="w-8 h-8 text-gray-500 mb-1" />
            <span className="text-xs text-gray-400 font-medium">कोई फ़ाइल नहीं चुनी गई</span>
            <span className="text-[10px] text-gray-500">(No file selected yet)</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex-1 space-y-3 w-full">
          <div className="flex flex-wrap items-center gap-2">
            {/* Direct Upload Button from Computer/Mobile with Built-in Cropper */}
            <label className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer">
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-navy" />
                  <span>अपलोड हो रहा है... (Uploading...)</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>
                    {value ? 'दूसरी फोटो बदलें व क्रॉप करें (Change & Crop)' : 'कंप्यूटर/फ़ोन से चुनें (Choose File)'}
                  </span>
                </>
              )}
              <input
                type="file"
                accept={
                  fileType === 'IMAGE'
                    ? 'image/*'
                    : fileType === 'AUDIO'
                    ? 'audio/*'
                    : 'video/*'
                }
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {/* Choose from Media Library */}
            <button
              type="button"
              onClick={() => {
                fetchLibrary();
                setLibraryOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-navy-light hover:bg-navy border border-gold/40 text-gold text-xs font-semibold flex items-center gap-2 transition"
            >
              <FolderOpen className="w-4 h-4" />
              <span>लाइब्रेरी से चुनें (Pick from Library)</span>
            </button>
          </div>

          {/* Current URL Input (for external links or custom path) */}
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">
              फ़ाइल का पाथ या वेब लिंक (File Path / URL):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="/uploads/... या https://..."
                className="w-full px-3 py-1.5 rounded-lg bg-navy-light/80 border border-gold/25 text-ivory text-xs font-mono focus:outline-none focus:border-gold"
              />
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(value);
                    alert('लिंक कॉपी हो गया!');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-navy hover:bg-navy-light text-gold text-[11px] font-semibold border border-gold/30 whitespace-nowrap"
                >
                  कॉपी
                </button>
              )}
            </div>
          </div>

          {uploadSuccess && (
            <div className="text-emerald-400 text-xs flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>फ़ाइल सफलतापूर्वक अपलोड होकर सेट हो गई है!</span>
            </div>
          )}
        </div>
      </div>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => {
          setCropperOpen(false);
          setPendingFile(null);
        }}
        imageSrc={cropperImageSrc}
        defaultAspectRatio={defaultRatio}
        aspectRatioLabel={ratioTag}
        recommendedSize={recommendedSize}
        onCropComplete={handleCropComplete}
        onDirectUpload={pendingFile ? handleDirectUploadBypass : undefined}
      />

      {/* Media Library Selector Modal */}
      {libraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#151B2B] border-2 border-gold/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 bg-[#192033] border-b border-gold/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gold">
                <FolderOpen className="w-5 h-5" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-ivory">
                  मीडिया लाइब्रेरी से चुनें (Select from Library)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="w-7 h-7 rounded-full bg-navy-light text-gray-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {libraryLoading ? (
                <div className="py-12 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-gold animate-spin" />
                </div>
              ) : libraryAssets.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs">
                  कोई मीडिया फ़ाइल नहीं मिली। कृपया सीधे अपने फ़ोन या कंप्यूटर से अपलोड करें।
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {libraryAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => {
                        onChange(asset.fileUrl);
                        setLibraryOpen(false);
                      }}
                      className="group cursor-pointer rounded-xl border border-gold/20 hover:border-gold bg-navy-light/40 overflow-hidden flex flex-col justify-between transition hover:shadow-lg"
                    >
                      <div className="aspect-square bg-black/50 overflow-hidden flex items-center justify-center">
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
                          <Music className="w-8 h-8 text-gold" />
                        ) : (
                          <Video className="w-8 h-8 text-gold" />
                        )}
                      </div>
                      <div className="p-2 text-[10px]">
                        <p className="text-ivory font-medium truncate">{asset.title}</p>
                        <p className="text-gray-400 truncate text-[9px]">{asset.filename}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-[#192033] border-t border-gold/20 flex justify-end">
              <button
                type="button"
                onClick={() => setLibraryOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-navy-light text-gray-300 text-xs hover:text-white"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
