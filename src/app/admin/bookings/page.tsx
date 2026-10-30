'use client';

import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Phone,
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  Mail,
  Calendar,
  Users,
  MapPin,
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [status, setStatus] = useState('NEW');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchEnquiries = () => {
    fetch('/api/booking')
      .then((res) => res.json())
      .then((d) => setEnquiries(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleOpenEdit = (enq: any) => {
    setSelectedEnquiry(enq);
    setStatus(enq.status);
    setAdminNotes(enq.adminNotes || '');
    setIsEditModalOpen(true);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/booking/${selectedEnquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (!res.ok) throw new Error('Failed to update enquiry');

      setIsEditModalOpen(false);
      fetchEnquiries();
      setMsg(`Enquiry ${selectedEnquiry.referenceId} updated!`);
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, refId: string) => {
    if (!confirm(`Are you sure you want to delete enquiry ${refId}?`)) return;

    try {
      await fetch(`/api/booking/${id}`, { method: 'DELETE' });
      fetchEnquiries();
      setMsg(`Enquiry ${refId} deleted!`);
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error deleting enquiry');
    }
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    const q = search.toLowerCase();
    const matchesSearch =
      enq.fullName.toLowerCase().includes(q) ||
      enq.phone.includes(q) ||
      enq.referenceId.toLowerCase().includes(q) ||
      enq.city.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || enq.status === statusFilter;
    return matchesSearch && matchesStatus;
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ivory">Booking Enquiries</h1>
          <p className="text-xs text-gray-400">
            Review customer booking requests, contact clients via phone/WhatsApp, and track statuses.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#151B2B] p-4 rounded-xl border border-gold/30">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, city, Ref ID..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory text-xs focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-gold text-navy font-bold'
                  : 'bg-navy-light text-gray-300 hover:text-gold'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {filteredEnquiries.length === 0 ? (
          <div className="text-center py-16 bg-[#151B2B] rounded-2xl border border-gold/20 p-8 space-y-2">
            <Inbox className="w-12 h-12 text-gold/40 mx-auto" />
            <p className="text-sm font-serif text-ivory">No enquiries match your current filters</p>
          </div>
        ) : (
          filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-[#151B2B] rounded-2xl border border-gold/30 p-5 sm:p-6 shadow-xl space-y-4 hover:border-gold/60 transition"
            >
              {/* Header Strip */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-navy-light pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-gold bg-navy-light px-2.5 py-1 rounded border border-gold/30">
                    {enq.referenceId}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      enq.status === 'NEW'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : enq.status === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : enq.status === 'CONTACTED'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/40'
                    }`}
                  >
                    {enq.status}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(enq.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${enq.phone}`}
                    className="px-3 py-1.5 rounded-lg bg-navy hover:bg-gold hover:text-navy text-gold text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call: {enq.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/91${enq.whatsapp || enq.phone}?text=${encodeURIComponent(
                      `जय श्री राम ${enq.fullName} जी! मैं गायक मुन्ना कुमार निराला जी के प्रबंधन की ओर से आपके कार्यक्रम अनुरोध (${enq.referenceId}) के संबंध में संपर्क कर रहा हूँ।`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => handleOpenEdit(enq)}
                    className="p-1.5 rounded-lg bg-navy-light hover:bg-gold hover:text-navy text-gold transition"
                    title="Update Status / Notes"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(enq.id, enq.referenceId)}
                    className="p-1.5 rounded-lg bg-navy-light hover:bg-red-500 text-red-400 hover:text-white transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Enquiry Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Organiser Name</span>
                  <p className="font-bold text-ivory text-sm">{enq.fullName}</p>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5">Event Type</span>
                  <p className="font-bold text-gold">{enq.eventType}</p>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5">Event Date</span>
                  <p className="font-bold text-ivory">{enq.eventDate}</p>
                </div>

                <div>
                  <span className="text-gray-400 block mb-0.5">City & Venue</span>
                  <p className="text-gray-300">{enq.venue || '—'}, {enq.city}</p>
                </div>
              </div>

              {/* Special Requirements & Notes */}
              {(enq.specialRequirements || enq.adminNotes) && (
                <div className="pt-2 border-t border-navy-light grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {enq.specialRequirements && (
                    <div className="bg-navy p-3 rounded-lg border border-navy-light">
                      <span className="text-gold font-semibold block mb-0.5">Customer Message / Requirements:</span>
                      <p className="text-ivory/80 italic">{enq.specialRequirements}</p>
                    </div>
                  )}

                  {enq.adminNotes && (
                    <div className="bg-navy p-3 rounded-lg border border-gold/30">
                      <span className="text-emerald-400 font-semibold block mb-0.5">Admin Internal Notes:</span>
                      <p className="text-ivory/90">{enq.adminNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit Status & Notes Modal */}
      {isEditModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151B2B] rounded-2xl border border-gold/40 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-navy-light pb-3">
              <h3 className="text-lg font-serif font-bold text-ivory">
                Update Status ({selectedEnquiry.referenceId})
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Booking Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Internal Notes (Quotation sent, agreed fees, time confirmed, etc.)
                </label>
                <textarea
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Quoted standard mandir package, client confirmed 28th Nov..."
                  className="w-full px-3 py-2 rounded-lg bg-navy-light border border-gold/30 text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-navy-light">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-light text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-gold hover:bg-gold-light text-navy font-bold"
                >
                  {saving ? 'Saving...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

