'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      let data: any = null;
      const responseText = await res.text();
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        if (!res.ok) {
          throw new Error(`सर्वर से अमान्य उत्तर प्राप्त हुआ (Status ${res.status})। कृपया सुनिश्चित करें कि सर्वर चालू है।`);
        }
        throw new Error('सर्वर का डेटा सही प्रारूप (JSON) में नहीं है।');
      }

      if (!res.ok) {
        throw new Error(data.error || 'अमान्य क्रेडेंशियल्स (Invalid username or password)');
      }

      if (data.token) {
        localStorage.setItem('admin_token', data.token);
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'लॉगिन विफल रहा (Invalid credentials)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D111C] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#151B2B] rounded-3xl border border-gold/40 p-8 sm:p-10 shadow-2xl space-y-6 text-ivory">
        {/* Brand & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#6F1D35] to-[#C7A45A] flex items-center justify-center text-ivory font-serif font-bold text-2xl mx-auto shadow-xl ring-2 ring-gold/40">
            M
          </div>
          <h1 className="text-2xl font-serif font-bold text-ivory">
            Singer Munna Kumar Nirala
          </h1>
          <p className="text-xs uppercase tracking-widest text-gold font-semibold">
            सुरक्षित एडमिन कंट्रोल पैनल (Secure Admin Portal)
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
              यूज़रनेम (Username)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-light border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold transition placeholder-gray-500"
                placeholder="अपना एडमिन यूज़रनेम दर्ज करें"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
              पासवर्ड (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-navy-light border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold transition placeholder-gray-500"
                placeholder="अपना सुरक्षित पासवर्ड दर्ज करें"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold p-1 transition"
                title={showPassword ? 'पासवर्ड छुपाएं' : 'पासवर्ड देखें'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-navy font-serif font-bold text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>सुरक्षित लॉगिन करें (Sign In Securely)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-navy-light/60 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted Admin Access</span>
          </div>

          <a
            href="/"
            className="text-xs text-gray-400 hover:text-gold transition inline-flex items-center gap-1 mt-1"
          >
            ← मुख्य वेबसाइट पर वापस जाएँ (Back to Customer Website)
          </a>
        </div>
      </div>
    </div>
  );
}
