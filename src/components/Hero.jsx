import React from 'react';
import { 
  Sparkles, 
  Scale, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export default function Hero({ totalToolsCount }) {
  return (
    <div className="relative overflow-hidden pt-8 pb-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-52 bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-pink-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Real-time Pricing & Side-by-Side Comparison Platform</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Find, Compare & Select the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Right AI Tool
          </span>{' '}
          for Your Work
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Zero bias. Side-by-side comparison of pricing, free tier quotas, output quality, commercial licenses, and API capabilities for <strong>{totalToolsCount}+ industry-leading AI tools & models</strong>.
        </p>

        {/* Highlight Stats Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Verified Pricing</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>Interactive 4-Way VS Mode</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Free Tier & Open Source Filter</span>
          </div>
        </div>

      </div>
    </div>
  );
}
