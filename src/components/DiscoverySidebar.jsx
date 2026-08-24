import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Star, X, MapPin, Clock, Leaf, Flame, Sparkles, Users, ShieldCheck, ImageOff } from 'lucide-react';

const CATEGORY_CONFIG = {
  featured: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    pill: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
    dot: 'bg-amber-400',
    icon: <Sparkles className="w-2.5 h-2.5" />,
    label: 'Featured',
  },
  eco: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    pill: 'bg-gradient-to-r from-emerald-400 to-green-500 text-white',
    dot: 'bg-emerald-400',
    icon: <Leaf className="w-2.5 h-2.5" />,
    label: 'Eco Clay',
  },
  trending: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
    pill: 'bg-gradient-to-r from-rose-500 to-red-500 text-white',
    dot: 'bg-rose-400',
    icon: <Flame className="w-2.5 h-2.5" />,
    label: 'Trending',
  },
};

const CROWD_CONFIG = {
  Heavy:    { color: 'text-rose-600',    bg: 'bg-rose-50',    bar: 'bg-rose-400',    width: 'w-full' },
  Moderate: { color: 'text-amber-600',   bg: 'bg-amber-50',   bar: 'bg-amber-400',   width: 'w-2/3' },
  Low:      { color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-400', width: 'w-1/3' },
};

function getCategoryBadge(pandal) {
  if (pandal.isFeatured) return CATEGORY_CONFIG.featured;
  if (pandal.isEcoFriendly) return CATEGORY_CONFIG.eco;
  if (pandal.isTrending) return CATEGORY_CONFIG.trending;
  return null;
}

const FILTERS = [
  { id: 'all',       label: 'All'       },
  { id: 'near_me',   label: 'Nearby'    },
  { id: 'featured',  label: 'Featured'  },
  { id: 'trending',  label: 'Trending'  },
  { id: 'eco',       label: 'Eco'       },
  { id: 'annadanam', label: 'Prasad'    },
];

function PandalCard({ pandal, isSelected, onClick }) {
  const badge = getCategoryBadge(pandal);
  const crowd = CROWD_CONFIG[pandal.crowdLevel] || CROWD_CONFIG.Low;

  return (
    <div
      onClick={onClick}
      className={`group relative flex gap-3 px-3.5 py-3 cursor-pointer transition-all duration-200 border-b border-gray-100/80 last:border-0 ${
        isSelected
          ? 'bg-gradient-to-r from-[#8B1A1A]/8 to-amber-50/30 border-l-[3px] border-l-[#8B1A1A]'
          : 'hover:bg-gray-50/80 border-l-[3px] border-l-transparent'
      }`}
    >
      {/* Image */}
      <div className="relative shrink-0">
        <div className={`w-[62px] h-[62px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
          isSelected ? 'border-[#8B1A1A]/40 shadow-md shadow-[#8B1A1A]/15' : 'border-gray-100 group-hover:border-gray-200'
        }`}>
          {pandal.coverImage ? (
            <img
              src={pandal.coverImage}
              alt={pandal.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 gap-1">
              <ImageOff className="w-5 h-5 text-slate-400" />
              <span className="text-[8px] font-semibold text-slate-400 leading-none">No Photo</span>
            </div>
          )}
        </div>
        {pandal.status === 'verified' && (
          <div className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#8B1A1A] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            <span className="text-white text-[7px] font-black">✓</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name row */}
        <div className="flex items-start gap-1 mb-0.5">
          <h3 className={`flex-1 text-[12.5px] font-bold leading-snug line-clamp-2 transition-colors ${
            isSelected ? 'text-[#8B1A1A]' : 'text-gray-900 group-hover:text-[#8B1A1A]'
          }`}>
            {pandal.name}
          </h3>
        </div>

        {/* Locality & Distance */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <MapPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />
          <p className="text-[10.5px] text-gray-400 font-medium truncate">{pandal.locality}</p>
          {pandal.distKm != null && (
            <span className="text-[9.5px] font-bold text-[#8B1A1A] bg-[#8B1A1A]/10 px-1.5 py-0.5 rounded-full shrink-0">
              {pandal.distKm < 1 ? `${Math.round(pandal.distKm * 1000)} m` : `${pandal.distKm.toFixed(1)} km`}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Open status */}
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block shrink-0" />
            Open
          </span>

          {/* Rating */}
          <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" />
            4.8
          </span>

          {/* Category Badge */}
          {badge && (
            <span className={`flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge.pill} shadow-sm`}>
              {badge.icon}
              {badge.label}
            </span>
          )}
        </div>

        {/* Crowd indicator */}
        {pandal.crowdLevel && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Users className="w-2.5 h-2.5 text-gray-400 shrink-0" />
            <div className="flex-1 bg-gray-100 rounded-full h-1">
              <div className={`h-full rounded-full ${crowd.bar} ${crowd.width} transition-all`} />
            </div>
            <span className={`text-[9px] font-semibold ${crowd.color}`}>{pandal.crowdLevel}</span>
          </div>
        )}
      </div>
    </div>
  );
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
  onFilterToggle,
  onAddPandalClick,
  onOpenPrivacyModal,
}) {
  return (
    <>
      {/* ── Desktop Left Sidebar ───────────────────────────────── */}
      <aside
        className={`hidden sm:flex fixed top-4 bottom-4 left-4 z-30 flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'w-[340px]' : 'w-0 overflow-hidden'
        }`}
      >
        {/* Collapse Tab */}
        <button
          onClick={onToggleOpen}
          className={`absolute top-5 z-50 w-6 h-10 bg-white border border-gray-200/80 shadow-md flex items-center justify-center transition-all duration-300 ${
            isOpen ? '-right-3 rounded-r-lg' : '-right-7 rounded-r-lg opacity-0 pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-3 h-3 text-gray-400" />
        </button>

        <div className="w-full h-full bg-white/95 backdrop-blur-xl border border-gray-200/70 shadow-2xl shadow-black/10 rounded-2xl flex flex-col overflow-hidden">

          {/* ── Sidebar Header ─── */}
          <div className="shrink-0 px-4 pt-4 pb-3.5 bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-100">

            {/* Title + Live badge */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <img
                  src="https://res.cloudinary.com/dtigmagdl/image/upload/v1787463675/927b6a8c-c53d-4267-9960-1ca4c824e8cd_u1drzf.png"
                  alt="GanapathiMap"
                  className="h-11 w-auto object-contain max-w-[180px]"
                />
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Bengaluru Ganesh Utsava 2025</p>
              </div>
              <div className="flex items-center gap-1.5">
                {onAddPandalClick && (
                  <button
                    onClick={onAddPandalClick}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition shadow-sm"
                  >
                    + Add Pandal
                  </button>
                )}
                <div className="flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-sm shadow-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                  LIVE
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-2.5">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search pandals or areas…"
                className="w-full pl-9 pr-8 py-2 bg-gray-100 text-gray-800 placeholder:text-gray-400 text-xs rounded-xl border border-transparent focus:border-[#8B1A1A]/30 focus:bg-white focus:outline-none transition-all duration-200 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 hover:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => onFilterToggle(f.id)}
                    className={`shrink-0 text-[10.5px] font-bold px-2.5 py-1 rounded-xl transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-[#8B1A1A] to-[#a82323] text-white shadow-sm shadow-[#8B1A1A]/25 scale-105'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Pandal List ─── */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {pandals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl shadow-inner">🔍</div>
                <div>
                  <p className="text-sm font-bold text-gray-700">No pandals found</p>
                  <p className="text-xs text-gray-400 mt-0.5">Try adjusting your search or filters</p>
                </div>
                <button
                  onClick={() => { onSearchChange(''); onFilterToggle('all'); }}
                  className="text-xs font-semibold text-[#8B1A1A] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div>
                {pandals.map((pandal) => (
                  <PandalCard
                    key={pandal.id}
                    pandal={pandal}
                    isSelected={selectedPandal?.id === pandal.id}
                    onClick={() => onSelectPandal(pandal)}
                  />
                ))}

                {/* Footer */}
                <div className="py-4 px-4 text-center border-t border-gray-100 flex flex-col items-center gap-1.5 bg-gray-50/50">
                  <p className="text-[10px] text-gray-400 font-medium">Showing all {pandals.length} verified pandals</p>
                  {onOpenPrivacyModal && (
                    <button
                      onClick={onOpenPrivacyModal}
                      className="text-[10px] text-[#8B1A1A] font-bold hover:underline flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3 h-3" /> Privacy & Community Guidelines
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Desktop Expand Button (sidebar closed) ─── */}
      {!isOpen && (
        <button
          onClick={onToggleOpen}
          className="hidden sm:flex fixed top-5 left-4 z-30 items-center gap-2 bg-white border border-gray-200 shadow-lg text-gray-700 px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
        >
          <ChevronRight className="w-3.5 h-3.5" />
          Explore Pandals
        </button>
      )}

      {/* ── Mobile Bottom Sheet ─── */}
      <div
        className={`sm:hidden fixed z-30 left-0 right-0 transition-all duration-300 ease-out ${isOpen ? 'bottom-0' : 'bottom-[-85vh]'}`}
        style={{ maxHeight: '80vh' }}
      >
        <div className="bg-white rounded-t-2xl border-t border-gray-200 shadow-2xl flex flex-col" style={{ maxHeight: '80vh' }}>

          {/* Pull Handle */}
          <div className="flex justify-center pt-3 pb-2 cursor-pointer" onClick={onToggleOpen}>
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Mobile Header */}
          <div className="px-4 pb-3 shrink-0 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-gray-900">Explore Pandals</h2>
                <p className="text-[10px] text-gray-400">Bengaluru Ganesh Utsava 2025</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                  {pandals.length} LIVE
                </div>
                <button onClick={onToggleOpen} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search pandals in Bengaluru…"
                className="w-full pl-9 pr-8 py-2.5 bg-gray-100 text-gray-800 placeholder:text-gray-400 text-sm rounded-xl border border-transparent focus:border-[#8B1A1A]/30 focus:bg-white focus:outline-none transition font-medium"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => onFilterToggle(f.id)}
                    className={`shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-[#8B1A1A] to-[#a82323] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-500'
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
            {pandals.map((pandal) => (
              <PandalCard
                key={pandal.id}
                pandal={pandal}
                isSelected={selectedPandal?.id === pandal.id}
                onClick={() => { onSelectPandal(pandal); onToggleOpen(); }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Open FAB */}
      {!isOpen && (
        <button
          onClick={onToggleOpen}
          className="sm:hidden fixed bottom-16 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-[#8B1A1A] to-[#a82323] text-white text-sm font-black px-6 py-3 rounded-full shadow-2xl shadow-[#8B1A1A]/40 flex items-center gap-2 border border-[#6f1515] transition-all active:scale-95"
        >
          View {pandals.length} Pandals
        </button>
      )}
    </>
  );
}
