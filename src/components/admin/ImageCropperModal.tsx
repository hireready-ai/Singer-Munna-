'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Crop,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Check,
  Upload,
  Sparkles,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  defaultAspectRatio?: number; // width / height, e.g. 16/9, 1, 3/4, 4/3, 4/5
  aspectRatioLabel?: string;
  recommendedSize?: string;
  onCropComplete: (croppedBlob: Blob, croppedDataUrl: string) => void;
  onDirectUpload?: () => void;
}

export function ImageCropperModal({
  isOpen,
  onClose,
  imageSrc,
  defaultAspectRatio = 16 / 9,
  aspectRatioLabel = '16:9',
  recommendedSize = '1920 × 1080 px',
  onCropComplete,
  onDirectUpload,
}: ImageCropperModalProps) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(defaultAspectRatio);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAspectRatio(defaultAspectRatio);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, defaultAspectRatio, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  // Aspect ratio presets
  const presets = [
    { label: '16:9 (बैनर / वीडियो)', ratio: 16 / 9, tag: '16:9' },
    { label: '1:1 (गाना कवर)', ratio: 1, tag: '1:1' },
    { label: '3:4 (पोर्ट्रेट फोटो)', ratio: 3 / 4, tag: '3:4' },
    { label: '4:3 (स्टेज / गैलरी)', ratio: 4 / 3, tag: '4:3' },
    { label: '4:5 (इवेंट पोस्टर)', ratio: 4 / 5, tag: '4:5' },
    { label: 'मूल / Free Crop', ratio: null, tag: 'Free' },
  ];

  // Mouse & Touch Pan Handling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Perform High-Resolution Crop to Canvas
  const handleCropAndSave = async () => {
    setProcessing(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Target resolution based on aspect ratio
      let targetWidth = 1920;
      let targetHeight = 1080;

      if (aspectRatio) {
        if (aspectRatio === 1) {
          targetWidth = 1200;
          targetHeight = 1200;
        } else if (aspectRatio === 3 / 4) {
          targetWidth = 1200;
          targetHeight = 1600;
        } else if (aspectRatio === 4 / 3) {
          targetWidth = 1600;
          targetHeight = 1200;
        } else if (aspectRatio === 4 / 5) {
          targetWidth = 1080;
          targetHeight = 1350;
        } else if (aspectRatio === 16 / 9) {
          targetWidth = 1920;
          targetHeight = 1080;
        } else {
          targetWidth = 1600;
          targetHeight = Math.round(1600 / aspectRatio);
        }
      } else {
        targetWidth = img.naturalWidth || 1600;
        targetHeight = img.naturalHeight || 1200;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Fill background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Apply transformations: zoom, rotation, pan
      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Translate pan proportional to canvas
      const scaleFactor = targetWidth / (containerRef.current?.clientWidth || targetWidth);
      ctx.translate(offset.x * scaleFactor, offset.y * scaleFactor);

      // Draw image centered
      const drawWidth = (img.naturalWidth / img.naturalHeight) >= (targetWidth / targetHeight)
        ? (targetHeight * (img.naturalWidth / img.naturalHeight))
        : targetWidth;
      const drawHeight = drawWidth / (img.naturalWidth / img.naturalHeight);

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      // Convert canvas to Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert('फोटो क्रॉप करने में त्रुटि आई');
            setProcessing(false);
            return;
          }
          const croppedUrl = URL.createObjectURL(blob);
          onCropComplete(blob, croppedUrl);
          setProcessing(false);
          onClose();
        },
        'image/jpeg',
        0.92
      );
    } catch (err: any) {
      console.error('Crop error:', err);
      alert('क्रॉप करने में समस्या: ' + (err.message || 'Error'));
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#151B2B] border-2 border-gold/50 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-4 bg-[#192033] border-b border-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold/20 text-gold flex items-center justify-center border border-gold/40">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-ivory flex items-center gap-2">
                <span>फोटो क्रॉप व सेट करें</span>
                <span className="text-xs text-gold font-sans font-normal">(Smart Image Cropper)</span>
              </h2>
              <p className="text-xs text-gray-400">
                फोटो को घुमाएँ, ज़ूम करें और अपने मनपसंद साइज़ में सेट करके अपलोड करें।
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-navy-light text-gray-400 hover:text-white hover:bg-navy flex items-center justify-center transition border border-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recommended Size Bar */}
        <div className="px-4 py-2 bg-gold/10 border-b border-gold/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-gold font-medium">
            <Sparkles className="w-4 h-4 text-gold-light" />
            <span>
              <strong>अनुशंसित साइज़ (Recommended Size):</strong> {recommendedSize}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">अनुपात चुनें:</span>
            {presets.map((p) => {
              const isSelected =
                p.ratio === aspectRatio || (p.ratio === null && aspectRatio === null);
              return (
                <button
                  key={p.tag}
                  type="button"
                  onClick={() => setAspectRatio(p.ratio)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    isSelected
                      ? 'bg-gold text-navy shadow font-bold'
                      : 'bg-navy-light text-gray-300 hover:text-gold border border-gold/30'
                  }`}
                >
                  {p.tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Canvas / Viewport */}
        <div className="relative flex-1 bg-black/90 min-h-[320px] sm:min-h-[420px] overflow-hidden flex items-center justify-center select-none p-4">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative overflow-hidden border-2 border-gold rounded-xl shadow-2xl cursor-grab active:cursor-grabbing flex items-center justify-center bg-black/50 ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
            style={{
              width: aspectRatio ? 'min(100%, 640px)' : 'min(100%, 640px)',
              aspectRatio: aspectRatio ? `${aspectRatio}` : 'auto',
              maxHeight: '60vh',
            }}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              draggable={false}
              className="max-w-none transition-transform pointer-events-none"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                maxHeight: aspectRatio ? '150%' : '100%',
              }}
            />

            {/* Grid overlay for rule of thirds */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-gold/30">
              <div className="border-r border-b border-gold/20" />
              <div className="border-r border-b border-gold/20" />
              <div className="border-b border-gold/20" />
              <div className="border-r border-b border-gold/20" />
              <div className="border-r border-b border-gold/20" />
              <div className="border-b border-gold/20" />
              <div className="border-r border-gold/20" />
              <div className="border-r border-gold/20" />
              <div />
            </div>

            {/* Hint overlay */}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/70 text-gray-300 text-[10px] backdrop-blur-sm pointer-events-none flex items-center gap-1.5">
              <Maximize2 className="w-3 h-3 text-gold" />
              <span>फोटो को खींचकर (Drag) बीच में सेट करें</span>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="p-3 bg-[#192033] border-t border-gold/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Zoom & Rotate controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ZoomOut className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-24 sm:w-36 accent-gold cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-gold" />
              <span className="text-[11px] text-gray-300 font-mono w-10">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Rotate Button */}
            <button
              type="button"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="px-3 py-1.5 rounded-lg bg-navy hover:bg-gold hover:text-navy text-gold text-xs font-semibold flex items-center gap-1.5 transition border border-gold/30"
              title="फोटो 90 डिग्री घुमाएँ"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>घुमाएँ ({rotation}°)</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setOffset({ x: 0, y: 0 });
              }}
              className="px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white text-xs transition"
              title="रीसेट करें"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onDirectUpload && (
              <button
                type="button"
                onClick={onDirectUpload}
                disabled={processing}
                className="px-3 py-2 rounded-xl bg-navy hover:bg-navy-light text-gray-300 text-xs font-medium border border-gray-600 transition"
              >
                बिना क्रॉप किए अपलोड करें
              </button>
            )}

            <button
              type="button"
              onClick={handleCropAndSave}
              disabled={processing}
              className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition disabled:opacity-50"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>क्रॉप व अपलोड हो रहा है...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>क्रॉप करें और लाइव करें (Crop & Save)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

