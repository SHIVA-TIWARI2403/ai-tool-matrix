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
  Zap,
  Heart
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
  Zap: Zap,
  Heart: Heart
};

export default function CategoryNav({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  isFavoritesActive = false,
  favoritesCount = 0,
  onToggleFavorites
}) {
  return (
    <div className="w-full bg-white/80 border-b border-slate-200/80 sticky top-16 sm:top-20 z-30 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          
          {/* Main Category Pills */}
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Sparkles;
            const isSelected = !isFavoritesActive && selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-300'
                    : 'bg-white/80 text-slate-600 hover:text-orange-600 hover:bg-orange-50/60 hover:border-orange-200 border border-slate-200/90 shadow-sm'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-orange-500'}`} />
                <span>{cat.name}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-500 font-semibold'
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
