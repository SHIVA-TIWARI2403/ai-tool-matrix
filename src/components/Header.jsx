import React from 'react';
import { 
  Sparkles, 
  Scale, 
  PlusCircle, 
  ExternalLink,
  Search,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  Heart
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
  setSearchQuery,
  favoritesCount = 0,
  onSelectFavorites
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => onSelectCategory('all')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-1 ring-white/50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Tool<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Matrix</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200 rounded-full">
                  AI Directory
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Side-by-side specs & pricing</p>
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
                className="w-full pl-10 pr-4 py-2 text-sm bg-white/90 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-sm transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
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
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                compareCount > 0
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 hover:brightness-105 active:scale-95'
                  : 'bg-white text-slate-700 border border-slate-200/90 hover:border-orange-400 hover:text-orange-600 shadow-sm'
              }`}
            >
              <Scale className={`w-4 h-4 ${compareCount > 0 ? 'text-white' : 'text-orange-500'}`} />
              <span className="hidden sm:inline">Compare</span>
              <span className={`px-1.5 py-0.2 rounded-full text-xs font-bold ${
                compareCount > 0 ? 'bg-white text-orange-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {compareCount}
              </span>
            </button>

            {/* My Favorites Button (If user has favorites) */}
            {user && (
              <button
                onClick={onSelectFavorites}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:border-rose-400 hover:text-rose-600 transition-all shadow-sm cursor-pointer"
                title="View your saved tools"
              >
                <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                <span className="hidden md:inline">Saved</span>
                {favoritesCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* Submit Tool */}
            <button
              onClick={onOpenSubmitModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-600 shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-orange-500" />
              <span>Submit Tool</span>
            </button>

            {/* Admin Dashboard Trigger */}
            <button
              onClick={onOpenAdminModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100/80 shadow-sm transition-all cursor-pointer"
              title="Open Admin & Database View"
            >
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span className="hidden md:inline">Admin DB</span>
            </button>

            {/* User Auth Profile / Login Button */}
            {user ? (
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {user.email?.charAt(0) || 'U'}
                </div>
                <div className="hidden xl:block text-left text-xs">
                  <span className="block font-semibold text-slate-800 truncate max-w-[120px]">{user.email}</span>
                </div>
                <button
                  onClick={signOutUser}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-105 active:scale-95 text-white transition-all shadow-md shadow-orange-500/20 cursor-pointer"
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
