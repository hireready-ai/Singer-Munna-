'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('nirala@admin2026');
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
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('admin_token', data.token);
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D111C] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#151B2B] rounded-3xl border border-gold/40 p-8 sm:p-10 shadow-2xl space-y-6 text-ivory">
        {/* Brand & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#6F1D35] to-[#C7A45A] flex items-center justify-center text-ivory font-serif font-bold text-2xl mx-auto shadow-xl">
            M
          </div>
          <h1 className="text-2xl font-serif font-bold text-ivory">
            Singer Munna Kumar Nirala
          </h1>
          <p className="text-xs uppercase tracking-widest text-gold font-semibold">
            Admin CMS Portal
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
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-light border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                placeholder="Username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-light border border-gold/30 text-ivory text-sm focus:outline-none focus:border-gold"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-navy-light text-[11px] text-gray-300 border border-navy space-y-0.5">
            <p className="text-gold font-semibold">Default Credentials:</p>
            <p>Username: <code className="text-ivory bg-navy px-1 rounded">admin</code></p>
            <p>Password: <code className="text-ivory bg-navy px-1 rounded">nirala@admin2026</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold hover:bg-gold-light text-navy font-serif font-bold text-sm tracking-wide shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs text-gray-400 hover:text-gold transition inline-flex items-center gap-1"
          >
            ← Back to Customer Website
          </a>
        </div>
      </div>
    </div>
  );
}

