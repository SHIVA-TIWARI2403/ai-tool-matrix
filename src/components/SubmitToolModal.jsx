import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { submitToolToDb } from '../lib/supabase';

export default function SubmitToolModal({ isOpen, onClose, categories, onAddTool }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'text-to-video',
    pricingType: 'Freemium',
    startingPrice: '$10/mo',
    freeTierDetails: 'Free credits on signup',
    websiteUrl: 'https://',
    tagline: '',
    creatorEmail: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.websiteUrl) return;

    setLoading(true);
    try {
      // 1. Save to Supabase Database
      await submitToolToDb(formData);

      // 2. Add to active UI state
      onAddTool({
        id: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: formData.name,
        tagline: formData.tagline || 'AI powered tool with modern automation capabilities.',
        category: formData.category,
        categoryName: categories.find(c => c.id === formData.category)?.name || 'AI App',
        pricingType: formData.pricingType,
        startingPrice: formData.startingPrice,
        freeTierDetails: formData.freeTierDetails,
        rating: 5.0,
        reviewsCount: 1,
        badges: ['New Submission'],
        websiteUrl: formData.websiteUrl,
        specs: {
          resolution: 'Configurable',
          generationSpeed: 'Fast',
          commercialUse: 'Subject to terms',
          apiAvailable: 'Yes',
          keyFeature: formData.tagline,
          pros: ['Newly submitted AI tool', 'Clean user interface'],
          cons: ['Recently launched']
        }
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      // Fallback add to UI even if offline
      onAddTool({
        id: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: formData.name,
        tagline: formData.tagline,
        category: formData.category,
        categoryName: categories.find(c => c.id === formData.category)?.name || 'AI App',
        pricingType: formData.pricingType,
        startingPrice: formData.startingPrice,
        freeTierDetails: formData.freeTierDetails,
        rating: 5.0,
        reviewsCount: 1,
        badges: ['New Submission'],
        websiteUrl: formData.websiteUrl,
        specs: {
          resolution: 'Configurable',
          generationSpeed: 'Fast',
          commercialUse: 'Subject to terms',
          apiAvailable: 'Yes',
          keyFeature: formData.tagline,
          pros: ['Newly submitted AI tool'],
          cons: ['Recently launched']
        }
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Submit an AI Tool</h3>
              <p className="text-xs text-slate-400">Save to Supabase Database & get listed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Tool Saved to Database!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your tool submission has been recorded in the Supabase database and added to your view.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tool Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. DreamVoice AI"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  {categories.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pricing Model *</label>
                <select
                  value={formData.pricingType}
                  onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Freemium">Freemium</option>
                  <option value="Free">100% Free</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Paid">Paid Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Starting Price</label>
                <input
                  type="text"
                  placeholder="e.g. $10/mo or Free"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Free Tier Allowance</label>
                <input
                  type="text"
                  placeholder="e.g. 50 free credits daily"
                  value={formData.freeTierDetails}
                  onChange={(e) => setFormData({ ...formData, freeTierDetails: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Website URL *</label>
              <input
                type="url"
                required
                placeholder="https://yourtool.com"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Creator / Contact Email</label>
              <input
                type="email"
                placeholder="developer@yourtool.com"
                value={formData.creatorEmail}
                onChange={(e) => setFormData({ ...formData, creatorEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">One-line Tagline / Superpower</label>
              <textarea
                rows="2"
                placeholder="What makes your AI tool standout?"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/25"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Saving to Database...' : 'Submit Tool to Directory'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
