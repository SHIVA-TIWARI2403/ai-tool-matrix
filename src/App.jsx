import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import FilterBar from './components/FilterBar';
import ToolCard from './components/ToolCard';
import CompareDrawer from './components/CompareDrawer';
import CompareModal from './components/CompareModal';
import ToolDetailModal from './components/ToolDetailModal';
import SubmitToolModal from './components/SubmitToolModal';
import AuthModal from './components/AuthModal';
import AdminModal from './components/AdminModal';
import ApiModal from './components/ApiModal';
import NewsletterSection from './components/NewsletterSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import { categories, toolsData } from './data/toolsData';
import { 
  supabase, 
  fetchUserFavorites, 
  addFavorite, 
  removeFavorite 
} from './lib/supabase';
import { Scale, Sparkles } from 'lucide-react';

export default function App() {
  const [tools, setTools] = useState(toolsData);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pricingFilter, setPricingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [comparedTools, setComparedTools] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedToolDetail, setSelectedToolDetail] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Favorites & Bookmarks
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('toolmatrix_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isFavoritesOnly, setIsFavoritesOnly] = useState(false);

  // Parse shareable comparison from URL on mount (?compare=tool1,tool2)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const compareParam = params.get('compare');
      if (compareParam) {
        const ids = compareParam.split(',').map(s => s.trim().toLowerCase());
        const matched = toolsData.filter(t => ids.includes(t.id));
        if (matched.length > 0) {
          setComparedTools(matched);
          setIsCompareModalOpen(true);
        }
      }
    } catch (err) {
      console.error('URL parse error:', err);
    }
  }, []);

  // Sync comparison to browser URL query parameter
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (comparedTools.length > 0) {
        url.searchParams.set('compare', comparedTools.map(t => t.id).join(','));
      } else {
        url.searchParams.delete('compare');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (err) {
      console.error('URL replace error:', err);
    }
  }, [comparedTools]);

  // Monitor Supabase Authentication state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAuthModalOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync Supabase user favorites when logged in
  useEffect(() => {
    if (user?.id) {
      fetchUserFavorites(user.id).then((serverFavorites) => {
        if (serverFavorites && serverFavorites.length > 0) {
          setFavorites(prev => {
            const merged = Array.from(new Set([...prev, ...serverFavorites]));
            localStorage.setItem('toolmatrix_favorites', JSON.stringify(merged));
            return merged;
          });
        }
      });
    }
  }, [user]);

  // Handle favorite bookmark toggle
  const handleToggleFavorite = async (toolId) => {
    const isFav = favorites.includes(toolId);
    const updated = isFav ? favorites.filter(id => id !== toolId) : [...favorites, toolId];
    setFavorites(updated);
    try {
      localStorage.setItem('toolmatrix_favorites', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (user?.id) {
      try {
        if (isFav) {
          await removeFavorite(user.id, toolId);
        } else {
          await addFavorite(user.id, toolId);
        }
      } catch (err) {
        console.error('Failed to sync favorite with Supabase:', err);
      }
    }
  };

  // Find Free Alternative shortcut handler
  const handleFindFreeAlternatives = (category) => {
    setSelectedCategory(category);
    setPricingFilter('free-open');
    setIsFavoritesOnly(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Dynamic category counts based on current tools list
  const dynamicCategories = useMemo(() => {
    return categories.map(cat => {
      if (cat.id === 'all') {
        return { ...cat, count: tools.length };
      }
      const count = tools.filter(t => t.category === cat.id).length;
      return { ...cat, count };
    });
  }, [tools]);

  // Filter & Search Logic
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // 0. Favorites Only Filter
      if (isFavoritesOnly && !favorites.includes(tool.id)) {
        return false;
      }

      // 1. Category Filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // 2. Pricing Filter
      if (pricingFilter === 'free-open') {
        if (tool.pricingType !== 'Free' && tool.pricingType !== 'Open Source') {
          return false;
        }
      } else if (pricingFilter !== 'all' && tool.pricingType !== pricingFilter) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = tool.name.toLowerCase().includes(q);
        const matchesTagline = tool.tagline.toLowerCase().includes(q);
        const matchesCategory = tool.categoryName.toLowerCase().includes(q);
        const matchesBadges = tool.badges?.some(b => b.toLowerCase().includes(q));
        if (!matchesName && !matchesTagline && !matchesCategory && !matchesBadges) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [tools, selectedCategory, pricingFilter, searchQuery, sortBy, isFavoritesOnly, favorites]);

  // Compare Toggle Logic (Max 4 tools)
  const handleToggleCompare = (tool) => {
    const isAlreadyCompared = comparedTools.some(t => t.id === tool.id);
    if (isAlreadyCompared) {
      setComparedTools(comparedTools.filter(t => t.id !== tool.id));
    } else {
      if (comparedTools.length >= 4) {
        alert('You can compare up to 4 tools at a time. Please remove one first.');
        return;
      }
      setComparedTools([...comparedTools, tool]);
    }
  };

  const handleRemoveComparedTool = (toolId) => {
    setComparedTools(comparedTools.filter(t => t.id !== toolId));
  };

  const handleClearAllCompared = () => {
    setComparedTools([]);
  };

  // Preset comparison selector
  const handleSelectPreset = (toolIds) => {
    const selected = tools.filter(t => toolIds.includes(t.id));
    setComparedTools(selected);
  };

  // Add new tool from Submit modal
  const handleAddTool = (newTool) => {
    setTools([newTool, ...tools]);
  };

  // Quick Compare All in current Category
  const handleCompareCategory = () => {
    const currentCategoryTools = filteredTools.slice(0, 3);
    if (currentCategoryTools.length > 0) {
      setComparedTools(currentCategoryTools);
      setIsCompareModalOpen(true);
    }
  };

  const activeCategoryName = categories.find(c => c.id === selectedCategory)?.name || 'All Tools';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Header with Google/Email Auth, Saved Bookmarks & Admin DB */}
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setIsFavoritesOnly(false);
        }}
        categories={dynamicCategories}
        compareCount={comparedTools.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        onSelectFavorites={() => setIsFavoritesOnly(prev => !prev)}
      />

      {/* Hero Section */}
      <Hero
        totalToolsCount={tools.length}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setIsFavoritesOnly(false);
        }}
      />

      {/* Category Navigation Bar */}
      <CategoryNav
        categories={dynamicCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setIsFavoritesOnly(false);
          window.scrollTo({ top: 320, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Section Header with Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>{isFavoritesOnly ? '❤️ Your Saved Tools' : activeCategoryName}</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                  {filteredTools.length} Available
                </span>
              </h2>
              {isFavoritesOnly && (
                <button
                  onClick={() => setIsFavoritesOnly(false)}
                  className="text-xs text-orange-600 font-bold hover:underline cursor-pointer ml-2"
                >
                  ← View All Tools
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isFavoritesOnly 
                ? 'Your personal bookmarked AI tools synced securely via Supabase Cloud.'
                : 'Select any tool or click "Add to Compare" to evaluate side-by-side specs and pricing.'}
            </p>
          </div>

          {/* Quick "Compare Top in this Category" Button */}
          {selectedCategory !== 'all' && filteredTools.length >= 2 && !isFavoritesOnly && (
            <button
              onClick={handleCompareCategory}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-600 border border-orange-200 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-white transition-all cursor-pointer self-start sm:self-auto shadow-xs"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Top {activeCategoryName} Tools</span>
            </button>
          )}
        </div>

        {/* Filter & Sort Bar */}
        <FilterBar
          pricingFilter={pricingFilter}
          setPricingFilter={setPricingFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalResults={filteredTools.length}
          onResetFilters={() => {
            setIsFavoritesOnly(false);
            setSelectedCategory('all');
            setPricingFilter('all');
            setSearchQuery('');
          }}
        />

        {/* Tools Cards Grid */}
        {filteredTools.length === 0 ? (
          <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl shadow-xs">
            <Sparkles className="w-10 h-10 text-orange-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {isFavoritesOnly ? "No saved tools yet" : "No tools match your criteria"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              {isFavoritesOnly
                ? "Click the heart icon on any tool card to bookmark it to your personal list."
                : "Try resetting your filters or search keywords to view other AI tools in our directory."}
            </p>
            <button
              onClick={() => {
                setIsFavoritesOnly(false);
                setSelectedCategory('all');
                setPricingFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:brightness-105 transition-all shadow-md shadow-orange-500/25 cursor-pointer"
            >
              {isFavoritesOnly ? "Browse All Tools" : "Reset All Filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isCompared={comparedTools.some(t => t.id === tool.id)}
                onToggleCompare={handleToggleCompare}
                onOpenDetails={setSelectedToolDetail}
                isFavorite={favorites.includes(tool.id)}
                onToggleFavorite={handleToggleFavorite}
                onFindFreeAlternatives={handleFindFreeAlternatives}
              />
            ))}
          </div>
        )}

        {/* FAQ Section (AEO & GEO Knowledge Base) */}
        <FaqSection />

        {/* Newsletter Section (Integrated with Supabase) */}
        <NewsletterSection />

      </main>

      {/* Floating Compare Bottom Drawer */}
      <CompareDrawer
        comparedTools={comparedTools}
        onRemoveTool={handleRemoveComparedTool}
        onClearAll={handleClearAllCompared}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
      />

      {/* Side-by-Side Comparison Modal with Share Link */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        tools={comparedTools}
        onRemoveTool={handleRemoveComparedTool}
        onSelectPreset={handleSelectPreset}
      />

      {/* Single Tool Detail Modal */}
      <ToolDetailModal
        isOpen={Boolean(selectedToolDetail)}
        tool={selectedToolDetail}
        onClose={() => setSelectedToolDetail(null)}
        isCompared={comparedTools.some(t => t.id === selectedToolDetail?.id)}
        onToggleCompare={handleToggleCompare}
      />

      {/* Submit Tool Modal (Saves to Supabase Database) */}
      <SubmitToolModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        categories={categories}
        onAddTool={handleAddTool}
      />

      {/* User Login Modal (Google OAuth & Magic Link) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
      />

      {/* Admin Dashboard Modal (Live Supabase View) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        categories={categories}
        tools={tools}
        onAddTool={handleAddTool}
      />

      {/* Developer REST API Modal */}
      <ApiModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

      {/* Footer */}
      <Footer
        categories={categories}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setIsFavoritesOnly(false);
          window.scrollTo({ top: 320, behavior: 'smooth' });
        }}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

    </div>
  );
}
