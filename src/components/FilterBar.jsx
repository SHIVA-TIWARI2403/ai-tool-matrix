import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

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
    { label: '🟣 Paid / Enterprise', value: 'Paid' },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Pricing Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Pricing:</span>
          </div>
          {pricingOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPricingFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pricingFilter === opt.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort & Results Count */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{totalResults}</strong> tools
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
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
