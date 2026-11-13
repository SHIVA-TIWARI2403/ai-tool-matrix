import React from 'react';
import { 
  X, 
  ExternalLink, 
  Star, 
  Check, 
  Minus, 
  Scale, 
  Coins, 
  Layers, 
  CheckCircle2
} from 'lucide-react';

export default function ToolDetailModal({ tool, isOpen, onClose, isCompared, onToggleCompare }) {
  if (!isOpen || !tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white/95 border border-slate-200/90 rounded-3xl shadow-2xl shadow-orange-950/10 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Glow & Header */}
        <div className="p-6 bg-gradient-to-b from-orange-50/60 via-white to-white border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
              {tool.categoryName}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              tool.pricingType === 'Open Source' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              tool.pricingType === 'Freemium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-orange-50 text-orange-700 border-orange-200'
            }`}>
              {tool.pricingType}
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{tool.name}</h2>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{tool.tagline}</p>

          <div className="flex items-center gap-3 mt-4 text-xs font-semibold">
            <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{tool.rating} Rating</span>
            </div>
            <span className="text-slate-500">Based on {tool.reviewsCount.toLocaleString()} verified reviews</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Pricing Highlight Card */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-orange-500" />
              <span>Pricing & Free Tier Breakdown</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <span className="text-xs text-slate-500">Starting Price:</span>
                <p className="text-lg font-extrabold text-slate-900">{tool.startingPrice}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Free Tier Allowance:</span>
                <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">{tool.freeTierDetails}</p>
              </div>
            </div>
          </div>

          {/* Detailed Specs Grid */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Technical Specifications</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-slate-500 block mb-0.5">Resolution / Context</span>
                <span className="font-semibold text-slate-800">
                  {tool.specs.resolution || tool.specs.contextWindow || tool.specs.duration || 'Standard'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-slate-500 block mb-0.5">Speed / Latency</span>
                <span className="font-semibold text-slate-800">{tool.specs.generationSpeed || tool.specs.latency || 'Fast'}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-slate-500 block mb-0.5">Commercial Rights</span>
                <span className="font-semibold text-emerald-700">{tool.specs.commercialUse}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-slate-500 block mb-0.5">Developer API</span>
                <span className="font-semibold text-slate-800">{tool.specs.apiAvailable}</span>
              </div>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-2xl p-4">
              <h5 className="font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Key Pros & Strengths</span>
              </h5>
              <ul className="space-y-1.5 text-slate-700">
                {tool.specs.pros?.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/60 border border-rose-200/70 rounded-2xl p-4">
              <h5 className="font-bold text-rose-800 mb-2 flex items-center gap-1.5">
                <Minus className="w-4 h-4 text-rose-600" />
                <span>Things to Consider</span>
              </h5>
              <ul className="space-y-1.5 text-slate-700">
                {tool.specs.cons?.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Minus className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleCompare(tool)}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isCompared
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'bg-white hover:border-orange-400 hover:text-orange-600 text-slate-700 border border-slate-200/90 shadow-xs'
            }`}
          >
            <Scale className={`w-4 h-4 ${isCompared ? 'text-white' : 'text-orange-500'}`} />
            <span>{isCompared ? 'Remove from Compare' : 'Add to Compare'}</span>
          </button>

          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-105 active:scale-95 text-white transition-all cursor-pointer shadow-md shadow-orange-500/20"
          >
            <span>Visit {tool.name}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
