import React from 'react';
import { Search, MapPin, Filter, PlusCircle, Leaf, Sparkles, Utensils, ShieldCheck, Flame, Calendar, Navigation, ShieldAlert, ChevronDown } from 'lucide-react';
import { LOCALITIES } from '../data/pandalsData';
import logoImg from '../assets/logo.png';

export default function HeaderSearch({
  searchQuery,
  onSearchChange,
  selectedLocality,
  onLocalityChange,
  activeFilter,
  onFilterToggle,
  onLocateMe,
  onOpenAddModal,
  onOpenAdminDrawer,
  onOpenEventsModal,
  totalPandalsCount,
  verifiedCount
}) {
  return (
    <header className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 z-20 pointer-events-none flex flex-col gap-2.5 max-w-4xl mx-auto">
      
      {/* Main Glass Floating Header Card */}
      <div className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-200/70 p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-300">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3 px-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-amber-600/25 border border-amber-300/50 bg-white flex items-center justify-center p-0.5 shrink-0 hover:scale-105 transition">
              <img src={logoImg} alt="GanapathiMap Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-slate-900 tracking-tight text-lg sm:text-xl leading-none">
                  Ganapathi<span className="text-amber-600 font-sans font-extrabold">Map</span>
                </h1>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300/80 uppercase tracking-wider">
                  Bengaluru
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
                {verifiedCount} Verified Pandals Mapped
              </p>
            </div>
          </div>

          {/* Quick Mobile Action Buttons */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onLocateMe}
              title="Near Me"
              className="p-2 rounded-xl bg-slate-100/90 text-slate-700 hover:bg-slate-200 transition"
            >
              <Navigation className="w-4 h-4 text-blue-600 fill-blue-600" />
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-600/25"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="pointer-events-auto relative w-full sm:flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pandal name or locality (e.g. Basavanagudi, Whitefield)..."
            className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50/90 hover:bg-slate-100/80 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition font-medium placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onLocateMe}
            className="px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 border border-blue-200/80 shadow-sm transition"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            Near Me
          </button>

          <button
            onClick={onOpenEventsModal}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition border border-slate-200/60"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            Events
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/25 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Add Pandal
          </button>

          <button
            onClick={onOpenAdminDrawer}
            title="Admin Moderation Console"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200/60"
          >
            <ShieldAlert className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Scrollable Filter Pills Row */}
      <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar px-1">
        {/* Locality Selector Dropdown */}
        <div className="relative shrink-0">
          <select
            value={selectedLocality}
            onChange={(e) => onLocalityChange(e.target.value)}
            className="bg-white/90 backdrop-blur-xl text-slate-800 font-bold text-xs py-2 pl-3 pr-7 rounded-xl border border-amber-200/80 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
          >
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>
                📍 {loc === 'All' ? 'All Localities' : loc}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Eco-Friendly Filter */}
        <button
          onClick={() => onFilterToggle('eco')}
          className={`shrink-0 font-bold text-xs py-2 px-3.5 rounded-xl border shadow-md flex items-center gap-1.5 transition ${
            activeFilter === 'eco'
              ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400/40'
              : 'bg-white/90 backdrop-blur-xl text-slate-700 border-slate-200 hover:bg-emerald-50'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-500" />
          Eco-Friendly
        </button>

        {/* Annadanam / Prasad Filter */}
        <button
          onClick={() => onFilterToggle('annadanam')}
          className={`shrink-0 font-bold text-xs py-2 px-3.5 rounded-xl border shadow-md flex items-center gap-1.5 transition ${
            activeFilter === 'annadanam'
              ? 'bg-orange-600 text-white border-orange-700 ring-2 ring-orange-400/40'
              : 'bg-white/90 backdrop-blur-xl text-slate-700 border-slate-200 hover:bg-orange-50'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 text-orange-500" />
          Prasad (Annadanam)
        </button>

        {/* Featured Filter */}
        <button
          onClick={() => onFilterToggle('featured')}
          className={`shrink-0 font-bold text-xs py-2 px-3.5 rounded-xl border shadow-md flex items-center gap-1.5 transition ${
            activeFilter === 'featured'
              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400/40'
              : 'bg-white/90 backdrop-blur-xl text-slate-700 border-slate-200 hover:bg-amber-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Featured Pandals
        </button>

        {/* Trending Filter */}
        <button
          onClick={() => onFilterToggle('trending')}
          className={`shrink-0 font-bold text-xs py-2 px-3.5 rounded-xl border shadow-md flex items-center gap-1.5 transition ${
            activeFilter === 'trending'
              ? 'bg-red-600 text-white border-red-700 ring-2 ring-red-400/40'
              : 'bg-white/90 backdrop-blur-xl text-slate-700 border-slate-200 hover:bg-red-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-red-500" />
          Trending
        </button>
      </div>
    </header>
  );
}
