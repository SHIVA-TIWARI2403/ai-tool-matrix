import React from 'react';
import { 
  X, 
  ExternalLink, 
  Star, 
  Check, 
  Minus, 
  Scale, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function CompareModal({ 
  isOpen, 
  onClose, 
  tools, 
  onRemoveTool,
  onSelectPreset
}) {
  if (!isOpen) return null;

  // Preset quick comparisons
  const presets = [
    { label: '🎬 Top Video AI (Runway vs Luma vs Kling)', ids: ['runway-gen3', 'luma-dream-machine', 'kling-ai'] },
    { label: '🎨 Image AI (Midjourney vs FLUX.1 vs Ideogram)', ids: ['midjourney', 'flux-one', 'ideogram-2'] },
    { label: '🧠 Top LLMs (Claude 3.5 vs GPT-4o vs DeepSeek)', ids: ['claude-35-sonnet', 'chatgpt-gpt4o', 'deepseek-r1'] },
    { label: '⚖️ Legal AI (Harvey vs Spellbook vs Robin AI)', ids: ['harvey-ai', 'spellbook', 'robin-ai'] },
    { label: '🎙️ Voice & Music (ElevenLabs vs Suno vs Udio)', ids: ['elevenlabs', 'suno-ai', 'udio-music'] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Side-by-Side Comparison Matrix</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {tools.length} of 4 Selected
                </span>
              </h2>
              <p className="text-xs text-slate-400">Direct specs, pricing breakdown, and commercial viability</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Quick Presets:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPreset(preset.ids)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all whitespace-nowrap border border-slate-700/60 font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Comparison Content Table */}
        <div className="overflow-x-auto p-4 sm:p-6 overflow-y-auto">
          {tools.length === 0 ? (
            <div className="py-16 text-center">
              <Scale className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No tools selected yet</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-4">
                Select 2 or more tools using the "Add to Compare" button on any tool card, or pick one of the quick presets above.
              </p>
            </div>
          ) : (
            <div className="min-w-[650px]">
              
              {/* Header Columns (Tool Names & Remove) */}
              <div className="grid gap-4 mb-4 pb-4 border-b border-slate-800" style={{ gridTemplateColumns: `180px repeat(${tools.length}, minmax(0, 1fr))` }}>
                <div className="font-bold text-slate-400 text-xs uppercase tracking-wider self-end pb-2">
                  Feature / Attribute
                </div>
                {tools.map((tool) => (
                  <div key={tool.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 relative group">
                    <button
                      onClick={() => onRemoveTool(tool.id)}
                      className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {tool.categoryName}
                    </span>
                    <h4 className="text-base font-extrabold text-white mt-2 truncate">{tool.name}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{tool.rating}</span>
                      <span className="text-slate-500">({tool.reviewsCount})</span>
                    </div>
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>

              {/* Row: Pricing Model */}
              <div className="grid gap-4 py-3 border-b border-slate-800/60 items-center text-xs" style={{ gridTemplateColumns: `180px repeat(${tools.length}, minmax(0, 1fr))` }}>
                <span className="font-semibold text-slate-400">Pricing Model</span>
                {tools.map((tool) => (
                  <div key={tool.id} className="font-bold">
                    <span className={`px-2.5 py-1 rounded-full border ${
                      tool.pricingType === 'Open Source' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      tool.pricingType === 'Freemium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}>
                      {tool.pricingType}
                    </span>
                  </div>
                ))}
              </div>

              {/* Row: Starting Price */}
              <div className="grid gap-4 py-3.5 border-b border-slate-800/60 items-center text-xs" style={{ gridTemplateColumns: `180px repeat(${tools.length}, minmax(0, 1fr))` }}>
                <span className="font-semibold text-slate-400">Starting Price</span>
                {tools.map((tool) => (
                  <div key={tool.id} className="font-extrabold text-white text-sm">
                    {tool.startingPrice}
                  </div>
                ))}
              </div>

              {/* Row: Free Tier Details */}
              <div className="grid gap-4 py-3.5 border-b border-slate-800/60 items-center text-xs" style={{ gridTemplateColumns: `180px repeat(${tools.length}, minmax(0, 1fr))` }}>
                <span className="font-semibold text-slate-400">Free Tier Allowance</span>
                {tools.map((tool) => (
                  <div key={tool.id} className="text-slate-300 font-medium leading-relaxed bg-slate-950/40 p-2 rounded-xl border border-slate-800/50">
                    {tool.freeTierDetails}
                  </div>
                ))}
              </div>

              {/* Row: Resolution / Context / Specs */}
              <div className="grid gap-4 py-3.5 border-b border-slate-800/60 items-center text-xs" style={{ gridTemplateColumns: `180px repeat(${tools.length}, minmax(0, 1fr))` }}>
                <span className="font-semibold text-slate-400">Output Specs / Window</span>
                {tools.map((tool) => (
                  <div key={tool.id} className="text-slate-200 font-semibold">
                    {tool.specs.resolution || tool.specs.contextWindow || tool.specs.targetAudience || 'Standard'}
                  </div>
                ))}
              </div>

              {/* Row: Generation Speed */}
              <div className="grid gap-4 py-3.5 border-b border-slate-800/60 items-center text-xs" style={{ gridTemplateColumns: `180px repeat(${tools.length}, minmax(0, 1fr))` }}>
                <span className="font-semibold text-slate-400">Speed / Latency</span>
                {tools.map((tool) => (
                  <div key={tool.id} className="text-slate-300 font-medium">
                    {tool.specs.generationSpeed || tool.specs.latency || 'Fast'}
                  </div>
                ))}
              </div>

              {/* Row: Commercial Rights */}
              <div className="grid gap-4 py-3.5 border-b border-slate-800/60 items-center text-xs" style={{ gridTemplateColumns: `180px repeat(${tools.length}, minmax(0, 1fr))` }}>
                <span className="font-semibold text-slate-400">Commercial Use</span>
                {tools.map((tool) => (
                  <div key={tool.id} className="font-medium flex items-center gap-1.5">
                    {tool.specs.commercialUse?.toLowerCase().includes('yes') || tool.specs.commercialUse?.toLowerCase().includes('full') ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span className="text-slate-200">{tool.specs.commercialUse}</span>
                  </div>
                ))}
              </div>

              {/* Row: API Availability */}
              <div className="grid gap-4 py-3.5 border-b border-slate-800/60 items-center text-xs" style={{ gridTemplateColumns: `180px repeat(${tools.length}, minmax(0, 1fr))` }}>
                <span className="font-semibold text-slate-400">Developer API</span>
                {tools.map((tool) => (
                  <div key={tool.id} className="text-slate-300 font-medium">
                    {tool.specs.apiAvailable || 'Available'}
                  </div>
                ))}
              </div>

              {/* Row: Key Superpower */}
              <div className="grid gap-4 py-3.5 border-b border-slate-800/60 items-start text-xs" style={{ gridTemplateColumns: `180px repeat(${tools.length}, minmax(0, 1fr))` }}>
                <span className="font-semibold text-slate-400 pt-1">Key Superpower</span>
                {tools.map((tool) => (
                  <div key={tool.id} className="text-indigo-300 font-semibold bg-indigo-500/5 p-2 rounded-xl border border-indigo-500/20">
                    {tool.specs.keyFeature || 'Advanced features'}
                  </div>
                ))}
              </div>

              {/* Row: Pros */}
              <div className="grid gap-4 py-3.5 border-b border-slate-800/60 items-start text-xs" style={{ gridTemplateColumns: `180px repeat(${tools.length}, minmax(0, 1fr))` }}>
                <span className="font-semibold text-emerald-400 pt-1">Strengths (Pros)</span>
                {tools.map((tool) => (
                  <div key={tool.id} className="space-y-1.5">
                    {tool.specs.pros?.map((pro, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Row: Cons */}
              <div className="grid gap-4 py-3.5 items-start text-xs" style={{ gridTemplateColumns: `180px repeat(${tools.length}, minmax(0, 1fr))` }}>
                <span className="font-semibold text-rose-400 pt-1">Limitations (Cons)</span>
                {tools.map((tool) => (
                  <div key={tool.id} className="space-y-1.5">
                    {tool.specs.cons?.map((con, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-400">
                        <Minus className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500 hidden sm:block">
            Prices are sourced directly from verified developer pricing sheets.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-all ml-auto"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
}
