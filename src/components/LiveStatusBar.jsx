import React from 'react';

export default function LiveStatusBar({ pandals }) {
  const verifiedCount = pandals.filter(p => p.status === 'verified').length;
  const featuredCount = pandals.filter(p => p.isFeatured).length;
  const ecoCount = pandals.filter(p => p.isEcoFriendly).length;
  const prasadCount = pandals.filter(p => p.annadanam?.available).length;

  return (
    <>

      {/* Footer bar */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-200 px-4 py-2 font-sans flex items-center justify-between gap-4 shadow-sm">
        <span className="text-[11px] font-semibold text-[#8B1A1A] tracking-tight whitespace-nowrap">
          Bengaluru Ganesh Utsav 2026
        </span>

        <div className="hidden md:flex items-center gap-4 text-[11px] text-gray-500">
          <span><span className="font-bold text-gray-800">{pandals.length}</span> Pandals</span>
          <span className="text-gray-200">|</span>
          <span><span className="font-bold text-amber-600">{featuredCount}</span> Featured</span>
          <span className="text-gray-200">|</span>
          <span><span className="font-bold text-emerald-600">{ecoCount}</span> Eco-friendly</span>
          <span className="text-gray-200">|</span>
          <span><span className="font-bold text-orange-600">{prasadCount}</span> Prasad Seva</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Updates
        </div>
      </div>
    </>
  );
}
