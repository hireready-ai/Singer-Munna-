'use client';

import React, { useState, useEffect } from 'react';
import { ScrollText, Clock, User, ShieldCheck } from 'lucide-react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data?.recentLogs) setLogs(data.recentLogs);
      })
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

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-serif font-bold text-ivory">Admin Audit Logs</h1>
        <p className="text-xs text-gray-400">
          Traceable record of all content modifications, media uploads, and admin sessions.
        </p>
      </div>

      <div className="bg-[#151B2B] rounded-2xl border border-gold/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-navy-light bg-navy-light/60 text-gold font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-light">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-navy-light/30 transition">
                    <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          log.action === 'CREATE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : log.action === 'UPDATE' || log.action === 'UPSERT'
                            ? 'bg-blue-500/20 text-blue-400'
                            : log.action === 'DELETE'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gold/20 text-gold'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gold font-semibold">{log.entityType}</td>
                    <td className="py-3 px-4 text-ivory/80 max-w-md truncate">{log.details || '—'}</td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-[11px]">{log.user}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

