import React from 'react';
import { 
  Star, 
  ExternalLink, 
  Scale, 
  Check, 
  Info
} from 'lucide-react';

export default function ToolCard({ 
  tool, 
  isCompared, 
  onToggleCompare, 
  onOpenDetails
}) {
  // Pricing badge color logic
  const getPricingBadge = (type) => {
    switch (type) {
      case 'Open Source':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Freemium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Paid':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className={`group relative bg-slate-900/70 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-slate-700 ${
      isCompared ? 'border-indigo-500/80 ring-2 ring-indigo-500/30 bg-slate-900' : 'border-slate-800'
    }`}>
      
      {/* Top Header: Category & Pricing Pill */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50">
            {tool.categoryName}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPricingBadge(tool.pricingType)}`}>
            {tool.pricingType}
          </span>
        </div>

        {/* Tool Name & Badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 
              onClick={() => onOpenDetails(tool)}
              className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {tool.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{tool.rating}</span>
              </div>
              <span className="text-xs text-slate-500">({tool.reviewsCount.toLocaleString()} reviews)</span>
            </div>
          </div>

          {/* Quick Badges */}
          {tool.badges && tool.badges[0] && (
            <span className="text-[10px] font-bold tracking-tight px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {tool.badges[0]}
            </span>
          )}
        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {tool.tagline}
        </p>

        {/* Pricing & Free Tier Card Highlight */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Starting Price</span>
            <span className="text-sm font-bold text-white">{tool.startingPrice}</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
            <span className="font-semibold text-indigo-400 whitespace-nowrap">Free Tier:</span>
            <span className="line-clamp-1 text-slate-300">{tool.freeTierDetails}</span>
          </div>
        </div>

        {/* Key Specs Pills */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mb-4">
          <div className="flex items-center gap-1.5 truncate bg-slate-800/40 px-2 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500">Speed:</span>
            <span className="font-medium truncate">{tool.specs.generationSpeed || 'Fast'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate bg-slate-800/40 px-2 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500">Commercial:</span>
            <span className="font-medium text-emerald-400 truncate">
              {tool.specs.commercialUse?.startsWith('Yes') ? 'Allowed' : 'Restricted'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
        {/* Toggle Compare Button */}
        <button
          onClick={() => onToggleCompare(tool)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isCompared
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/60'
          }`}
        >
          {isCompared ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Compare</span>
            </>
          ) : (
            <>
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add to Compare</span>
            </>
          )}
        </button>

        {/* View Details / External Visit */}
        <button
          onClick={() => onOpenDetails(tool)}
          className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          title="View detailed specs & comparison"
        >
          <Info className="w-4 h-4 text-slate-300" />
        </button>

        <a
          href={tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-slate-800/70 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
          title="Visit official website"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
