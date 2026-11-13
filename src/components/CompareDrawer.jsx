import React, { useState } from 'react';
import { Scale, X, ArrowRight, Share2, Check } from 'lucide-react';

export default function CompareDrawer({ 
  comparedTools, 
  onRemoveTool, 
  onClearAll, 
  onOpenCompareModal,
  onCopyShareLink
}) {
  const [copied, setCopied] = useState(false);

  if (comparedTools.length === 0) return null;

  const handleShare = () => {
    if (onCopyShareLink) {
      onCopyShareLink();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-white/95 border-2 border-orange-400/80 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-orange-950/15 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Indicator & Tool Pills */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-orange-700 shrink-0">
            <div className="w-7 h-7 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center">
              <Scale className="w-4 h-4 text-orange-600" />
            </div>
            <span>Compare ({comparedTools.length}/4):</span>
          </div>

          <div className="flex items-center gap-2">
            {comparedTools.map((tool) => (
              <div 
                key={tool.id}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs text-slate-800 font-semibold shrink-0 shadow-2xs"
              >
                <span className="truncate max-w-[110px] sm:max-w-[140px]">{tool.name}</span>
                <button
                  onClick={() => onRemoveTool(tool.id)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded-md hover:bg-slate-200/60 cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          
          {/* Share Link Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition-all cursor-pointer shadow-2xs"
            title="Copy shareable comparison link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-orange-600" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={onClearAll}
            className="text-xs text-slate-500 hover:text-slate-800 px-2.5 py-2 transition-colors cursor-pointer font-medium"
          >
            Clear
          </button>

          <button
            onClick={onOpenCompareModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Compare Now (VS)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
