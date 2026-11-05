import React from 'react';
import { 
  X, 
  ExternalLink, 
  Star, 
  Check, 
  Minus, 
  Scale, 
  ShieldCheck, 
  Zap, 
  Coins, 
  Layers, 
  Share2,
  CheckCircle2,
  Terminal,
  Clock
} from 'lucide-react';

export default function ToolDetailModal({ tool, isOpen, onClose, isCompared, onToggleCompare }) {
  if (!isOpen || !tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Glow & Header */}
        <div className="p-6 bg-gradient-to-b from-indigo-950/40 to-slate-900 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {tool.categoryName}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
              tool.pricingType === 'Open Source' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
              tool.pricingType === 'Freemium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              'bg-purple-500/10 text-purple-400 border-purple-500/30'
            }`}>
              {tool.pricingType}
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">{tool.name}</h2>
          <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">{tool.tagline}</p>

          <div className="flex items-center gap-3 mt-4 text-xs font-semibold">
            <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{tool.rating} Rating</span>
            </div>
            <span className="text-slate-400">Based on {tool.reviewsCount.toLocaleString()} verified reviews</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Pricing Highlight Card */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Pricing & Free Tier Breakdown</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <span className="text-xs text-slate-400">Starting Price:</span>
                <p className="text-lg font-extrabold text-white">{tool.startingPrice}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Free Tier Allowance:</span>
                <p className="text-xs text-slate-200 font-medium mt-0.5 leading-relaxed">{tool.freeTierDetails}</p>
              </div>
            </div>
          </div>

          {/* Detailed Specs Grid */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Technical Specifications</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-850/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Resolution / Context</span>
                <span className="font-semibold text-white">
                  {tool.specs.resolution || tool.specs.contextWindow || tool.specs.duration || 'Standard'}
                </span>
              </div>
              <div className="bg-slate-850/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Speed / Latency</span>
                <span className="font-semibold text-white">{tool.specs.generationSpeed || tool.specs.latency || 'Fast'}</span>
              </div>
              <div className="bg-slate-850/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Commercial Rights</span>
                <span className="font-semibold text-emerald-400">{tool.specs.commercialUse}</span>
              </div>
              <div className="bg-slate-850/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Developer API</span>
                <span className="font-semibold text-white">{tool.specs.apiAvailable}</span>
              </div>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-4">
              <h5 className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Key Pros & Strengths</span>
              </h5>
              <ul className="space-y-1.5 text-slate-300">
                {tool.specs.pros?.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-950/20 border border-rose-900/30 rounded-2xl p-4">
              <h5 className="font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                <Minus className="w-4 h-4 text-rose-400" />
                <span>Things to Consider</span>
              </h5>
              <ul className="space-y-1.5 text-slate-400">
                {tool.specs.cons?.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Minus className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleCompare(tool)}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isCompared
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>{isCompared ? 'Remove from Compare' : 'Add to Compare'}</span>
          </button>

          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <span>Visit {tool.name}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
