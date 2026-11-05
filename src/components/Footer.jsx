import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Footer({ onSelectCategory, categories, onOpenSubmitModal, onOpenApiModal }) {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Tool<span className="text-indigo-400">Matrix</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The independent, real-time AI tools directory and side-by-side comparison engine. Helping professionals, founders, and creators find the perfect AI workflow.
            </p>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Popular Categories</h4>
            <ul className="space-y-2">
              {categories.slice(1, 6).map(c => (
                <li key={c.id}>
                  <button 
                    onClick={() => onSelectCategory(c.id)}
                    className="hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Specialized Tools</h4>
            <ul className="space-y-2">
              {categories.slice(6).map(c => (
                <li key={c.id}>
                  <button 
                    onClick={() => onSelectCategory(c.id)}
                    className="hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={onOpenApiModal}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  ⚡ Developer REST API
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSubmitModal}
                  className="text-indigo-400 font-semibold hover:underline"
                >
                  + Submit Your AI Tool
                </button>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Transparency & Contact</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Pricing and free tier quotas are checked and refreshed regularly. All product names, logos, and brands are property of their respective owners.
            </p>
            <div className="pt-1">
              <span className="text-slate-400 block text-[11px]">Developer Inquiries:</span>
              <span className="text-indigo-300 font-medium">tiwarisatendrapratap@gmail.com</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} ToolMatrix AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Submit API Feedback</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
