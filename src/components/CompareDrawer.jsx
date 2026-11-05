import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';

export default function CompareDrawer({ 
  comparedTools, 
  onRemoveTool, 
  onClearAll, 
  onOpenCompareModal 
}) {
  if (comparedTools.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-slate-900/95 border-2 border-indigo-500/50 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-indigo-950/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Indicator & Tool Pills */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-indigo-300 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center">
              <Scale className="w-4 h-4 text-indigo-400" />
            </div>
            <span>Compare ({comparedTools.length}/4):</span>
          </div>

          <div className="flex items-center gap-2">
            {comparedTools.map((tool) => (
              <div 
                key={tool.id}
                className="flex items-center gap-2 bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs text-white font-medium shrink-0 shadow-sm"
              >
                <span className="truncate max-w-[110px] sm:max-w-[140px]">{tool.name}</span>
                <button
                  onClick={() => onRemoveTool(tool.id)}
                  className="text-slate-400 hover:text-rose-400 transition-colors p-0.5 rounded-md hover:bg-slate-700"
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
          <button
            onClick={onClearAll}
            className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-2 transition-colors cursor-pointer"
          >
            Clear All
          </button>

          <button
            onClick={onOpenCompareModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span>Compare Now (VS)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
