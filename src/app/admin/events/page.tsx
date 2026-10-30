'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  CalendarCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { MediaUploader } from '@/components/admin/MediaUploader';

export default function AdminEventsPage() {
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'CALENDAR'>('EVENTS');
  const [events, setEvents] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Event modal state
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Calendar slot state
  const [slotData, setSlotData] = useState({
    dateString: '',
    status: 'BOOKED',
    programTitle: '',
    city: '',
    note: '',
  });
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [evRes, calRes] = await Promise.all([
        fetch('/api/events?all=true'),
        fetch('/api/calendar'),
      ]);
      const ev = await evRes.json();
      const cal = await calRes.json();
      setEvents(ev);
      setSchedules(cal);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Events CRUD
  const handleOpenEventModal = (ev?: any) => {
    if (ev) {
      setEditingEvent({
        ...ev,
        eventDate: new Date(ev.eventDate).toISOString().split('T')[0],
      });
    } else {
      setEditingEvent({
        title: '',
        titleHi: '',
        eventDate: new Date().toISOString().split('T')[0],
        time: 'शाम ०७:०० बजे से (07:00 PM onwards)',
        venue: '',
        venueHi: '',
        city: 'Delhi',
        cityHi: 'दिल्ली',
        description: '',
        descriptionHi: '',
        posterImage: '/images/munna_nirala_bhajan.jpg',
        bookingUrl: '/contact',
        status: 'UPCOMING',
        published: true,
      });
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const isEdit = Boolean(editingEvent.id);
      const url = isEdit ? `/api/events/${editingEvent.id}` : '/api/events';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent),
      });

      if (!res.ok) throw new Error('कार्यक्रम सेव करने में समस्या आई');

      setIsEventModalOpen(false);
      fetchData();
      setMsg(isEdit ? 'कार्यक्रम सफलतापूर्वक अपडेट हुआ!' : 'नया कार्यक्रम सफलतापूर्वक जुड़ गया!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving event');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (!confirm(`क्या आप कार्यक्रम "${title}" को हटाना चाहते हैं?`)) return;

    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchData();
      setMsg('कार्यक्रम हटा दिया गया!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Calendar slot CRUD
  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotData),
      });

      if (!res.ok) throw new Error('कैलेंडर अपडेट करने में समस्या आई');

      setIsSlotModalOpen(false);
      fetchData();
      setMsg(`तिथि ${slotData.dateString} का स्टेटस सफलतापूर्वक सेट हुआ!`);
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating calendar');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (id: string, dateStr: string) => {
    if (!confirm(`क्या आप ${dateStr} की एंट्री हटाना चाहते हैं?`)) return;

    try {
      await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
      fetchData();
      setMsg('कैलेंडर स्लॉट हटा दिया गया!');
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message);
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
            कार्यक्रम एवं उपलब्धता कैलेंडर (Events & Calendar Management)
          </h1>
          <p className="text-xs text-gray-400">
            मंच कार्यक्रमों की जानकारी डालें तथा कैलेंडर में तारीखें मार्क करें कि कब पापा का प्रोग्राम बुक है और कब खाली है।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/events"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-navy-light hover:bg-gold hover:text-navy text-gold text-xs font-semibold flex items-center gap-1.5 transition border border-gold/30 shadow"
          >
            <span>Events पेज देखें</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {activeTab === 'EVENTS' ? (
            <button
              onClick={() => handleOpenEventModal()}
              className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया सार्वजनिक कार्यक्रम जोड़ें</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSlotData({
                  dateString: new Date().toISOString().split('T')[0],
                  status: 'BOOKED',
                  programTitle: '',
                  city: 'Delhi',
                  note: '',
                });
                setIsSlotModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ तारीख का स्टेटस तय करें (Booked/Free)</span>
            </button>
          )}
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-navy-light pb-2">
        <button
          onClick={() => setActiveTab('EVENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition flex items-center gap-2 ${
            activeTab === 'EVENTS'
              ? 'bg-gold text-navy shadow-md'
              : 'text-ivory/80 hover:text-gold hover:bg-navy-light'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>सार्वजनिक कार्यक्रम सूची ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CALENDAR')}
          className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition flex items-center gap-2 ${
            activeTab === 'CALENDAR'
              ? 'bg-gold text-navy shadow-md'
              : 'text-ivory/80 hover:text-gold hover:bg-navy-light'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>उपलब्धता कैलेंडर स्लॉट्स (Free/Booked Dates) ({schedules.length})</span>
        </button>
      </div>

      {/* TAB 1: Public Events Table */}
      {activeTab === 'EVENTS' && (
        <div className="bg-[#151B2B] rounded-2xl border border-gold/30 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-navy-light bg-navy-light/60 text-gold font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">कार्यक्रम / Event</th>
                  <th className="py-3 px-4">दिनांक / Date</th>
                  <th className="py-3 px-4">स्थान व शहर / Venue</th>
                  <th className="py-3 px-4">स्थिति / Status</th>
                  <th className="py-3 px-4 text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-light">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-navy-light/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gold/30 flex-shrink-0 bg-black">
                          <img
                            src={ev.posterImage || '/images/munna_nirala_bhajan.jpg'}
                            alt={ev.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-ivory text-sm">{ev.titleHi || ev.title}</p>
                          <p className="text-gray-400 text-[11px]">{ev.title}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-gold">
                      {new Date(ev.eventDate).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-gray-300">
                      {ev.venueHi || ev.venue}, {ev.cityHi || ev.city}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ev.status === 'UPCOMING'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {ev.status === 'UPCOMING' ? 'आगामी (Upcoming)' : 'सफल संपन्न (Completed)'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEventModal(ev)}
                          className="p-1.5 rounded-lg bg-navy-light hover:bg-gold hover:text-navy text-gold transition"
                          title="बदलें (Edit)"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          className="p-1.5 rounded-lg bg-navy-light hover:bg-red-500 text-red-400 hover:text-white transition"
                          title="हटाएँ (Delete)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Calendar Slots Management */}
      {activeTab === 'CALENDAR' && (
        <div className="space-y-4">
          <div className="p-4 bg-navy-card rounded-xl border border-gold/30 text-xs text-ivory/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow">
            <div>
              <p className="font-semibold text-gold">
                यहाँ से तय करें कि कौन सी तारीख पर पापा का प्रोग्राम फिक्स है और कौन सी तारीख खाली है।
              </p>
              <p className="text-gray-400 mt-0.5">
                यह कैलेंडर सीधे वेबसाइट के Contact और Events पेज पर भक्तों को दिखाई देता है।
              </p>
            </div>
            <button
              onClick={() => {
                setSlotData({
                  dateString: new Date().toISOString().split('T')[0],
                  status: 'BOOKED',
                  programTitle: '',
                  city: 'Delhi',
                  note: '',
                });
                setIsSlotModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-gold text-navy font-bold text-xs whitespace-nowrap shadow"
            >
              + तारीख जोड़ें (Mark Date)
            </button>
          </div>

          <div className="bg-[#151B2B] rounded-2xl border border-gold/30 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-navy-light bg-navy-light/60 text-gold font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">तारीख / Date</th>
                    <th className="py-3 px-4">स्थिति / Status</th>
                    <th className="py-3 px-4">कार्यक्रम का नाम / Program Title</th>
                    <th className="py-3 px-4">शहर / City</th>
                    <th className="py-3 px-4">नोट / Note</th>
                    <th className="py-3 px-4 text-right">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-light">
                  {schedules.map((slot) => (
                    <tr key={slot.id} className="hover:bg-navy-light/30 transition">
                      <td className="py-3 px-4 font-mono font-bold text-gold">{slot.dateString}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                            slot.status === 'BOOKED'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : slot.status === 'AVAILABLE'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}
                        >
                          {slot.status === 'BOOKED'
                            ? '🔴 कार्यक्रम तय (Booked)'
                            : slot.status === 'AVAILABLE'
                            ? '🟢 खाली / खुला (Available)'
                            : '🟡 प्रक्रियाधीन (Tentative)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-ivory font-medium">{slot.programTitle || '—'}</td>
                      <td className="py-3 px-4 text-gray-300">{slot.city || '—'}</td>
                      <td className="py-3 px-4 text-gray-400 italic">{slot.note || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteSlot(slot.id, slot.dateString)}
                          className="p-1.5 rounded-lg bg-navy-light hover:bg-red-500 text-red-400 hover:text-white transition"
                          title="हटाएँ (Remove)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Public Event */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151B2B] rounded-2xl border border-gold/40 p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 text-ivory">
            <div className="flex items-center justify-between border-b border-navy-light pb-3">
              <h3 className="text-lg font-serif font-bold text-ivory flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <span>{editingEvent.id ? 'कार्यक्रम विवरण बदलें' : 'नया सार्वजनिक कार्यक्रम जोड़ें'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              {/* Event Poster Uploader with Exact Size Guidelines */}
              <MediaUploader
                label="Event Poster Artwork"
                labelHi="कार्यक्रम का पोस्टर फोटो (Event Poster)"
                recommendedSize="800 × 1000 पिक्सल (खड़ा पोस्टर / Portrait Poster) या 1000 × 1000 पिक्सल (चौकोर), अधिकतम 5MB"
                aspectRatioHint="aspect-[4/5]"
                value={editingEvent.posterImage || ''}
                onChange={(url) => setEditingEvent({ ...editingEvent, posterImage: url })}
                helperTextHi="कार्यक्रम का डिजिटल बैनर या निमंत्रण पत्र यहाँ अपलोड करें।"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    कार्यक्रम का नाम (हिन्दी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.titleHi || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, titleHi: e.target.value })}
                    placeholder="उदा. विशाल माता का जागरण एवं दिव्य चौकी"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Event Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    placeholder="e.g. Grand Mata Ka Jagran"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    कार्यक्रम की तिथि (Event Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingEvent.eventDate}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    समय (Timings)
                  </label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    placeholder="उदा. सायं ०७:३० बजे से"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    स्थान / पता (Venue) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.venue}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    placeholder="उदा. श्री राम मंदिर परिसर, रोहिणी"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    शहर (City) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEvent.city}
                    onChange={(e) => setEditingEvent({ ...editingEvent, city: e.target.value })}
                    placeholder="उदा. दिल्ली / पटना"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  स्थिति (Status)
                </label>
                <select
                  value={editingEvent.status}
                  onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                >
                  <option value="UPCOMING">आगामी (UPCOMING - होने वाला है)</option>
                  <option value="COMPLETED">संपन्न (COMPLETED - पूरा हो चुका है)</option>
                  <option value="CANCELLED">रद्द (CANCELLED)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  विवरण / मुख्य आकर्षण (Description)
                </label>
                <textarea
                  rows={2}
                  value={editingEvent.descriptionHi || editingEvent.description || ''}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      descriptionHi: e.target.value,
                      description: e.target.value,
                    })
                  }
                  placeholder="उदा. तारा रानी की कथा, आरती एवं छप्पन भोग..."
                  className="w-full px-3.5 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-navy-light">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-light text-gray-300 text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold text-xs shadow-lg transition"
                >
                  {saving ? 'सेव हो रहा है...' : 'कार्यक्रम सेव करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Calendar Slot */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151B2B] rounded-2xl border border-gold/40 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-ivory">
            <div className="flex items-center justify-between border-b border-navy-light pb-3">
              <h3 className="text-base font-serif font-bold text-ivory flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-gold" />
                <span>तारीख का स्टेटस तय करें (Set Date Status)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSlotModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  तारीख चुनें (Date) *
                </label>
                <input
                  type="date"
                  required
                  value={slotData.dateString}
                  onChange={(e) => setSlotData({ ...slotData, dateString: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  स्थिति (Status) *
                </label>
                <select
                  value={slotData.status}
                  onChange={(e) => setSlotData({ ...slotData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold font-bold"
                >
                  <option value="BOOKED">🔴 कार्यक्रम तय है (BOOKED - व्यस्त)</option>
                  <option value="AVAILABLE">🟢 खाली है (AVAILABLE - बुकिंग हेतु खुला)</option>
                  <option value="TENTATIVE">🟡 प्रक्रियाधीन (TENTATIVE - बात चल रही है)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  कार्यक्रम का नाम (जैसे: माता का जागरण / सुंदरकांड पाठ)
                </label>
                <input
                  type="text"
                  value={slotData.programTitle}
                  onChange={(e) => setSlotData({ ...slotData, programTitle: e.target.value })}
                  placeholder="उदा. माता का जागरण"
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  शहर (City)
                </label>
                <input
                  type="text"
                  value={slotData.city}
                  onChange={(e) => setSlotData({ ...slotData, city: e.target.value })}
                  placeholder="उदा. दिल्ली / पटना / नोएडा"
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  नोट / अतिरिक्त जानकारी (Note)
                </label>
                <input
                  type="text"
                  value={slotData.note}
                  onChange={(e) => setSlotData({ ...slotData, note: e.target.value })}
                  placeholder="उदा. रात्रि कार्यक्रम बुक है"
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-navy-light">
                <button
                  type="button"
                  onClick={() => setIsSlotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-light text-gray-300 font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold shadow"
                >
                  {saving ? 'सेव हो रहा है...' : 'कैलेंडर में सेव करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
