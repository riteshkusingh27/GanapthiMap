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
  onNavigateToAdmin,
  totalPandalsCount,
  verifiedCount
}) {
  return (
    <header className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 z-20 pointer-events-none flex flex-col gap-2.5 max-w-5xl mx-auto font-sans">
      
      {/* Luxury Dark Glass Floating Header Card */}
      <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-amber-500/10 border border-amber-500/35 p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-300">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3 px-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-xl shadow-amber-500/20 border border-amber-400/50 bg-gradient-to-br from-amber-500/20 to-slate-900 flex items-center justify-center p-1 shrink-0 hover:scale-105 transition duration-300">
              <img src={logoImg} alt="GanapathiMap Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-extrabold text-white tracking-wider text-xl sm:text-2xl leading-none">
                  Ganapathi<span className="gold-gradient-text font-sans font-black">Map</span>
                </h1>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/40 uppercase tracking-widest">
                  Bengaluru
                </span>
              </div>
              <p className="text-[11px] text-amber-200/80 font-medium tracking-tight mt-0.5">
                🪔 {verifiedCount} Verified Pandals Live
              </p>
            </div>
          </div>

          {/* Quick Mobile Action Buttons */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onNavigateToAdmin && onNavigateToAdmin()}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 shadow-md"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              /admin
            </button>
            <button
              onClick={onLocateMe}
              title="Near Me"
              className="p-2 rounded-xl bg-blue-600/90 text-white shadow-md"
            >
              <Navigation className="w-4 h-4 fill-white" />
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-md"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="pointer-events-auto relative w-full sm:flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/80" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pandal name or area (e.g. Basavanagudi, Whitefield)..."
            className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-slate-900/90 text-white placeholder:text-slate-400 rounded-2xl border border-slate-800 focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/40 focus:outline-none transition font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={onLocateMe}
            className="px-3.5 py-2.5 rounded-2xl bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-blue-600/25 transition"
          >
            <Navigation className="w-3.5 h-3.5 fill-white" />
            Near Me
          </button>

          <button
            onClick={onOpenEventsModal}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1.5 transition"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            Events
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Add Pandal
          </button>

          <button
            onClick={() => onNavigateToAdmin && onNavigateToAdmin()}
            className="px-3.5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md transition"
          >
            <ShieldAlert className="w-4 h-4 text-slate-950" />
            /admin
          </button>

          <button
            onClick={onOpenAdminDrawer}
            title="Admin Moderation Console"
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
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
            className="bg-slate-950/90 backdrop-blur-2xl text-amber-300 font-extrabold text-xs py-2 pl-3 pr-7 rounded-2xl border border-amber-500/40 shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
          >
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc} className="bg-slate-900 text-white font-bold">
                📍 {loc === 'All' ? 'All Bengaluru Areas' : loc}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Eco-Friendly Filter */}
        <button
          onClick={() => onFilterToggle('eco')}
          className={`shrink-0 font-extrabold text-xs py-2 px-3.5 rounded-2xl border shadow-xl flex items-center gap-1.5 transition ${
            activeFilter === 'eco'
              ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/40'
              : 'bg-slate-950/90 backdrop-blur-2xl text-slate-200 border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          Eco Clay
        </button>

        {/* Annadanam / Prasad Filter */}
        <button
          onClick={() => onFilterToggle('annadanam')}
          className={`shrink-0 font-extrabold text-xs py-2 px-3.5 rounded-2xl border shadow-xl flex items-center gap-1.5 transition ${
            activeFilter === 'annadanam'
              ? 'bg-orange-600 text-white border-orange-400 ring-2 ring-orange-400/40'
              : 'bg-slate-950/90 backdrop-blur-2xl text-slate-200 border-slate-800 hover:border-orange-500/50 hover:text-orange-400'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 text-orange-400" />
          Prasad Seva
        </button>

        {/* Featured Filter */}
        <button
          onClick={() => onFilterToggle('featured')}
          className={`shrink-0 font-extrabold text-xs py-2 px-3.5 rounded-2xl border shadow-xl flex items-center gap-1.5 transition ${
            activeFilter === 'featured'
              ? 'bg-amber-600 text-white border-amber-400 ring-2 ring-amber-400/40'
              : 'bg-slate-950/90 backdrop-blur-2xl text-slate-200 border-slate-800 hover:border-amber-500/50 hover:text-amber-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Featured Pandals
        </button>

        {/* Trending Filter */}
        <button
          onClick={() => onFilterToggle('trending')}
          className={`shrink-0 font-extrabold text-xs py-2 px-3.5 rounded-2xl border shadow-xl flex items-center gap-1.5 transition ${
            activeFilter === 'trending'
              ? 'bg-red-600 text-white border-red-400 ring-2 ring-red-400/40'
              : 'bg-slate-950/90 backdrop-blur-2xl text-slate-200 border-slate-800 hover:border-red-500/50 hover:text-red-400'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-red-400" />
          Trending
        </button>
      </div>
    </header>
  );
}
