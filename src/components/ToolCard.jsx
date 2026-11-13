import React from 'react';
import { 
  Star, 
  ExternalLink, 
  Scale, 
  Check, 
  Zap, 
  Heart,
  Info,
  ArrowRight
} from 'lucide-react';

export default function ToolCard({ 
  tool, 
  isCompared, 
  onToggleCompare, 
  onOpenDetails,
  isFavorite = false,
  onToggleFavorite,
  onFindFreeAlternatives
}) {
  // Pricing badge color logic
  const getPricingBadge = (type) => {
    switch (type) {
      case 'Open Source':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold';
      case 'Freemium':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-bold';
      case 'Paid':
        return 'bg-purple-50 text-purple-700 border-purple-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-bold';
    }
  };

  const isPaidOrExpensive = tool.pricingType === 'Paid' || (tool.pricingType === 'Freemium' && !tool.freeTierDetails?.toLowerCase().includes('daily'));

  return (
    <div className={`group relative bg-white/80 backdrop-blur-md border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-300 ${
      isCompared ? 'border-orange-500 ring-2 ring-orange-500/25 bg-orange-50/20 shadow-md' : 'border-slate-200/90 shadow-sm'
    }`}>
      
      {/* Top Header: Category, Pricing & Heart Bookmark */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
              {tool.categoryName}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getPricingBadge(tool.pricingType)}`}>
              {tool.pricingType}
            </span>
          </div>

          {/* Bookmark Heart Button */}
          <button
            onClick={() => onToggleFavorite(tool.id)}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-500'
                : 'bg-white/80 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200'
            }`}
            title={isFavorite ? "Remove from saved favorites" : "Save to favorites"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Tool Name & Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 
              onClick={() => onOpenDetails(tool)}
              className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {tool.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{tool.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({tool.reviewsCount.toLocaleString()} reviews)</span>
            </div>
          </div>

          {/* Badges */}
          {tool.badges && tool.badges[0] && (
            <span className="text-[10px] font-bold tracking-tight px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-200">
              {tool.badges[0]}
            </span>
          )}
        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
          {tool.tagline}
        </p>

        {/* Pricing & Free Tier Card */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 mb-3">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Starting Price</span>
            <span className="text-sm font-black text-slate-900">{tool.startingPrice}</span>
          </div>
          <div className="text-[11px] text-slate-600 flex items-start gap-1.5">
            <span className="font-bold text-orange-600 whitespace-nowrap">Free Tier:</span>
            <span className="line-clamp-1 text-slate-700 font-medium">{tool.freeTierDetails}</span>
          </div>
        </div>

        {/* Specs Pills & Free Alternative shortcut */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 mb-3">
          <div className="flex items-center gap-1.5 truncate bg-white px-2 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-slate-400 font-medium">Speed:</span>
            <span className="font-semibold truncate text-slate-800">{tool.specs.generationSpeed || 'Fast'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate bg-white px-2 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-slate-400 font-medium">License:</span>
            <span className="font-semibold text-emerald-600 truncate">
              {tool.specs.commercialUse?.startsWith('Yes') ? 'Commercial' : 'Restricted'}
            </span>
          </div>
        </div>

        {/* Show Free Alternative Trigger */}
        {isPaidOrExpensive && onFindFreeAlternatives && (
          <div className="mb-3">
            <button
              onClick={() => onFindFreeAlternatives(tool.category)}
              className="w-full text-left flex items-center justify-between text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50/70 hover:bg-orange-100/70 px-2.5 py-1.5 rounded-lg border border-orange-200/80 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-orange-500" />
                <span>Show Free Alternatives</span>
              </span>
              <ArrowRight className="w-3 h-3 text-orange-500" />
            </button>
          </div>
        )}

      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2">
        {/* Toggle Compare Button */}
        <button
          onClick={() => onToggleCompare(tool)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isCompared
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 ring-1 ring-orange-400'
              : 'bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 text-slate-700 border border-slate-200/90 shadow-2xs'
          }`}
        >
          {isCompared ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Compare</span>
            </>
          ) : (
            <>
              <Scale className="w-3.5 h-3.5 text-orange-500" />
              <span>Add to Compare</span>
            </>
          )}
        </button>

        {/* View Details */}
        <button
          onClick={() => onOpenDetails(tool)}
          className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
          title="View detailed specs & comparison"
        >
          <Info className="w-4 h-4 text-slate-500" />
        </button>

        {/* Visit External Site */}
        <a
          href={tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 text-slate-600 border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
          title="Visit official website"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
