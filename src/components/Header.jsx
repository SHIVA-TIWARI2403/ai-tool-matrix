import React from 'react';
import { 
  Sparkles, 
  Scale, 
  PlusCircle, 
  Layers, 
  ExternalLink,
  Search,
  CheckCircle2,
  LogIn,
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';
import { signOutUser } from '../lib/supabase';

export default function Header({ 
  selectedCategory, 
  onSelectCategory, 
  categories, 
  compareCount, 
  onOpenCompare,
  onOpenSubmitModal,
  onOpenAuthModal,
  onOpenAdminModal,
  user,
  searchQuery,
  setSearchQuery
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => onSelectCategory('all')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Tool<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Matrix</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  AI Directory
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Side-by-side specs & live database</p>
            </div>
          </div>

          {/* Quick Search in Header */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools (e.g. Runway, Midjourney, Claude, Harvey)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Compare Trigger Button */}
            <button
              onClick={onOpenCompare}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                compareCount > 0
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:brightness-110'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
              <span className={`px-1.5 py-0.2 rounded-full text-xs font-bold ${
                compareCount > 0 ? 'bg-white text-indigo-700' : 'bg-slate-800 text-slate-400'
              }`}>
                {compareCount}
              </span>
            </button>

            {/* Submit Tool */}
            <button
              onClick={onOpenSubmitModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Submit Tool</span>
            </button>

            {/* Admin Dashboard Trigger */}
            <button
              onClick={onOpenAdminModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
              title="Open Admin & Database View"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline">Admin DB</span>
            </button>

            {/* User Auth Profile / Login Button */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user.email?.charAt(0) || 'U'}
                </div>
                <div className="hidden xl:block text-left text-xs">
                  <span className="block font-semibold text-white truncate max-w-[120px]">{user.email}</span>
                </div>
                <button
                  onClick={signOutUser}
                  className="text-slate-400 hover:text-rose-400 p-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
