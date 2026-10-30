'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Music2,
  Video,
  Image as ImageIcon,
  Calendar,
  Inbox,
  Sparkles,
  ArrowRight,
  Plus,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle,
  Layers,
  MapPin,
  MessageSquare,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const counts = data?.counts || {};
  const recentEnquiries = data?.recentEnquiries || [];
  const recentLogs = data?.recentLogs || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy via-[#192033] to-[#6F1D35]/40 rounded-2xl border border-gold/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">
            Singer Munna Kumar Nirala Official CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
            Welcome to the Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70">
            Real-time management for customer website, media library, events, music, and booking enquiries.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/music"
            className="px-3.5 py-2 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs flex items-center gap-1.5 shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Track</span>
          </Link>
          <Link
            href="/admin/events"
            className="px-3.5 py-2 rounded-xl bg-[#6F1D35] hover:bg-[#872441] text-ivory font-bold text-xs flex items-center gap-1.5 border border-gold/30 shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </Link>
          <Link
            href="/admin/gallery"
            className="px-3.5 py-2 rounded-xl bg-navy-light hover:bg-navy text-gold font-semibold text-xs border border-gold/30 shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        <Link href="/admin/music" className="bg-[#151B2B] hover:border-gold rounded-xl border border-gold/30 p-4 shadow-lg flex items-center gap-3 transition">
          <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center flex-shrink-0">
            <Music2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-medium">Published Tracks</span>
            <h3 className="text-xl font-bold text-ivory">{counts.totalSongs ?? 0}</h3>
          </div>
        </Link>

        <Link href="/admin/event-types" className="bg-[#151B2B] hover:border-gold rounded-xl border border-gold/30 p-4 shadow-lg flex items-center gap-3 transition">
          <div className="w-10 h-10 rounded-lg bg-burgundy/40 text-gold-light flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-medium">Event Categories</span>
            <h3 className="text-xl font-bold text-ivory">{counts.totalEventTypes ?? 0}</h3>
          </div>
        </Link>

        <Link href="/admin/locations" className="bg-[#151B2B] hover:border-gold rounded-xl border border-gold/30 p-4 shadow-lg flex items-center gap-3 transition">
          <div className="w-10 h-10 rounded-lg bg-navy-light text-gold flex items-center justify-center flex-shrink-0 border border-gold/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-medium">Program Cities</span>
            <h3 className="text-xl font-bold text-ivory">{counts.totalLocations ?? 0}</h3>
          </div>
        </Link>

        <Link href="/admin/testimonials" className="bg-[#151B2B] hover:border-gold rounded-xl border border-gold/30 p-4 shadow-lg flex items-center gap-3 transition">
          <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-medium">Client Reviews</span>
            <h3 className="text-xl font-bold text-ivory">{counts.totalTestimonials ?? 0}</h3>
          </div>
        </Link>

        <Link href="/admin/videos" className="bg-[#151B2B] hover:border-gold rounded-xl border border-gold/30 p-4 shadow-lg flex items-center gap-3 transition">
          <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center flex-shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-medium">Published Videos</span>
            <h3 className="text-xl font-bold text-ivory">{counts.totalVideos ?? 0}</h3>
          </div>
        </Link>

        <Link href="/admin/gallery" className="bg-[#151B2B] hover:border-gold rounded-xl border border-gold/30 p-4 shadow-lg flex items-center gap-3 transition">
          <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center flex-shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-medium">Gallery Photos</span>
            <h3 className="text-xl font-bold text-ivory">{counts.totalGallery ?? 0}</h3>
          </div>
        </Link>

        <Link href="/admin/events" className="bg-[#151B2B] hover:border-gold rounded-xl border border-gold/30 p-4 shadow-lg flex items-center gap-3 transition">
          <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-medium">Upcoming Shows</span>
            <h3 className="text-xl font-bold text-ivory">{counts.upcomingEvents ?? 0}</h3>
          </div>
        </Link>

        <Link href="/admin/bookings" className="bg-[#151B2B] hover:border-emerald-500 rounded-xl border border-gold/30 p-4 shadow-lg flex items-center gap-3 transition">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-medium">New Enquiries</span>
            <h3 className="text-xl font-bold text-emerald-400">{counts.newBookings ?? 0}</h3>
          </div>
        </Link>
      </div>

      {/* Two Column Layout: Recent Enquiries + Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Booking Enquiries */}
        <div className="lg:col-span-7 bg-[#151B2B] rounded-2xl border border-gold/30 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-gold" />
              <h3 className="text-lg font-serif font-bold text-ivory">Recent Booking Enquiries</h3>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs text-gold hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No booking enquiries received yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enq: any) => (
                <div
                  key={enq.id}
                  className="bg-navy-light p-4 rounded-xl border border-navy flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ivory text-sm truncate">{enq.fullName}</span>
                      <span className="font-mono text-[10px] text-gold bg-navy px-1.5 py-0.5 rounded border border-gold/20">
                        {enq.referenceId}
                      </span>
                    </div>
                    <p className="text-gold font-medium">{enq.eventType}</p>
                    <p className="text-gray-400">
                      Date: {enq.eventDate} • City: {enq.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`tel:${enq.phone}`}
                      className="p-2 rounded-lg bg-navy hover:bg-gold hover:text-navy text-gold transition"
                      title="Call Customer"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://wa.me/91${enq.whatsapp || enq.phone}?text=${encodeURIComponent(
                        `जय श्री राम ${enq.fullName} जी! मैं गायक मुन्ना कुमार निराला जी के प्रबंधन की ओर से आपके कार्यक्रम अनुरोध (${enq.referenceId}) के संबंध में बात कर रहा हूँ।`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900 transition"
                      title="WhatsApp Customer"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        enq.status === 'NEW'
                          ? 'bg-amber-500/20 text-amber-300'
                          : enq.status === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Audit Logs */}
        <div className="lg:col-span-5 bg-[#151B2B] rounded-2xl border border-gold/30 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold" />
              <h3 className="text-lg font-serif font-bold text-ivory">Recent Activity Logs</h3>
            </div>
            <Link
              href="/admin/logs"
              className="text-xs text-gold hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No activity recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {recentLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="bg-navy-light p-3 rounded-xl border border-navy text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-gold">{log.action} • {log.entityType}</span>
                    <span className="text-gray-400">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-ivory/80 line-clamp-1">{log.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

