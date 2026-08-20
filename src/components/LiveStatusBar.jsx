import React from 'react';

export default function LiveStatusBar({ pandals }) {
  const verifiedCount = pandals.filter(p => p.status === 'verified').length;

  return (
    <div className="fixed top-4 right-4 z-20 pointer-events-auto hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full shadow-sm text-xs font-medium font-sans">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      <span className="text-slate-900 font-semibold">{verifiedCount} Pandals</span> Live
    </div>
  );
}
