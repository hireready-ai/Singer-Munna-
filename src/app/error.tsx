'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#151B2B] text-ivory flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-serif font-bold text-gold mb-2">कुछ तकनीकी समस्या हुई</h2>
      <p className="text-xs sm:text-sm text-ivory/70 max-w-md mb-6">
        कृपया पुनः प्रयास करें या होमपेज पर जाएँ।
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-sm shadow-lg transition"
        >
          पुनः प्रयास करें (Try Again)
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-navy-light hover:bg-navy text-ivory font-semibold text-sm border border-gold/30 transition"
        >
          होमपेज (Home)
        </Link>
      </div>
    </div>
  );
}

