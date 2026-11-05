import React from 'react';
import { 
  Sparkles, 
  Video, 
  Film, 
  Image as ImageIcon, 
  BotMessageSquare, 
  Scale, 
  Mic, 
  Code2, 
  Zap 
} from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Video: Video,
  Film: Film,
  Image: ImageIcon,
  BotMessageSquare: BotMessageSquare,
  Scale: Scale,
  Mic: Mic,
  Code2: Code2,
  Zap: Zap
};

export default function CategoryNav({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full bg-slate-950 border-b border-slate-800/80 sticky top-16 sm:top-20 z-30 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Sparkles;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:bg-slate-850 border border-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                <span>{cat.name}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
