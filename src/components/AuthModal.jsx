import React, { useState } from 'react';
import { X, Mail, CheckCircle2, AlertCircle, LogIn } from 'lucide-react';
import { signInWithGoogle, signInWithEmail } from '../lib/supabase';

export default function AuthModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setErrorMsg('');
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setErrorMsg('');
      await signInWithEmail(email);
      setSentEmail(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to send login link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-white/95 border border-slate-200/90 rounded-3xl shadow-2xl shadow-orange-950/10 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-orange-50/60 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 border border-orange-200 flex items-center justify-center">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Sign In to ToolMatrix</h3>
              <p className="text-xs text-slate-500">Save comparisons & bookmark favorite tools</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {sentEmail ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Magic Link Sent!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                We've sent a sign-in link to <strong>{email}</strong>. Check your inbox to complete login.
              </p>
              <button
                onClick={() => setSentEmail(false)}
                className="text-xs text-orange-600 hover:underline pt-2 font-semibold cursor-pointer"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-slate-800 bg-white hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs text-xs sm:text-sm border border-slate-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">
                  Or with email
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Email Magic Link Form */}
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/25 text-xs"
                >
                  <Mail className="w-4 h-4" />
                  <span>{loading ? 'Sending link...' : 'Send Magic Sign-in Link'}</span>
                </button>
              </form>
            </>
          )}

          <p className="text-[10px] text-slate-400 text-center pt-2">
            By signing in, your favorites and comparisons are synced securely via Supabase Cloud.
          </p>
        </div>

      </div>
    </div>
  );
}
