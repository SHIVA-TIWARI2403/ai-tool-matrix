import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Mail, 
  FileText, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Database
} from 'lucide-react';
import { fetchSubscribers, fetchSubmissions } from '../lib/supabase';

export default function AdminModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('subscribers');
  const [subscribers, setSubscribers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subs, tools] = await Promise.all([
        fetchSubscribers().catch(() => []),
        fetchSubmissions().catch(() => [])
      ]);
      setSubscribers(subs);
      setSubmissions(tools);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white/95 border border-slate-200/90 rounded-3xl shadow-2xl shadow-orange-950/10 overflow-hidden my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-orange-50/60 to-white flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Owner & Admin Dashboard</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200">
                  Supabase Live DB
                </span>
              </div>
              <p className="text-xs text-slate-500">View registered users, subscribers & tool submissions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 bg-slate-50/50">
          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">Total Users</span>
              <p className="text-base font-bold text-slate-900">Active (Google / Supabase)</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">Newsletter Subscribers</span>
              <p className="text-xl font-black text-slate-900">{subscribers.length}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">Tool Submissions</span>
              <p className="text-xl font-black text-slate-900">{submissions.length}</p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/80">
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'subscribers'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            Subscribers ({subscribers.length})
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            Tool Submissions ({submissions.length})
          </button>
          <a
            href="https://supabase.com/dashboard/project/aljlnisvrveuwlishgyv/auth/users"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Open Supabase Auth Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'subscribers' ? (
            <div>
              {subscribers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No subscribers recorded yet in Supabase. Test subscribing in the newsletter section!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="pb-3 font-semibold">Subscriber Email</th>
                        <th className="pb-3 font-semibold">Subscribed Date</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subscribers.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/80">
                          <td className="py-3 font-semibold text-slate-900">{s.email}</td>
                          <td className="py-3 text-slate-500">
                            {new Date(s.created_at).toLocaleDateString()} at {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                              Subscribed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>
              {submissions.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No tool submissions yet in Supabase.
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((t) => (
                    <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-200">
                            {t.category}
                          </span>
                          <span className="text-xs text-amber-700 font-semibold">{t.pricing_type}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{t.tagline || t.website_url}</p>
                        {t.creator_email && (
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Contact: {t.creator_email}
                          </span>
                        )}
                      </div>
                      <a
                        href={t.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-orange-500 hover:text-orange-600 text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0 shadow-xs transition-colors"
                      >
                        <span>Visit Site</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
