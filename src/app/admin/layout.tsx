'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Sparkles,
  BookOpen,
  Music2,
  Video,
  Image as ImageIcon,
  Calendar,
  Award,
  Inbox,
  FolderOpen,
  ScrollText,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  Layers,
  MapPin,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Skip layout shell on login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('/api/auth/me', { headers })
      .then((res) => {
        if (!res.ok) {
          if (typeof window !== 'undefined') localStorage.removeItem('admin_token');
          router.push('/admin/login');
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
        } else {
          if (typeof window !== 'undefined') localStorage.removeItem('admin_token');
          router.push('/admin/login');
        }
      })
      .catch(() => {
        if (typeof window !== 'undefined') localStorage.removeItem('admin_token');
        router.push('/admin/login');
      })
      .finally(() => setLoading(false));
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D111C] flex items-center justify-center text-ivory">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-serif text-gold">कंट्रोल पैनल लोड हो रहा है...</span>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { label: 'डैशबोर्ड (Dashboard)', href: '/admin', icon: LayoutDashboard },
    { label: 'वेबसाइट सेटिंग्स (Settings)', href: '/admin/settings', icon: Settings },
    { label: 'सुरक्षा व पासवर्ड (Security & Password)', href: '/admin/security', icon: ShieldCheck },
    { label: 'होमपेज हीरो बैनर (Hero Banner)', href: '/admin/hero', icon: Sparkles },
    { label: 'कार्यक्रम श्रेणियां (Event Types)', href: '/admin/event-types', icon: Layers },
    { label: 'सफल कार्यक्रम शहर (Locations)', href: '/admin/locations', icon: MapPin },
    { label: 'समीक्षाएं व रिव्यूज (Reviews)', href: '/admin/testimonials', icon: MessageSquare },
    { label: 'जीवन परिचय व फोटो (Biography)', href: '/admin/about', icon: BookOpen },
    { label: 'भजन व ऑडियो (Music Tracks)', href: '/admin/music', icon: Music2 },
    { label: 'वीडियो गैलरी (Videos)', href: '/admin/videos', icon: Video },
    { label: 'फोटो गैलरी (Photo Gallery)', href: '/admin/gallery', icon: ImageIcon },
    { label: 'प्रोग्राम व कैलेंडर (Events & Calendar)', href: '/admin/events', icon: Calendar },
    { label: 'सम्मान एवं प्रेस (Awards)', href: '/admin/awards', icon: Award },
    { label: 'बुकिंग अनुरोध (Booking Enquiries)', href: '/admin/bookings', icon: Inbox },
    { label: 'मीडिया लाइब्रेरी (Media Files)', href: '/admin/media', icon: FolderOpen },
    { label: 'ऑडिट लॉग्स (Audit Logs)', href: '/admin/logs', icon: ScrollText },
  ];

  return (
    <div className="min-h-screen bg-[#0D111C] flex text-ivory">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#151B2B] border-r border-gold/20 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Logo / Brand Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6F1D35] to-[#C7A45A] flex items-center justify-center text-ivory font-serif font-bold text-base shadow-md">
                M
              </div>
              <div>
                <span className="block text-sm font-serif font-bold text-ivory leading-tight">
                  मुन्ना कुमार निराला
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-gold font-semibold">
                  एडमिन कंट्रोल पैनल
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-gold text-navy font-bold shadow-md'
                      : 'text-ivory/80 hover:text-gold hover:bg-navy-light'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-navy' : 'text-gold'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Live Website Link & Logout */}
        <div className="p-4 border-t border-navy-light space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-navy-light text-xs text-gold hover:bg-navy transition font-semibold"
          >
            <span>मुख्य वेबसाइट देखें (Live Website)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/40 text-red-300 hover:bg-red-900/60 text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>लॉगआउट करें (Sign Out)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#151B2B]/90 backdrop-blur-md border-b border-gold/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-ivory hover:text-gold hover:bg-navy-light"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm sm:text-base font-serif font-bold text-ivory">
              एडमिन कंट्रोल पैनल (Admin CMS)
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/security"
              className="flex items-center gap-2 text-xs text-ivory/90 bg-navy-light hover:bg-gold hover:text-navy px-3 py-1.5 rounded-full border border-gold/20 shadow-sm transition"
              title="सुरक्षा सेटिंग्स व पासवर्ड बदलें"
            >
              <User className="w-3.5 h-3.5 text-gold" />
              <span>{user?.name || 'मुन्ना कुमार निराला'}</span>
              <span className="font-mono text-[10px] opacity-80">({user?.username || 'admin'})</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
