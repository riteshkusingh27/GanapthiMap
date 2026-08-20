import React from 'react';

export default function LiveStatusBar({ pandals }) {
  const verifiedCount = pandals.filter(p => p.status === 'verified').length;
  const featuredCount = pandals.filter(p => p.isFeatured).length;
  const ecoCount = pandals.filter(p => p.isEcoFriendly).length;
  const prasadCount = pandals.filter(p => p.annadanam?.available).length;

  return (
    <>
      {/* Top Right Live Badge */}
      <div className="fixed top-4 right-4 z-20 pointer-events-auto hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full shadow-sm text-xs font-medium font-sans">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-slate-900 font-semibold">{verifiedCount} Pandals</span> Live
      </div>

      {/* Minimal Light Bottom Footer Bar */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-white/95 text-slate-700 backdrop-blur-md border-t border-slate-200/90 px-4 py-2 text-center text-xs font-medium font-sans flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[#7A1C1C] font-semibold text-xs tracking-tight">🪔 Bengaluru Ganesh Utsav 2026</span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-normal text-slate-500">
          <span className="flex items-center gap-1 text-slate-800 font-medium">
            <span className="text-[#7A1C1C] font-bold">{pandals.length}</span> Total Pandals
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            ⭐ <span className="font-semibold text-slate-800">{featuredCount}</span> Featured
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            🌱 <span className="font-semibold text-slate-800">{ecoCount}</span> Eco-friendly
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            🍛 <span className="font-semibold text-slate-800">{prasadCount}</span> Prasad Seva
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Updates Active
        </div>
      </div>
    </>
  );
}
