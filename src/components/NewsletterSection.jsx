import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { subscribeNewsletter } from '../lib/supabase';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setErrorMsg('');
      await subscribeNewsletter(email);
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-16 max-w-5xl mx-auto px-4">
      <div className="relative rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/90 p-8 sm:p-12 overflow-hidden shadow-xl shadow-orange-950/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold">
            <Mail className="w-3.5 h-3.5" />
            <span>Weekly AI Intelligence (Synced to Database)</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Never Miss a Price Drop or Free AI Alternative
          </h3>

          <p className="text-xs sm:text-sm text-slate-600">
            Join creators, lawyers, and developers receiving our hand-picked weekly rundown of free tiers, new model benchmarks, and exclusive tool discounts.
          </p>

          {errorMsg && (
            <p className="text-xs text-rose-500 font-semibold">{errorMsg}</p>
          )}

          {subscribed ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>You're on the list! Saved directly to Supabase Database.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs sm:text-sm font-bold hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/25"
              >
                <span>{loading ? 'Subscribing...' : 'Subscribe Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-400 pt-1">
            Zero spam. Stored securely in PostgreSQL database.
          </p>
        </div>
      </div>
    </div>
  );
}
