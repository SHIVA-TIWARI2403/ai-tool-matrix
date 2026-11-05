import React, { useState } from 'react';
import { X, Code2, Copy, Check, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function ApiModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('javascript');
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const baseUrl = 'https://shiva-tiwari2403.github.io/ai-tool-matrix/api';

  const endpoints = [
    {
      method: 'GET',
      path: '/tools.json',
      desc: 'Returns full list of 30+ AI models & tools with pricing, specs & benchmarks.',
      url: `${baseUrl}/tools.json`
    },
    {
      method: 'GET',
      path: '/categories.json',
      desc: 'Returns all 8 AI tool categories with tool counts and icon names.',
      url: `${baseUrl}/categories.json`
    },
    {
      method: 'GET',
      path: '/stats.json',
      desc: 'Summary statistics including total free vs freemium vs paid tools.',
      url: `${baseUrl}/stats.json`
    }
  ];

  const codeSnippets = {
    javascript: `// Fetch all AI tools with JavaScript
fetch('${baseUrl}/tools.json')
  .then(res => res.json())
  .then(data => {
    console.log(\`Loaded \${data.total} AI tools:\`);
    data.tools.forEach(tool => {
      console.log(\`\${tool.name} (\${tool.categoryName}) - \${tool.pricingType}\`);
    });
  })
  .catch(err => console.error('API Error:', err));`,

    python: `# Fetch all AI tools with Python
import requests

url = "${baseUrl}/tools.json"
response = requests.get(url)
data = response.json()

print(f"Total AI Tools: {data['total']}")
for tool in data['tools']:
    print(f"- {tool['name']} | {tool['pricingType']} | {tool['startingPrice']}")`,

    curl: `# Quick cURL query in your terminal
curl -s "${baseUrl}/tools.json" | jq '.tools[] | {name, categoryName, pricingType}'`
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">Public Developer API</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Open REST API endpoints for developers, AI agents & dashboards.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Highlights Banner */}
        <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center text-xs">
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold">Authentication</span>
            <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> No Key Needed
            </span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold">Rate Limits</span>
            <span className="text-indigo-400 font-semibold mt-0.5 block">Unlimited</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase font-bold">CDN Hosting</span>
            <span className="text-sky-400 font-semibold mt-0.5 block">Global Fastly CDN</span>
          </div>
        </div>

        {/* Endpoints List */}
        <div className="space-y-2.5 mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Endpoints</h4>
          {endpoints.map((ep, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs gap-3 group hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {ep.method}
                </span>
                <span className="font-mono text-slate-200 text-xs font-medium truncate">
                  {ep.path}
                </span>
                <span className="text-slate-500 text-[11px] hidden sm:inline truncate">
                  — {ep.desc}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopy(ep.url, `ep-${idx}`)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy Endpoint URL"
                >
                  {copiedIndex === `ep-${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={ep.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Code Snippets Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Code Snippets</h4>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {['javascript', 'python', 'curl'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded-lg capitalize text-[11px] font-semibold transition-all ${
                    activeTab === tab 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'javascript' ? 'JS' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs overflow-x-auto text-slate-300">
            <button
              onClick={() => handleCopy(codeSnippets[activeTab], 'snippet')}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Copy snippet"
            >
              {copiedIndex === 'snippet' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <pre className="pr-8 text-[11px] leading-relaxed">
              {codeSnippets[activeTab]}
            </pre>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Created by Shiva Tiwari</span>
          <a 
            href="https://github.com/SHIVA-TIWARI2403/ai-tool-matrix" 
            target="_blank" 
            rel="noreferrer"
            className="text-indigo-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
