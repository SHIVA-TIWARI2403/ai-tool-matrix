import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "Which AI video generator has the best free tier?",
      a: "Luma Dream Machine offers 30 free video generations per month, and Kling AI provides 66 free daily credits upon login. Runway Gen-3 Alpha provides 125 one-time credits on initial signup, while OpenAI Sora requires a paid ChatGPT Plus/Pro subscription."
    },
    {
      q: "What is the best free & open-source alternative to Midjourney?",
      a: "FLUX.1 (by Black Forest Labs) and Stable Diffusion 3.5 Large are the leading open-source alternatives. FLUX.1 Schnell offers photorealistic anatomy and text rendering under an Apache 2.0 license, completely free to run on your own GPU."
    },
    {
      q: "Can AI generated videos and images be used for commercial client projects?",
      a: "Yes, but commercial usage depends on the pricing tier. Midjourney, Runway Gen-3, HeyGen, and Ideogram grant full commercial rights on their paid subscriptions. For 100% free commercial rights, use FLUX.1 Schnell or Stable Diffusion 3.5 Large."
    },
    {
      q: "Which AI tools are best suited for lawyers and contract review?",
      a: "For enterprise law firms, Harvey AI and CoCounsel (Thomson Reuters) lead in case law precedent and litigation analysis. For drafting and redlining directly inside Microsoft Word, Spellbook is the most popular add-in, while Robin AI provides fast contract reviews with playbook enforcement."
    },
    {
      q: "How does ToolMatrix AI compare tools?",
      a: "ToolMatrix evaluates 9 critical parameters side-by-side: Starting Monthly Price, Free Tier Allowances, Resolution & Latency, Commercial Licensing, Developer API Support, Key Superpowers, and Verified Pros & Cons based on developer documentation."
    }
  ];

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="my-16 max-w-4xl mx-auto px-4" aria-label="Frequently Asked Questions">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>AEO & GEO Knowledge Base</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions & AI Comparisons
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Direct, verified answers for creators, developers, and AI researchers.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-sm sm:text-base text-slate-200">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{faq.a}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
