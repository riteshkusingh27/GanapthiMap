import React from 'react';
import { ChevronLeft, ChevronRight, Search, Star, ChevronDown, X, SlidersHorizontal } from 'lucide-react';

const CATEGORY_COLORS = {
  featured: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', label: 'Featured' },
  eco:      { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', label: 'Eco Clay' },
  trending: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-400', label: 'Trending' },
};

function getCategoryBadge(pandal) {
  if (pandal.isFeatured) return CATEGORY_COLORS.featured;
  if (pandal.isEcoFriendly) return CATEGORY_COLORS.eco;
  if (pandal.isTrending) return CATEGORY_COLORS.trending;
  return null;
}

export default function DiscoverySidebar({
  pandals,
  selectedPandal,
  onSelectPandal,
  isOpen,
  onToggleOpen,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterToggle
}) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'near_me', label: 'Nearby' },
    { id: 'featured', label: 'Featured' },
    { id: 'trending', label: 'Trending' },
    { id: 'eco', label: 'Eco-friendly' },
    { id: 'annadanam', label: 'Prasad' },
  ];

  return (
    <>
      {/* ── Desktop Left Sidebar ───────────────────────────────── */}
      <aside className={`hidden sm:flex fixed top-4 bottom-4 left-4 z-30 flex-col transition-all duration-300 ease-in-out ${isOpen ? 'w-[340px]' : 'w-0 overflow-hidden'}`}>
        
        {/* Collapse / Expand Tab */}
        <button
          onClick={onToggleOpen}
          className={`absolute top-5 z-50 w-7 h-10 bg-white border border-gray-200 shadow-md flex items-center justify-center transition-all duration-300 ${isOpen ? '-right-3 rounded-r-lg' : '-right-7 rounded-r-lg opacity-0 pointer-events-none'}`}
        >
          <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
        </button>

        <div className="w-full h-full bg-white border border-gray-200/80 shadow-xl rounded-2xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 tracking-tight">Explore Pandals</h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-gray-400">{pandals.length} results</span>
                <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 font-semibold px-1.5 py-0.5 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Live
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search pandals or areas…"
                className="w-full pl-8.5 pr-7 py-2 bg-gray-50 text-gray-800 placeholder:text-gray-400 text-xs rounded-lg border border-gray-200 focus:border-gray-400 focus:bg-white focus:outline-none transition font-medium"
              />
              {searchQuery && (
                <button onClick={() => onSearchChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {filters.map((f) => {
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => onFilterToggle(f.id)}
                    className={`shrink-0 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[#8B1A1A] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pandal List */}
          <div className="flex-1 overflow-y-auto">
            {pandals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">🔍</div>
                <p className="text-sm font-semibold text-gray-700">No pandals found</p>
                <p className="text-xs text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pandals.map((pandal) => {
                  const isSelected = selectedPandal?.id === pandal.id;
                  const badge = getCategoryBadge(pandal);
                  return (
                    <div
                      key={pandal.id}
                      onClick={() => onSelectPandal(pandal)}
                      className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#8B1A1A]/5 border-l-2 border-[#8B1A1A]' : 'hover:bg-gray-50 border-l-2 border-transparent'
                      }`}
                    >
                      <img
                        src={pandal.coverImage}
                        alt={pandal.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <h3 className={`text-xs font-semibold leading-tight truncate ${isSelected ? 'text-[#8B1A1A]' : 'text-gray-900'}`}>
                            {pandal.name}
                          </h3>
                          {pandal.status === 'verified' && (
                            <span className="shrink-0 text-[9px] text-[#8B1A1A] font-bold">✓</span>
                          )}
                        </div>

                        <p className="text-[11px] text-gray-400 truncate mb-1.5">
                          {pandal.locality}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-semibold text-emerald-600">Open now</span>
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-semibold">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> 4.8
                          </span>
                          {badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Desktop Expand Button (when sidebar is closed) ─────── */}
      {!isOpen && (
        <button
          onClick={onToggleOpen}
          className="hidden sm:flex fixed top-5 left-4 z-30 items-center gap-2 bg-white border border-gray-200 shadow-lg text-gray-700 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
          Explore Pandals
        </button>
      )}

      {/* ── Mobile Bottom Sheet ────────────────────────────────── */}
      <div className={`sm:hidden fixed z-30 left-0 right-0 transition-all duration-300 ease-out ${isOpen ? 'bottom-0' : 'bottom-[-85vh]'}`} style={{ maxHeight: '78vh' }}>
        <div className="bg-white rounded-t-2xl border-t border-gray-200 shadow-2xl flex flex-col" style={{ maxHeight: '78vh' }}>
          
          {/* Pull Handle */}
          <div className="flex justify-center pt-3 pb-2 cursor-pointer" onClick={onToggleOpen}>
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Mobile Header */}
          <div className="px-4 pb-3 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Explore Pandals</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> {pandals.length} live
                </span>
                <button onClick={onToggleOpen}><X className="w-4 h-4 text-gray-400" /></button>
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search pandals in Bengaluru…"
                className="w-full pl-8.5 pr-7 py-2.5 bg-gray-50 text-gray-800 placeholder:text-gray-400 text-sm rounded-xl border border-gray-200 focus:border-gray-400 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
              {filters.map((f) => {
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => onFilterToggle(f.id)}
                    className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      isActive ? 'bg-[#8B1A1A] text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {pandals.map((pandal) => {
              const isSelected = selectedPandal?.id === pandal.id;
              const badge = getCategoryBadge(pandal);
              return (
                <div
                  key={pandal.id}
                  onClick={() => { onSelectPandal(pandal); onToggleOpen(); }}
                  className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${isSelected ? 'bg-[#8B1A1A]/5' : 'active:bg-gray-50'}`}
                >
                  <img src={pandal.coverImage} alt={pandal.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-1 mb-0.5">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{pandal.name}</h3>
                      {pandal.status === 'verified' && <span className="text-[#8B1A1A] text-[10px] font-bold shrink-0">✓</span>}
                    </div>
                    <p className="text-xs text-gray-400 truncate mb-1.5">{pandal.locality}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-600">Open now</span>
                      <span className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.8
                      </span>
                      {badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.bg} ${badge.text}`}>{badge.label}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Open Trigger FAB (when sheet is closed) */}
      {!isOpen && (
        <button
          onClick={onToggleOpen}
          className="sm:hidden fixed bottom-16 left-1/2 -translate-x-1/2 z-30 bg-[#8B1A1A] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-[#6f1515] transition-all"
        >
          🪔 View {pandals.length} Pandals
        </button>
      )}
    </>
  );
}
