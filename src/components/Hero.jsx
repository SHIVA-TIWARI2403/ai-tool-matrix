import React from 'react';
import { 
  Sparkles, 
  Scale, 
  CheckCircle2, 
  DollarSign,
  TrendingUp,
  Share2
} from 'lucide-react';

export default function Hero({ totalToolsCount, onSelectCategory }) {
  return (
    <div className="relative overflow-hidden pt-10 pb-8 border-b border-slate-200/70 bg-gradient-to-b from-orange-50/50 via-white to-slate-50/50">
      
      {/* Background warm frosted glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-56 bg-gradient-to-tr from-orange-500/15 via-amber-400/15 to-orange-300/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-orange-200 shadow-sm text-orange-700 text-xs font-semibold mb-5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Real-time Pricing & 4-Way Comparison Engine</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
          Find, Compare & Select the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500">
            Right AI Tool
          </span>{' '}
          for Your Work
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Zero bias. Side-by-side comparison of pricing, free tier quotas, output quality, commercial licenses, and API capabilities for <strong>{totalToolsCount}+ industry-leading AI tools & models</strong>.
        </p>

        {/* Highlight Stats Badges */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm text-slate-700">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">100% Verified Pricing</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md">
            <Scale className="w-4 h-4 text-orange-500" />
            <span className="font-medium">Interactive 4-Way VS Mode</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span className="font-medium">Free Tier & Open Source Filter</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md">
            <Share2 className="w-4 h-4 text-orange-500" />
            <span className="font-medium">Shareable Comparison Link</span>
          </div>
        </div>

      </div>
    </div>
  );
}
