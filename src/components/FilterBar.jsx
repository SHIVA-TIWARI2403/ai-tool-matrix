import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function FilterBar({ 
  pricingFilter, 
  setPricingFilter, 
  sortBy, 
  setSortBy, 
  totalResults,
  onResetFilters
}) {
  const pricingOptions = [
    { label: 'All Pricing', value: 'all' },
    { label: '🟢 Free & Open Source', value: 'free-open' },
    { label: '🟡 Freemium (Free Tier)', value: 'Freemium' },
    { label: '🟣 Paid Only', value: 'Paid' },
  ];

  return (
    <div className="bg-white/80 border border-slate-200/90 rounded-2xl p-4 mb-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Pricing Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mr-2">
            <Filter className="w-3.5 h-3.5 text-orange-500" />
            <span>Pricing:</span>
          </div>
          {pricingOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPricingFilter(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                pricingFilter === opt.value
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm ring-1 ring-orange-400'
                  : 'bg-white text-slate-700 hover:bg-orange-50/60 hover:text-orange-600 hover:border-orange-200 border border-slate-200 shadow-xs'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort & Results Count */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900 font-bold">{totalResults}</strong> tools
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-xs cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Popular</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
