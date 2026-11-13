import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Users, 
  Mail, 
  FileText, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Database,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  Trash2,
  Check,
  Search,
  PlusCircle,
  BarChart3,
  Sparkles,
  Layers,
  Send,
  Copy,
  AlertCircle
} from 'lucide-react';
import { 
  fetchSubscribers, 
  fetchSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
  deleteSubscriber,
  addDirectApprovedTool
} from '../lib/supabase';

const ADMIN_MASTER_PASSCODE = 'KHUSHIEE2403';

export default function AdminModal({ 
  isOpen, 
  onClose,
  categories = [],
  tools = [],
  onAddTool
}) {
  // Password protection state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('toolmatrix_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState('subscribers');
  const [subscribers, setSubscribers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState('');

  // Filters & Search
  const [subscribersSearch, setSubscribersSearch] = useState('');
  const [submissionFilter, setSubmissionFilter] = useState('all'); // all, pending, approved, rejected
  const [submissionsSearch, setSubmissionsSearch] = useState('');
  const [copiedText, setCopiedText] = useState('');

  // Fast-Add Form State
  const [fastAddForm, setFastAddForm] = useState({
    name: '',
    category: 'text-to-video',
    pricingType: 'Freemium',
    startingPrice: '$10/mo',
    freeTierDetails: 'Free credits on signup',
    websiteUrl: 'https://',
    tagline: '',
    creatorEmail: 'admin@toolmatrix.ai'
  });
  const [fastAddSuccess, setFastAddSuccess] = useState(false);

  // Load Supabase Database Records
  const loadData = async () => {
    setLoading(true);
    try {
      const [subs, toolSubs] = await Promise.all([
        fetchSubscribers().catch(() => []),
        fetchSubmissions().catch(() => [])
      ]);
      setSubscribers(subs || []);
      setSubmissions(toolSubs || []);
    } catch (err) {
      console.error(err);
      showNotification('Error loading database records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Handle Passcode Unlock
  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_MASTER_PASSCODE) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('toolmatrix_admin_auth', 'true');
      } catch (err) {
        console.error(err);
      }
      setAuthError('');
      setPasscode('');
      loadData();
    } else {
      setAuthError('Incorrect passcode. Access denied.');
    }
  };

  // Handle Lock / Logout
  const handleLock = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('toolmatrix_admin_auth');
    } catch (err) {
      console.error(err);
    }
    setPasscode('');
  };

  // Handle Status Update (Approve / Reject)
  const handleUpdateStatus = async (id, status, toolItem) => {
    setActionLoading(id);
    try {
      await updateSubmissionStatus(id, status);
      setSubmissions(prev => prev.map(item => item.id === id ? { ...item, status } : item));
      showNotification(`Submission marked as ${status.toUpperCase()}`);

      // If approved and onAddTool is provided, optionally publish to active directory
      if (status === 'approved' && onAddTool && toolItem) {
        onAddTool({
          id: toolItem.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: toolItem.name,
          tagline: toolItem.tagline || 'AI tool curated via community submission.',
          category: toolItem.category,
          categoryName: categories.find(c => c.id === toolItem.category)?.name || 'AI App',
          pricingType: toolItem.pricing_type,
          startingPrice: toolItem.starting_price || 'Free',
          freeTierDetails: toolItem.free_tier_details || 'Available',
          rating: 5.0,
          reviewsCount: 1,
          badges: ['Community Approved'],
          websiteUrl: toolItem.website_url,
          specs: {
            resolution: 'High Definition',
            generationSpeed: 'Fast',
            commercialUse: 'Subject to Terms',
            apiAvailable: 'Yes',
            keyFeature: toolItem.tagline,
            pros: ['Verified by Admin', 'Active Community Tool'],
            cons: ['Newly Listed']
          }
        });
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to update status.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Delete Submission
  const handleDeleteSubmission = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission permanently from Supabase?')) {
      return;
    }
    setActionLoading(id);
    try {
      await deleteSubmission(id);
      setSubmissions(prev => prev.filter(item => item.id !== id));
      showNotification('Submission deleted from database.');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete submission.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Delete Subscriber
  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm('Delete this subscriber permanently?')) {
      return;
    }
    setActionLoading(id);
    try {
      await deleteSubscriber(id);
      setSubscribers(prev => prev.filter(item => item.id !== id));
      showNotification('Subscriber removed.');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete subscriber.');
    } finally {
      setActionLoading(null);
    }
  };

  // Export Subscribers to CSV
  const handleExportSubscribersCsv = () => {
    if (subscribers.length === 0) return;
    const headers = ['ID', 'Email', 'Subscribed Date', 'Status'];
    const rows = subscribers.map(s => [
      `"${s.id}"`,
      `"${s.email}"`,
      `"${new Date(s.created_at).toISOString()}"`,
      '"Subscribed"'
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `toolmatrix_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Subscribers CSV exported successfully!');
  };

  // Export Submissions to CSV
  const handleExportSubmissionsCsv = () => {
    if (submissions.length === 0) return;
    const headers = ['ID', 'Name', 'Category', 'Pricing', 'Website', 'Status', 'Creator Email', 'Date'];
    const rows = submissions.map(s => [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.category}"`,
      `"${s.pricing_type}"`,
      `"${s.website_url}"`,
      `"${s.status || 'pending'}"`,
      `"${s.creator_email || ''}"`,
      `"${new Date(s.created_at).toISOString()}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `toolmatrix_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Submissions CSV exported successfully!');
  };

  // Copy Email / Text
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(''), 2000);
  };

  // Fast-Add Direct Tool Submit
  const handleFastAddSubmit = async (e) => {
    e.preventDefault();
    if (!fastAddForm.name || !fastAddForm.websiteUrl) return;

    setLoading(true);
    try {
      await addDirectApprovedTool(fastAddForm);
      if (onAddTool) {
        onAddTool({
          id: fastAddForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: fastAddForm.name,
          tagline: fastAddForm.tagline || 'AI tool published directly by ToolMatrix Admin.',
          category: fastAddForm.category,
          categoryName: categories.find(c => c.id === fastAddForm.category)?.name || 'AI App',
          pricingType: fastAddForm.pricingType,
          startingPrice: fastAddForm.startingPrice,
          freeTierDetails: fastAddForm.freeTierDetails,
          rating: 5.0,
          reviewsCount: 1,
          badges: ['Admin Verified'],
          websiteUrl: fastAddForm.websiteUrl,
          specs: {
            resolution: 'Configurable',
            generationSpeed: 'Fast',
            commercialUse: 'Yes - Commercial',
            apiAvailable: 'Yes',
            keyFeature: fastAddForm.tagline,
            pros: ['Verified by Admin', 'Production-grade AI'],
            cons: ['Recently launched']
          }
        });
      }
      setFastAddSuccess(true);
      loadData();
      setTimeout(() => {
        setFastAddSuccess(false);
        setFastAddForm({
          name: '',
          category: 'text-to-video',
          pricingType: 'Freemium',
          startingPrice: '$10/mo',
          freeTierDetails: 'Free credits on signup',
          websiteUrl: 'https://',
          tagline: '',
          creatorEmail: 'admin@toolmatrix.ai'
        });
      }, 2500);
    } catch (err) {
      console.error(err);
      showNotification('Direct publish failed.');
    } finally {
      setLoading(false);
    }
  };

  // Filtered Subscribers
  const filteredSubscribers = useMemo(() => {
    if (!subscribersSearch.trim()) return subscribers;
    const q = subscribersSearch.toLowerCase();
    return subscribers.filter(s => s.email?.toLowerCase().includes(q));
  }, [subscribers, subscribersSearch]);

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(item => {
      if (submissionFilter !== 'all' && (item.status || 'pending') !== submissionFilter) {
        return false;
      }
      if (submissionsSearch.trim()) {
        const q = submissionsSearch.toLowerCase();
        return (
          item.name?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.creator_email?.toLowerCase().includes(q) ||
          item.tagline?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [submissions, submissionFilter, submissionsSearch]);

  // Analytics Computation
  const analyticsData = useMemo(() => {
    const totalCatalog = tools.length;
    const freeTools = tools.filter(t => t.pricingType === 'Free' || t.pricingType === 'Open Source').length;
    const freemiumTools = tools.filter(t => t.pricingType === 'Freemium').length;
    const paidTools = tools.filter(t => t.pricingType === 'Paid').length;

    const pendingSubmissions = submissions.filter(s => (s.status || 'pending') === 'pending').length;
    const approvedSubmissions = submissions.filter(s => s.status === 'approved').length;

    return {
      totalCatalog,
      freeTools,
      freemiumTools,
      paidTools,
      freePct: totalCatalog > 0 ? Math.round((freeTools / totalCatalog) * 100) : 0,
      freemiumPct: totalCatalog > 0 ? Math.round((freemiumTools / totalCatalog) * 100) : 0,
      paidPct: totalCatalog > 0 ? Math.round((paidTools / totalCatalog) * 100) : 0,
      pendingSubmissions,
      approvedSubmissions
    };
  }, [tools, submissions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-md overflow-y-auto">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          {notification}
        </div>
      )}

      {/* ============================================================== */}
      {/* PASSCODE AUTHENTICATION GATE (When Not Authenticated) */}
      {/* ============================================================== */}
      {!isAuthenticated ? (
        <div className="relative w-full max-w-md bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-orange-950/15 overflow-hidden animate-in zoom-in-95 duration-200 text-center">
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-400 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/25 ring-4 ring-orange-50">
            <Lock className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-600 border border-orange-200 uppercase tracking-wider">
            Protected Admin Gate
          </span>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-3 mb-1">
            Owner Access Only
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
            Enter master admin passcode to access live Supabase database, moderation controls, and directory analytics.
          </p>

          {authError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Enter admin passcode..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError('');
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-center font-mono text-sm tracking-widest focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer text-sm"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-xs font-semibold text-slate-400 hover:text-slate-700 pt-1 cursor-pointer"
            >
              Cancel & Return to Public View
            </button>
          </form>

        </div>
      ) : (
        /* ============================================================== */
        /* UNLOCKED FULL ADMIN COCKPIT & OPERATIONS DASHBOARD */
        /* ============================================================== */
        <div className="relative w-full max-w-5xl bg-white/95 border border-slate-200/90 rounded-3xl shadow-2xl shadow-orange-950/15 overflow-hidden my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
          
          {/* Top Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-b from-orange-50/60 to-white flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">Owner & Admin Cockpit</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200">
                    Live Supabase
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Unlocked: Master
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Moderation, database synchronization, email exports, and platform analytics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                disabled={loading}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Refresh Database Records"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-orange-500' : ''}`} />
                <span className="hidden md:inline">Refresh</span>
              </button>

              <button
                onClick={handleLock}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
                title="Lock Dashboard"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Top Metric Cards */}
          <div className="p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-b border-slate-100 bg-slate-50/50">
            
            <div className="bg-white border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-semibold">Total Directory</span>
                <Layers className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{tools.length}</p>
              <span className="text-[10px] text-slate-400 font-medium">
                {analyticsData.freeTools} Free • {analyticsData.paidTools} Paid
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-semibold">Subscribers</span>
                <Mail className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{subscribers.length}</p>
              <button 
                onClick={handleExportSubscribersCsv}
                className="text-[10px] text-orange-600 hover:underline font-bold flex items-center gap-1 mt-0.5 cursor-pointer"
              >
                <Download className="w-3 h-3" /> Export CSV
              </button>
            </div>

            <div className="bg-white border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-semibold">Submissions</span>
                <FileText className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{submissions.length}</p>
              <span className="text-[10px] text-amber-600 font-bold">
                {analyticsData.pendingSubmissions} Pending Review
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-semibold">Supabase Cloud</span>
                <Database className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-sm font-black text-emerald-600 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </p>
              <a 
                href="https://supabase.com/dashboard/project/aljlnisvrveuwlishgyv"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-slate-400 hover:text-orange-600 flex items-center gap-0.5 mt-1"
              >
                Console <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

          </div>

          {/* Tab Navigation */}
          <div className="px-4 sm:px-6 py-2.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'subscribers'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Newsletter Subscribers ({subscribers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'submissions'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tool Submissions ({submissions.length})</span>
              {analyticsData.pendingSubmissions > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-orange-600 font-extrabold">
                  {analyticsData.pendingSubmissions}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Directory Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('fast-add')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'fast-add'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Fast-Add Tool</span>
            </button>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: NEWSLETTER SUBSCRIBERS */}
          {/* ============================================================== */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {activeTab === 'subscribers' && (
              <div className="space-y-4">
                
                {/* Search & Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search subscriber email..."
                      value={subscribersSearch}
                      onChange={(e) => setSubscribersSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportSubscribersCsv}
                      disabled={subscribers.length === 0}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-600 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV for Resend / Mailchimp</span>
                    </button>
                  </div>
                </div>

                {/* Subscribers Table */}
                {filteredSubscribers.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    No subscribers found matching your query.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200/90 rounded-2xl bg-white shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                          <th className="py-3 px-4 font-bold">Email Address</th>
                          <th className="py-3 px-4 font-bold">Subscribed Date</th>
                          <th className="py-3 px-4 font-bold">Status</th>
                          <th className="py-3 px-4 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredSubscribers.map((s) => (
                          <tr key={s.id} className="hover:bg-orange-50/20 transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                              <span>{s.email}</span>
                              <button
                                onClick={() => handleCopy(s.email, `sub-${s.id}`)}
                                className="text-slate-400 hover:text-orange-600 p-0.5 cursor-pointer"
                                title="Copy Email"
                              >
                                {copiedText === `sub-${s.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-slate-500">
                              {new Date(s.created_at).toLocaleDateString()} at {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                Active Subscriber
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteSubscriber(s.id)}
                                disabled={actionLoading === s.id}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete subscriber"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: TOOL SUBMISSIONS MODERATION */}
            {/* ============================================================== */}
            {activeTab === 'submissions' && (
              <div className="space-y-4">
                
                {/* Search & Status Filter Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'pending', 'approved', 'rejected'].map(status => (
                      <button
                        key={status}
                        onClick={() => setSubmissionFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                          submissionFilter === status
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search tool or creator..."
                        value={submissionsSearch}
                        onChange={(e) => setSubmissionsSearch(e.target.value)}
                        className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <button
                      onClick={handleExportSubmissionsCsv}
                      disabled={submissions.length === 0}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-600 flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      title="Export all submissions as CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">CSV</span>
                    </button>
                  </div>
                </div>

                {/* Submissions List Cards */}
                {filteredSubmissions.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    No tool submissions found in Supabase database.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSubmissions.map((t) => {
                      const status = t.status || 'pending';
                      return (
                        <div 
                          key={t.id} 
                          className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-orange-300 transition-all"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            
                            {/* Tool Information */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-extrabold text-slate-900 text-base">{t.name}</h4>
                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-200">
                                  {t.category}
                                </span>
                                <span className="text-xs text-amber-700 font-semibold">{t.pricing_type}</span>
                                {t.starting_price && (
                                  <span className="text-xs text-slate-500">• {t.starting_price}</span>
                                )}

                                {/* Status Badge */}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {status.toUpperCase()}
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed">{t.tagline || 'No tagline specified.'}</p>
                              
                              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 flex-wrap">
                                {t.creator_email && (
                                  <span>Creator: <strong className="text-slate-600">{t.creator_email}</strong></span>
                                )}
                                {t.free_tier_details && (
                                  <span>Free tier: <strong className="text-slate-600">{t.free_tier_details}</strong></span>
                                )}
                                <span>Submitted: {new Date(t.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* Moderation Controls */}
                            <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                              {status !== 'approved' && (
                                <button
                                  onClick={() => handleUpdateStatus(t.id, 'approved', t)}
                                  disabled={actionLoading === t.id}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                  title="Approve & Publish Tool"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve & Publish</span>
                                </button>
                              )}

                              {status !== 'rejected' && (
                                <button
                                  onClick={() => handleUpdateStatus(t.id, 'rejected', t)}
                                  disabled={actionLoading === t.id}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Reject Submission"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              )}

                              <a
                                href={t.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-orange-500 hover:text-orange-600 text-slate-600 text-xs transition-colors"
                                title="Inspect Website"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>

                              <button
                                onClick={() => handleDeleteSubmission(t.id)}
                                disabled={actionLoading === t.id}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete from Database"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: DIRECTORY ANALYTICS & MARKET BREAKDOWN */}
            {/* ============================================================== */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                
                {/* Visual Pricing Model Share */}
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
                  <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-4 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-orange-500" />
                    <span>Pricing Model Distribution ({tools.length} Tools)</span>
                  </h4>

                  {/* Multi-segment Progress Bar */}
                  <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex mb-3 shadow-inner">
                    <div style={{ width: `${analyticsData.freePct}%` }} className="bg-emerald-500 h-full" title={`Free: ${analyticsData.freePct}%`} />
                    <div style={{ width: `${analyticsData.freemiumPct}%` }} className="bg-amber-500 h-full" title={`Freemium: ${analyticsData.freemiumPct}%`} />
                    <div style={{ width: `${analyticsData.paidPct}%` }} className="bg-purple-500 h-full" title={`Paid: ${analyticsData.paidPct}%`} />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs pt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Free / Open Source</span>
                        <strong className="text-slate-900">{analyticsData.freeTools} tools ({analyticsData.freePct}%)</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Freemium</span>
                        <strong className="text-slate-900">{analyticsData.freemiumTools} tools ({analyticsData.freemiumPct}%)</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                      <div>
                        <span className="text-slate-500 block text-[11px]">Paid / Commercial</span>
                        <strong className="text-slate-900">{analyticsData.paidTools} tools ({analyticsData.paidPct}%)</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories Catalog Share */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                  <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-4 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-orange-500" />
                    <span>Catalog Count by Category</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {categories.filter(c => c.id !== 'all').map(cat => {
                      const count = tools.filter(t => t.category === cat.id).length;
                      return (
                        <div key={cat.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                          <span className="text-slate-500 text-[11px] block truncate">{cat.name}</span>
                          <p className="text-lg font-black text-slate-900 mt-0.5">{count} tools</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cloud & Developer Endpoints Links */}
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5">
                  <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-3">
                    Direct Cloud Operations & API Shortcuts
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <a
                      href="https://supabase.com/dashboard/project/aljlnisvrveuwlishgyv/editor"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white border border-slate-200 rounded-xl hover:border-orange-500 text-slate-700 flex items-center justify-between shadow-2xs transition-colors"
                    >
                      <span className="font-semibold">Supabase Table Editor</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <a
                      href="https://supabase.com/dashboard/project/aljlnisvrveuwlishgyv/auth/users"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white border border-slate-200 rounded-xl hover:border-orange-500 text-slate-700 flex items-center justify-between shadow-2xs transition-colors"
                    >
                      <span className="font-semibold">Supabase User Auth Logs</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <a
                      href="https://shiva-tiwari2403.github.io/ai-tool-matrix/api/tools.json"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white border border-slate-200 rounded-xl hover:border-orange-500 text-slate-700 flex items-center justify-between shadow-2xs transition-colors"
                    >
                      <span className="font-semibold">Live Public tools.json</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>

              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: FAST DIRECT TOOL PUBLISHER */}
            {/* ============================================================== */}
            {activeTab === 'fast-add' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="text-center mb-4">
                  <h4 className="text-base font-bold text-slate-900">Direct Admin Tool Publisher</h4>
                  <p className="text-xs text-slate-500">
                    Tools submitted here are automatically marked as <strong>Approved</strong> and published directly into the active directory & Supabase.
                  </p>
                </div>

                {fastAddSuccess ? (
                  <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                      <Check className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">Tool Successfully Published!</h4>
                    <p className="text-xs text-slate-600">
                      The AI tool has been stored in Supabase with 'approved' status and added to the live catalog.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFastAddSubmit} className="space-y-4 text-xs bg-slate-50/70 border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Tool Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Claude 3.7 Sonnet"
                        value={fastAddForm.name}
                        onChange={(e) => setFastAddForm({ ...fastAddForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                        <select
                          value={fastAddForm.category}
                          onChange={(e) => setFastAddForm({ ...fastAddForm, category: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                        >
                          {categories.filter(c => c.id !== 'all').map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Pricing Model *</label>
                        <select
                          value={fastAddForm.pricingType}
                          onChange={(e) => setFastAddForm({ ...fastAddForm, pricingType: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
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
                        <label className="block text-slate-700 font-semibold mb-1">Starting Price</label>
                        <input
                          type="text"
                          placeholder="e.g. $20/mo or Free"
                          value={fastAddForm.startingPrice}
                          onChange={(e) => setFastAddForm({ ...fastAddForm, startingPrice: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Free Tier Allowance</label>
                        <input
                          type="text"
                          placeholder="e.g. Free trial on signup"
                          value={fastAddForm.freeTierDetails}
                          onChange={(e) => setFastAddForm({ ...fastAddForm, freeTierDetails: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Website URL *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://..."
                        value={fastAddForm.websiteUrl}
                        onChange={(e) => setFastAddForm({ ...fastAddForm, websiteUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Superpower / Tagline</label>
                      <textarea
                        rows="2"
                        placeholder="Key capability of this tool..."
                        value={fastAddForm.tagline}
                        onChange={(e) => setFastAddForm({ ...fastAddForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/25"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? 'Publishing...' : 'Direct Publish to Directory'}</span>
                    </button>
                  </form>
                )}

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
